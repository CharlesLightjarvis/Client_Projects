<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Permission\StorePermissionRequest;
use App\Http\Requests\v1\Permission\UpdatePermissionRequest;
use App\Services\PermissionService;
use App\Trait\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PermissionController extends Controller
{
    use ApiResponse;

    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Display a listing of permissions
     */
    public function index(): JsonResponse
    {
        try {
            $permissions = $this->permissionService->getAllPermissions();
            return $this->successResponse('Permissions retrieved successfully', 'permissions', $permissions);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve permissions', 500);
        }
    }

    /**
     * Store a newly created permission
     */
    public function store(StorePermissionRequest $request): JsonResponse
    {
        try {
            $permission = $this->permissionService->createPermission($request->validated());
            return $this->successResponse('Permission created successfully', 'permission', $permission, 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create permission', 500);
        }
    }

    /**
     * Display the specified permission
     */
    public function show(string $id): JsonResponse
    {
        try {
            $permission = $this->permissionService->getPermissionById($id);
            return $this->successResponse('Permission retrieved successfully', 'permission', $permission);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Permission not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve permission', 500);
        }
    }

    /**
     * Update the specified permission
     */
    public function update(UpdatePermissionRequest $request, string $id): JsonResponse
    {
        try {
            $permission = $this->permissionService->updatePermission($id, $request->validated());
            return $this->successResponse('Permission updated successfully', 'permission', $permission);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Permission not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update permission', 500);
        }
    }

    /**
     * Remove the specified permission
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->permissionService->deletePermission($id);
            return $this->successResponse('Permission deleted successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Permission not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete permission', 500);
        }
    }
}