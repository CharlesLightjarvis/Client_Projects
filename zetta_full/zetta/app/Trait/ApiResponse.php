<?php

namespace App\Trait;

trait ApiResponse
{
    public function successResponse($message = null, $dataName = 'data', $data = null, $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            $dataName => $data,
        ], $code);
    }

    public function successNoData($message = null, $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
        ], $code);
    }

    public function errorResponse($message = null,  $code = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $code);
    }
}
