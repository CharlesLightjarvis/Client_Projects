<?php

namespace App\Http\Controllers;

use App\Http\Requests\lessons\StoreLessonRequest;
use App\Http\Requests\lessons\UpdateLessonRequest;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use App\Services\LessonService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{
    public function __construct(protected LessonService $lessonService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->successResponse(
            LessonResource::collection($this->lessonService->getAllLessons()),
            'Lessons retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonRequest $request)
    {
        $lesson = $this->lessonService->createLesson($request->validated());
        return $this->successResponse(
            LessonResource::make($lesson),
            'Lesson created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Lesson $lesson)
    {
        return $this->successResponse(
            LessonResource::make($lesson),
            'Lesson fetched successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonRequest $request, Lesson $lesson)
    {
        $lesson = $this->lessonService->updateLesson($lesson, $request->validated());
        return $this->successResponse(
            LessonResource::make($lesson),
            'Lesson updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lesson $lesson)
    {
        $this->lessonService->deleteLesson($lesson);
        return $this->deletedSuccessResponse('Lesson deleted successfully');
    }

    /**
     * Get all lessons that the authenticated instructor teaches.
     */
    public function getInstructorLessons(Request $request)
    {
        $courseSessionId = $request->query('course_session_id');

        $lessons = $this->lessonService->getInstructorLessons(
            Auth::user(),
            $courseSessionId
        );

        return $this->successResponse(
            LessonResource::collection($lessons),
            'Instructor lessons retrieved successfully'
        );
    }
}
