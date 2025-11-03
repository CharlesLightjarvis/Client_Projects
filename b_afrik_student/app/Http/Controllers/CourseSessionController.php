<?php

namespace App\Http\Controllers;

use App\Http\Requests\course_sessions\StoreSessionRequest;
use App\Http\Requests\course_sessions\UpdateSessionRequest;
use App\Http\Resources\CourseSessionResource;
use App\Models\CourseSession;
use App\Services\CourseSessionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class CourseSessionController extends Controller
{
    use ApiResponse;


    public function __construct(protected CourseSessionService $courseSessionService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $courseSessions = $this->courseSessionService->getAllCourseSessions();

        return $this->successResponse(
            CourseSessionResource::collection($courseSessions),
            'Course sessions retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSessionRequest $request): JsonResponse
    {
        $courseSession = $this->courseSessionService->createCourseSession($request->validated());

        return $this->createdSuccessResponse(
            new CourseSessionResource($courseSession),
            'Course session created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseSession $courseSession): JsonResponse
    {
        $courseSession->load(['formation', 'instructor', 'enrollments.student']);

        return $this->successResponse(
            new CourseSessionResource($courseSession),
            'Course session retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSessionRequest $request, CourseSession $courseSession): JsonResponse
    {
        $courseSession = $this->courseSessionService->updateCourseSession($courseSession, $request->validated());

        return $this->successResponse(
            new CourseSessionResource($courseSession),
            'Course session updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseSession $courseSession): JsonResponse
    {
        $courseSession->delete();

        return $this->deletedSuccessResponse('Course session deleted successfully');
    }
}
