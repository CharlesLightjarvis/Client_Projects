<?php

namespace App\Services;

use App\Models\LessonProgress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ProgressService
{
    /**
     * Get all progress records.
     */
    public function getAllProgress(): Collection
    {
        return LessonProgress::with(['student', 'lesson'])->get();
    }

    /**
     * Mark a lesson as completed for a student.
     */
    public function markLessonCompleted(string $studentId, string $lessonId, ?float $score = null): LessonProgress
    {
        return DB::transaction(function () use ($studentId, $lessonId, $score) {
            $progress = LessonProgress::firstOrCreate(
                [
                    'student_id' => $studentId,
                    'lesson_id' => $lessonId,
                ],
                [
                    'completed' => false,
                ]
            );

            $progress->markAsCompleted($score);

            return $progress->fresh();
        });
    }

    /**
     * Mark a lesson as incomplete for a student.
     */
    public function markLessonIncomplete(string $studentId, string $lessonId): LessonProgress
    {
        return DB::transaction(function () use ($studentId, $lessonId) {
            $progress = LessonProgress::where('student_id', $studentId)
                ->where('lesson_id', $lessonId)
                ->firstOrFail();

            $progress->markAsIncomplete();

            return $progress->fresh();
        });
    }

    /**
     * Get progress for a specific student.
     */
    public function getStudentProgress(string $studentId): Collection
    {
        return LessonProgress::where('student_id', $studentId)
            ->with(['lesson.module.formation'])
            ->get();
    }

    /**
     * Get progress for a specific lesson.
     */
    public function getLessonProgress(string $lessonId): Collection
    {
        return LessonProgress::where('lesson_id', $lessonId)
            ->with('student')
            ->get();
    }

    /**
     * Get completion percentage for a student in a specific formation.
     */
    public function getFormationCompletionPercentage(string $studentId, string $formationId): float
    {
        $formation = \App\Models\Formation::with('modules.lessons')->findOrFail($formationId);

        $totalLessons = $formation->modules->sum(function ($module) {
            return $module->lessons->count();
        });

        if ($totalLessons === 0) {
            return 0;
        }

        $lessonIds = $formation->modules->flatMap(function ($module) {
            return $module->lessons->pluck('id');
        });

        $completedLessons = LessonProgress::where('student_id', $studentId)
            ->whereIn('lesson_id', $lessonIds)
            ->where('completed', true)
            ->count();

        return round(($completedLessons / $totalLessons) * 100, 2);
    }

    /**
     * Get completion percentage for a student in a specific module.
     */
    public function getModuleCompletionPercentage(string $studentId, string $moduleId): float
    {
        $module = \App\Models\Module::with('lessons')->findOrFail($moduleId);

        $totalLessons = $module->lessons->count();

        if ($totalLessons === 0) {
            return 0;
        }

        $completedLessons = LessonProgress::where('student_id', $studentId)
            ->whereIn('lesson_id', $module->lessons->pluck('id'))
            ->where('completed', true)
            ->count();

        return round(($completedLessons / $totalLessons) * 100, 2);
    }
}
