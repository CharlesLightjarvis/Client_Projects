<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Role\StoreRoleRequest;
use App\Http\Requests\v1\Role\UpdateRoleRequest;
use App\Http\Requests\v1\Role\AssignPermissionsRequest;
use App\Services\RoleService;
use App\Trait\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RoleController extends Controller
{
    use ApiResponse;

    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of roles
     */
    public function index(): JsonResponse
    {
        try {
            $roles = $this->roleService->getAllRoles();
            return $this->successResponse('Roles retrieved successfully', 'roles', $roles);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve roles', 500);
        }
    }

    /**
     * Store a newly created role
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        try {
            $role = $this->roleService->createRole($request->validated());
            return $this->successResponse('Role created successfully', 'role', $role, 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create role', 500);
        }
    }

    /**
     * Display the specified role
     */
    public function show(string $id): JsonResponse
    {
        try {
            $role = $this->roleService->getRoleById($id);
            return $this->successResponse('Role retrieved successfully', 'role', $role);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve role', 500);
        }
    }

    /**
     * Update the specified role
     */
    public function update(UpdateRoleRequest $request, string $id): JsonResponse
    {
        try {
            $role = $this->roleService->updateRole($id, $request->validated());
            return $this->successResponse('Role updated successfully', 'role', $role);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update role', 500);
        }
    }

    /**
     * Remove the specified role
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->roleService->deleteRole($id);
            return $this->successResponse('Role deleted successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete role', 500);
        }
    }

    /**
     * Assign permissions to a role
     */
    public function assignPermissions(AssignPermissionsRequest $request, string $id): JsonResponse
    {
        try {
            $role = $this->roleService->assignPermissions($id, $request->validated()['permission_ids']);
            return $this->successResponse('Permissions assigned successfully', 'role', $role);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to assign permissions', 500);
        }
    }

    /**
     * Revoke permissions from a role
     */
    public function revokePermissions(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id'
        ]);

        try {
            $role = $this->roleService->revokePermissions($id, $request->permission_ids);
            return $this->successResponse('Permissions revoked successfully', 'role', $role);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to revoke permissions', 500);
        }
    }

    /**
     * Sync permissions for a role (replace all existing permissions)
     */
    public function syncPermissions(AssignPermissionsRequest $request, string $id): JsonResponse
    {
        try {
            $role = $this->roleService->syncPermissions($id, $request->validated()['permission_ids']);
            return $this->successResponse('Permissions synced successfully', 'role', $role);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to sync permissions', 500);
        }
    }

    /**
     * Get permissions for a specific role
     */
    public function getPermissions(string $id): JsonResponse
    {
        try {
            $permissions = $this->roleService->getRolePermissions($id);
            return $this->successResponse('Role permissions retrieved successfully', 'permissions', $permissions);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve role permissions', 500);
        }
    }
}
