<?php

namespace App\Services;

use App\Enums\EnrollmentStatus;
use App\Enums\PaymentStatus;
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
     * Enroll students in a course session (supports single or bulk).
     *
     * @throws \Exception
     * @return array{success: int, enrollments: Collection}
     */
    public function enrollStudents(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $courseSession = CourseSession::findOrFail($data['course_session_id']);

            // Normalize student_id(s) to array
            $studentIds = isset($data['student_ids'])
                ? $data['student_ids']
                : [$data['student_id']];

            // Check if course session has enough capacity
            $availableSpots = $courseSession->availableSpots();
            $requestedCount = count($studentIds);

            if ($requestedCount > $availableSpots) {
                throw new \Exception("Not enough available spots. Requested: {$requestedCount}, Available: {$availableSpots}");
            }

            // Set defaults
            $enrollmentDate =  now();
            $status =  EnrollmentStatus::CONFIRMED; // Auto-confirmed
            $paymentStatus =  PaymentStatus::UNPAID;

            $enrollments = new Collection();

            foreach ($studentIds as $studentId) {
                // Check if student already has an enrollment (active or cancelled)
                $existingEnrollment = Enrollment::where('student_id', $studentId)
                    ->where('course_session_id', $data['course_session_id'])
                    ->first();

                if ($existingEnrollment) {
                    // If already active, throw error
                    if ($existingEnrollment->status !== EnrollmentStatus::CANCELLED) {
                        throw new \Exception("Student is already enrolled in this session");
                    }

                    // Reactivate cancelled enrollment
                    $existingEnrollment->update([
                        'enrollment_date' => $enrollmentDate,
                        'status' => $status,
                        'payment_status' => $paymentStatus,
                    ]);

                    $enrollment = $existingEnrollment;
                } else {
                    // Create new enrollment
                    $enrollment = Enrollment::create([
                        'student_id' => $studentId,
                        'course_session_id' => $data['course_session_id'],
                        'enrollment_date' => $enrollmentDate,
                        'status' => $status,
                        'payment_status' => $paymentStatus,
                    ]);
                }

                $enrollments->push($enrollment);
            }

            return [
                'success' => $enrollments->count(),
                'enrollments' => $enrollments->load(['student', 'courseSession']),
            ];
        });
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
     * Unenroll (cancel) students from a course session (supports single or bulk).
     *
     * @throws \Exception
     * @return array{success: int, message: string}
     */
    public function unenrollStudents(array $data): array
    {
        return DB::transaction(function () use ($data) {
            // Normalize enrollment_id(s) to array
            $enrollmentIds = isset($data['enrollment_ids'])
                ? $data['enrollment_ids']
                : [$data['enrollment_id']];

            $cancelledCount = 0;

            foreach ($enrollmentIds as $enrollmentId) {
                $enrollment = Enrollment::findOrFail($enrollmentId);

                // Set status to CANCELLED instead of deleting
                $enrollment->update(['status' => EnrollmentStatus::CANCELLED]);
                $cancelledCount++;
            }

            return [
                'success' => $cancelledCount,
                'message' => $cancelledCount === 1
                    ? 'Student unenrolled successfully'
                    : "{$cancelledCount} students unenrolled successfully"
            ];
        });
    }

}
