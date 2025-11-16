<?php

namespace App\Http\Controllers;

use App\Http\Requests\course_sessions\StoreCourseSessionRequest;
use App\Http\Requests\course_sessions\UpdateCourseSessionRequest;
use App\Http\Resources\CourseSessionResource;
use App\Http\Resources\UserResource;
use App\Models\CourseSession;
use App\Services\CourseSessionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
    public function store(StoreCourseSessionRequest $request): JsonResponse
    {
        $courseSession = $this->courseSessionService->createCourseSession($request->validated());

        return $this->createdSuccessResponse(
            CourseSessionResource::make($courseSession),
            'Course session created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseSession $courseSession): JsonResponse
    {
        $courseSession = $this->courseSessionService->getCourseSession($courseSession);

        return $this->successResponse(
            CourseSessionResource::make($courseSession),
            'Course session retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseSessionRequest $request, CourseSession $courseSession): JsonResponse
    {
        $courseSession = $this->courseSessionService->updateCourseSession($courseSession, $request->validated());

        return $this->successResponse(
            CourseSessionResource::make($courseSession),
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

    public function getCourseSessionsByInstructor(string $instructorId): JsonResponse
    {
        $courseSessions = $this->courseSessionService->getCourseSessionsByInstructor($instructorId);

        return $this->successResponse(
            CourseSessionResource::collection($courseSessions),
            'Course sessions retrieved successfully for instructor'
        );
    }

    public function getCourseSessionsByStudent(string $studentId): JsonResponse
    {
        $courseSessions = $this->courseSessionService->getCourseSessionsByStudent($studentId);

        return $this->successResponse(
            CourseSessionResource::collection($courseSessions),
            'Course sessions retrieved successfully for student'
        );
    }

    /**
     * Get students enrolled in a specific course session.
     */
    public function getSessionStudents(CourseSession $courseSession): JsonResponse
    {
        $students = $this->courseSessionService->getSessionStudents($courseSession);

        // Students are already formatted as arrays with enrollment_id, return directly
        return $this->successResponse(
            $students,
            'Students retrieved successfully'
        );
    }

    /**
     * Get students available for enrollment (not yet enrolled in this session).
     */
    public function getAvailableStudents(CourseSession $courseSession): JsonResponse
    {
        $students = $this->courseSessionService->getAvailableStudents($courseSession->id);

        return $this->successResponse(
            UserResource::collection($students),
            'Available students retrieved successfully'
        );
    }

}
