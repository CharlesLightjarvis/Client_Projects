<?php

namespace App\Services;

use App\Enums\EnrollmentStatus;
use App\Enums\UserRoleEnum;
use App\Models\CourseSession;
use App\Models\Enrollment;
use App\Models\ModuleSessionInstructor;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CourseSessionService
{
    /**
     * Get all course sessions.
     */
    public function getAllCourseSessions(): Collection
    {
        return CourseSession::with([
            'formation.modules',
            'enrollments.student',
            'currentInstructors.instructor',
            'currentInstructors.module',
            'instructorHistory.instructor',
            'instructorHistory.module'
        ])
        ->orderBy('created_at', 'desc')
        ->get();
    }

    /**
     * Get a single course session with all relationships.
     */
    public function getCourseSession(CourseSession $courseSession): CourseSession
    {
        return $courseSession->load([
            'formation.modules.lessons',
            'enrollments.student',
            'currentInstructors.instructor',
            'currentInstructors.module',
            'instructorHistory.instructor',
            'instructorHistory.module'
        ]);
    }

    /**
     * Create a new course session.
     * Optionally assigns instructors to modules for this session.
     */
    public function createCourseSession(array $data): CourseSession
    {
        $courseSession = DB::transaction(function () use ($data) {
            // Extract module instructors if provided
            $moduleInstructorsData = $data['module_instructors'] ?? [];
            unset($data['module_instructors']);

            $courseSession = CourseSession::create($data);

            // Assign instructors to modules for this session if provided
            if (!empty($moduleInstructorsData)) {
                foreach ($moduleInstructorsData as $assignment) {
                    ModuleSessionInstructor::create([
                        'course_session_id' => $courseSession->id,
                        'module_id' => $assignment['module_id'],
                        'instructor_id' => $assignment['instructor_id'],
                        'started_at' => now(),
                        'ended_at' => null, // Instructeur actif
                    ]);
                }
            }

            return $courseSession;
        });

        return $courseSession->fresh([
            'formation.modules',
            'enrollments',
            'currentInstructors.instructor',
            'currentInstructors.module',
            'instructorHistory.instructor',
            'instructorHistory.module'
        ]);
    }

    /**
     * Update an existing course session.
     * Optionally update instructor assignments for modules.
     */
    public function updateCourseSession(CourseSession $courseSession, array $data): CourseSession
    {
        DB::transaction(function () use ($courseSession, $data) {
            // Extract module instructors if provided
            $moduleInstructorsData = $data['module_instructors'] ?? [];
            unset($data['module_instructors']);

            // Update course session basic info
            $courseSession->update($data);

            // Update module instructor assignments if provided
            if (!empty($moduleInstructorsData)) {
                // Fermer les assignations actuelles (mettre ended_at) au lieu de supprimer
                ModuleSessionInstructor::where('course_session_id', $courseSession->id)
                    ->whereNull('ended_at')
                    ->update(['ended_at' => now()]);

                // Créer les nouvelles assignations
                foreach ($moduleInstructorsData as $assignment) {
                    ModuleSessionInstructor::create([
                        'course_session_id' => $courseSession->id,
                        'module_id' => $assignment['module_id'],
                        'instructor_id' => $assignment['instructor_id'],
                        'started_at' => now(),
                        'ended_at' => null, // Instructeur actif
                    ]);
                }
            }
        });

        return $courseSession->fresh([
            'formation.modules',
            'enrollments',
            'currentInstructors.instructor',
            'currentInstructors.module',
            'instructorHistory.instructor',
            'instructorHistory.module'
        ]);
    }

    /**
     * Get course sessions by instructor.
     * Returns sessions where the instructor teaches or has taught at least one module.
     */
    public function getCourseSessionsByInstructor(string $instructorId): Collection
    {
        return CourseSession::whereHas('instructorHistory', fn($query) => $query->where('instructor_id', $instructorId))
            ->with([
                'formation',
                'enrollments',
                'currentInstructors.instructor',
                'currentInstructors.module',
                'instructorHistory.instructor',
                'instructorHistory.module'
            ])
            ->get();
    }

    /**
     * Get course sessions by student.
     */
    public function getCourseSessionsByStudent(string $studentId): Collection
    {
        return CourseSession::whereHas('enrollments', fn($query) => $query->where('student_id', $studentId))
            ->with([
                'formation',
                'currentInstructors.instructor',
                'currentInstructors.module',
                'instructorHistory.instructor',
                'instructorHistory.module'
            ])
            ->get();
    }

    /**
     * Get students enrolled in a specific course session with their enrollment_id.
     * Returns a collection where each student has an enrollment_id attribute.
     * Only returns confirmed enrollments.
     */
    public function getSessionStudents(CourseSession $courseSession): Collection
    {
        $enrollments = $courseSession->enrollments()
            ->where('status', EnrollmentStatus::CONFIRMED)
            ->with('student')
            ->get();

        // Map enrollments to array with student data + enrollment_id
        return $enrollments->map(function ($enrollment) {
            $studentData = $enrollment->student->toArray();
            $studentData['enrollment_id'] = $enrollment->id;
            return $studentData;
        })->sortBy([
            ['first_name', 'asc'],
            ['last_name', 'asc'],
        ])->values();
    }

    /**
     * Get students available for enrollment (not yet enrolled in this session).
     * Only considers confirmed enrollments - excludes students with PENDING, CONFIRMED or CANCELLED status.
     */
    public function getAvailableStudents(string $courseSessionId): Collection
    {
        $enrolledStudentIds = Enrollment::where('course_session_id', $courseSessionId)
            ->whereIn('status', [EnrollmentStatus::CONFIRMED, EnrollmentStatus::PENDING])
            ->pluck('student_id')
            ->toArray();

        return User::whereHas('roles', function ($query) {
            $query->where('name', UserRoleEnum::STUDENT->value);
        })
        ->whereNotIn('id', $enrolledStudentIds)
        ->orderBy('first_name')
        ->orderBy('last_name')
        ->get();
    }
}
