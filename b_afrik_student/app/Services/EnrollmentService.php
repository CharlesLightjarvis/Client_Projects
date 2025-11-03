<?php

namespace App\Services;

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\CourseSession;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class EnrollmentService
{
    /**
     * Get all enrollments.
     */
    public function getAllEnrollments(): Collection
    {
        return Enrollment::with(['student', 'courseSession.formation'])->get();
    }

    /**
     * Enroll a student in a course session.
     *
     * @throws \Exception
     */
    public function enrollStudent(array $data): Enrollment
    {
        return DB::transaction(function () use ($data) {
            $courseSession = CourseSession::findOrFail($data['course_session_id']);

            // Check if course session is full
            if ($courseSession->isFull()) {
                throw new \Exception('Course session is full. Cannot enroll more students.');
            }

            // Check if student is already enrolled
            $existingEnrollment = Enrollment::where('student_id', $data['student_id'])
                ->where('course_session_id', $data['course_session_id'])
                ->first();

            if ($existingEnrollment) {
                throw new \Exception('Student is already enrolled in this course session.');
            }

            // Set enrollment date to now if not provided
            if (!isset($data['enrollment_date'])) {
                $data['enrollment_date'] = now();
            }

            return Enrollment::create($data);
        });
    }

    /**
     * Update an enrollment.
     */
    public function updateEnrollment(Enrollment $enrollment, array $data): Enrollment
    {
        DB::transaction(function () use ($enrollment, $data) {
            $enrollment->update($data);
        });

        return $enrollment->fresh();
    }

    /**
     * Get enrollments by course session.
     */
    public function getEnrollmentsByCourseSession(string $courseSessionId): Collection
    {
        return Enrollment::where('course_session_id', $courseSessionId)
            ->with('student')
            ->get();
    }

    /**
     * Get enrollments by student.
     */
    public function getEnrollmentsByStudent(string $studentId): Collection
    {
        return Enrollment::where('student_id', $studentId)
            ->with(['courseSession.formation', 'courseSession.instructor'])
            ->get();
    }

    /**
     * Cancel an enrollment.
     */
    public function cancelEnrollment(Enrollment $enrollment): void
    {
        DB::transaction(function () use ($enrollment) {
            $enrollment->cancel();
        });
    }

    /**
     * Confirm an enrollment.
     */
    public function confirmEnrollment(Enrollment $enrollment): void
    {
        DB::transaction(function () use ($enrollment) {
            $enrollment->confirm();
        });
    }
}
