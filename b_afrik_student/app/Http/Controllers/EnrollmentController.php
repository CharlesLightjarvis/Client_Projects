<?php

namespace App\Http\Controllers;

use App\Http\Requests\enrollments\StoreEnrollmentRequest;
use App\Http\Requests\enrollments\UpdateEnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use App\Services\EnrollmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class EnrollmentController extends Controller
{
    use ApiResponse;

    public function __construct(protected EnrollmentService $enrollmentService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $enrollments = $this->enrollmentService->getAllEnrollments();

        return $this->successResponse(
            EnrollmentResource::collection($enrollments),
            'Enrollments retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage (Enroll a student).
     */
    public function store(StoreEnrollmentRequest $request): JsonResponse
    {
        try {
            $enrollment = $this->enrollmentService->enrollStudent($request->validated());

            return $this->createdSuccessResponse(
                new EnrollmentResource($enrollment),
                'Student enrolled successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Enrollment $enrollment): JsonResponse
    {
        $enrollment->load(['student', 'courseSession.formation', 'courseSession.instructor']);

        return $this->successResponse(
            new EnrollmentResource($enrollment),
            'Enrollment retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnrollmentRequest $request, Enrollment $enrollment): JsonResponse
    {
        $enrollment = $this->enrollmentService->updateEnrollment($enrollment, $request->validated());

        return $this->successResponse(
            new EnrollmentResource($enrollment),
            'Enrollment updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage (Cancel enrollment).
     */
    public function destroy(Enrollment $enrollment): JsonResponse
    {
        $this->enrollmentService->cancelEnrollment($enrollment);

        return $this->deletedSuccessResponse('Enrollment cancelled successfully');
    }

    /**
     * Confirm an enrollment.
     */
    public function confirm(Enrollment $enrollment): JsonResponse
    {
        $this->enrollmentService->confirmEnrollment($enrollment);

        $enrollment->load(['student', 'courseSession']);

        return $this->successResponse(
            new EnrollmentResource($enrollment->fresh()),
            'Enrollment confirmed successfully'
        );
    }

    /**
     * Cancel an enrollment (alternative to destroy).
     */
    public function cancelEnrollment(Enrollment $enrollment): JsonResponse
    {
        $this->enrollmentService->cancelEnrollment($enrollment);

        $enrollment->load(['student', 'courseSession']);

        return $this->successResponse(
            new EnrollmentResource($enrollment->fresh()),
            'Enrollment cancelled successfully'
        );
    }
}
