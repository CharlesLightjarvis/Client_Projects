<?php

namespace App\Http\Controllers;

use App\Http\Requests\users\StoreUserRequest;
use App\Http\Requests\users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function __construct(protected UserService $userService){}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->successResponse(UserResource::collection($this->userService->getAllUsers()),'Users retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = $this->userService->createUser($request->validated());
        return $this->successResponse(UserResource::make($user), "User created successfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $this->successResponse(UserResource::make($user), "User fetched successfully");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user = $this->userService->updateUser($user, $request->validated());
        return $this->successResponse(UserResource::make($user), "User updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // remove roles and permissions before deleting the user
        $user->syncRoles([]);        
        $user->syncPermissions([]);  

        $user->delete();
        return $this->deletedSuccessResponse("User deleted successfully");
    }
}
