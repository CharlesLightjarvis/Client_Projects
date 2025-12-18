<?php

namespace App\Http\Controllers;

use App\Http\Requests\enrollments\EnrollStudentsRequest;
use App\Http\Requests\enrollments\UpdateEnrollmentRequest;
use App\Http\Requests\enrollments\UnenrollStudentsRequest;
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
     * Store a newly created resource in storage (Enroll students - single or bulk).
     */
    public function store(EnrollStudentsRequest $request): JsonResponse
    {
        try {
            $result = $this->enrollmentService->enrollStudents($request->validated());

            return $this->createdSuccessResponse(
                [
                    'success' => $result['success'],
                    'enrollments' => EnrollmentResource::collection($result['enrollments']),
                ],
                $result['success'] === 1
                    ? 'Student enrolled successfully'
                    : "{$result['success']} students enrolled successfully"
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }


    /**
     * Unenroll (cancel) students in bulk.
     */
    public function unenrollStudents(UnenrollStudentsRequest $request): JsonResponse
    {
        try {
            $result = $this->enrollmentService->unenrollStudents($request->validated());

            return $this->successResponse(
                [
                    'success' => $result['success'],
                ],
                $result['message']
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

}
