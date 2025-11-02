<?php

namespace App\Services;

use App\Models\Lesson;
use Illuminate\Support\Facades\DB;

class LessonService
{
    /**
     * Get all lessons.
     */
    public function getAllLessons()
    {
        return Lesson::orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new lesson.
     */
    public function createLesson(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Lesson::create($data);
        });
    }

    /**
     * Update an existing lesson.
     */
    public function updateLesson(Lesson $lesson, array $data)
    {
        return DB::transaction(function () use ($lesson, $data) {
            $lesson->update($data);

            return $lesson->fresh();
        });
    }
}