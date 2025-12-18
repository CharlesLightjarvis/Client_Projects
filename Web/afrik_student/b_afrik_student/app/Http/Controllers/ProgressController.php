<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProgressResource;
use App\Services\ProgressService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    use ApiResponse;

    public function __construct(protected ProgressService $progressService)
    {
    }

    /**
     * Mark a lesson as completed.
     * POST /api/lessons/{lessonId}/complete
     */
    public function markLessonCompleted(Request $request, string $lessonId): JsonResponse
    {
        $request->validate([
            'student_id' => ['required', 'uuid', 'exists:users,id'],
            'score' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        try {
            $progress = $this->progressService->markLessonCompleted(
                $request->student_id,
                $lessonId,
                $request->score
            );

            return $this->successResponse(
                new ProgressResource($progress),
                'Lesson marked as completed'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Mark a lesson as incomplete.
     * POST /api/lessons/{lessonId}/incomplete
     */
    public function markLessonIncomplete(Request $request, string $lessonId): JsonResponse
    {
        $request->validate([
            'student_id' => ['required', 'uuid', 'exists:users,id'],
        ]);

        try {
            $progress = $this->progressService->markLessonIncomplete(
                $request->student_id,
                $lessonId
            );

            return $this->successResponse(
                new ProgressResource($progress),
                'Lesson marked as incomplete'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Get progress for a student.
     * GET /api/students/{studentId}/progress
     */
    public function getStudentProgress(string $studentId): JsonResponse
    {
        $progress = $this->progressService->getStudentProgress($studentId);

        return $this->successResponse(
            ProgressResource::collection($progress),
            'Student progress retrieved successfully'
        );
    }

    /**
     * Get progress for a lesson.
     * GET /api/lessons/{lessonId}/progress
     */
    public function getLessonProgress(string $lessonId): JsonResponse
    {
        $progress = $this->progressService->getLessonProgress($lessonId);

        return $this->successResponse(
            ProgressResource::collection($progress),
            'Lesson progress retrieved successfully'
        );
    }

    /**
     * Get formation completion percentage for a student.
     * GET /api/students/{studentId}/formations/{formationId}/completion
     */
    public function getFormationCompletion(string $studentId, string $formationId): JsonResponse
    {
        $percentage = $this->progressService->getFormationCompletionPercentage($studentId, $formationId);

        return $this->successResponse(
            ['completion_percentage' => $percentage],
            'Formation completion retrieved successfully'
        );
    }

    /**
     * Get module completion percentage for a student.
     * GET /api/students/{studentId}/modules/{moduleId}/completion
     */
    public function getModuleCompletion(string $studentId, string $moduleId): JsonResponse
    {
        $percentage = $this->progressService->getModuleCompletionPercentage($studentId, $moduleId);

        return $this->successResponse(
            ['completion_percentage' => $percentage],
            'Module completion retrieved successfully'
        );
    }
}
