<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

trait ApiResponse
{
    protected function successResponse($data, string $message, int $statusCode = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    protected function createdSuccessResponse($data, string $message, int $statusCode = Response::HTTP_CREATED): JsonResponse
    {
        return $this->successResponse($data, $message, $statusCode);
    }

    protected function deletedSuccessResponse(string $message, int $statusCode = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
        ], $statusCode);
    }

    protected function errorResponse($data, string $message, array $errors = [],  int $statusCode = Response::HTTP_BAD_REQUEST): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }
}
