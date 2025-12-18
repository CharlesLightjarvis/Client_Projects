<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\UserResource;
use App\Trait\ApiResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function me(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return $this->errorResponse("Unauthorized", 401);
        }
        return $this->successResponse('User retrieved successfully', 'user', new UserResource($user));
    }
}
