<?php

namespace App\Services;

use App\Models\CourseSession;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CourseSessionService
{
    /**
     * Get all course sessions.
     */
    public function getAllCourseSessions(): Collection
    {
        return CourseSession::with(['formation', 'instructor', 'enrollments.student'])->get();
    }

    /**
     * Create a new course session.
     */
    public function createCourseSession(array $data): CourseSession
    {
        return DB::transaction(function () use ($data) {
            return CourseSession::create($data);
        });
    }

    /**
     * Update an existing course session.
     */
    public function updateCourseSession(CourseSession $courseSession, array $data): CourseSession
    {
        DB::transaction(function () use ($courseSession, $data) {
            $courseSession->update($data);
        });

        return $courseSession->fresh();
    }

    /**
     * Get course sessions by formation.
     */
    public function getCourseSessionsByFormation(string $formationId): Collection
    {
        return CourseSession::where('formation_id', $formationId)
            ->with(['instructor', 'enrollments'])
            ->get();
    }

    /**
     * Get course sessions by instructor.
     */
    public function getCourseSessionsByInstructor(string $instructorId): Collection
    {
        return CourseSession::where('instructor_id', $instructorId)
            ->with(['formation', 'enrollments'])
            ->get();
    }

    /**
     * Get available course sessions (not full and not cancelled).
     */
    public function getAvailableCourseSessions(): Collection
    {
        return CourseSession::where('status', '!=', 'cancelled')
            ->with(['formation', 'instructor'])
            ->get()
            ->filter(function ($courseSession) {
                return !$courseSession->isFull();
            });
    }
}
