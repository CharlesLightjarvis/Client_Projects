<?php

namespace App\Http\Responses;

use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        return $request->wantsJson()
            ? response()->json([
                'two_factor' => false,
                'user' => new UserResource($user)
            ])
            : redirect()->intended(config('fortify.home'));
    }
}
