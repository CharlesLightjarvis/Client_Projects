<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Lesson\StoreLessonRequest;
use App\Http\Requests\v1\Lesson\UpdateLessonRequest;
use App\Models\Lesson;
use App\Http\Services\V1\LessonService;
use App\Trait\ApiResponse;

class LessonController extends Controller
{
    use ApiResponse;

    protected $lessonService;

    public function __construct(LessonService $lessonService)
    {
        $this->lessonService = $lessonService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lessons = $this->lessonService->getAllLessons();
        return $this->successResponse('Lessons retrieved successfully', 'lessons', $lessons);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonRequest $request)
    {
        $is_created = $this->lessonService->createLesson($request->validated());
        if ($is_created) {
            return $this->successNoData('Lesson created successfully');
        }
        return $this->errorResponse('Lesson already exists or failed to create check the data', 400);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $lesson = $this->lessonService->getLessonById($id);
        return $this->successResponse('Lesson retrieved successfully', 'lesson', $lesson);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonRequest $request, $id)
    {
        $is_updated = $this->lessonService->updateLesson($id, $request->validated());
        if ($is_updated) {
            return $this->successNoData('Lesson updated successfully');
        }
        return $this->errorResponse('Lesson not found or cannot be updated ', 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $is_deleted = $this->lessonService->deleteLesson($id);
        if ($is_deleted) {
            return $this->successNoData('Lesson deleted successfully');
        }
        return $this->errorResponse('Lesson not found or cannot be deleted ', 400);
    }
}
