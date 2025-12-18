<?php

namespace App\Services;

use App\Models\Role;
use App\Trait\ApiResponse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RoleService
{
    use ApiResponse;

    /**
     * Get all roles with their permissions
     */
    public function getAllRoles(): Collection
    {
        return Role::with('permissions')->get();
    }

    /**
     * Create a new role
     */
    public function createRole(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            return Role::create([
                'name' => $data['name'],
                'guard_name' => $data['guard_name'] ?? 'web',
                'description' => $data['description'] ?? null,
            ]);
        });
    }

    /**
     * Get a role by ID with its permissions
     */
    public function getRoleById(string $id): Role
    {
        $role = Role::with('permissions')->find($id);
        
        if (!$role) {
            throw new ModelNotFoundException('Role not found');
        }
        
        return $role;
    }

    /**
     * Update a role
     */
    public function updateRole(string $id, array $data): Role
    {
        return DB::transaction(function () use ($id, $data) {
            $role = Role::find($id);
            
            if (!$role) {
                throw new ModelNotFoundException('Role not found');
            }
            
            $role->update([
                'name' => $data['name'],
                'guard_name' => $data['guard_name'] ?? $role->guard_name,
                'description' => $data['description'] ?? $role->description,
            ]);
            
            return $role->fresh('permissions');
        });
    }

    /**
     * Delete a role
     */
    public function deleteRole(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            $role = Role::find($id);
            
            if (!$role) {
                throw new ModelNotFoundException('Role not found');
            }
            
            // Remove all permissions from the role before deletion
            $role->permissions()->detach();
            
            // Remove role from all users before deletion
            $role->users()->detach();
            
            return $role->delete();
        });
    }

    /**
     * Assign permissions to a role
     */
    public function assignPermissions(string $roleId, array $permissionIds): Role
    {
        return DB::transaction(function () use ($roleId, $permissionIds) {
            $role = Role::find($roleId);
            
            if (!$role) {
                throw new ModelNotFoundException('Role not found');
            }
            
            // Get permission objects from IDs
            $permissions = \App\Models\Permission::whereIn('id', $permissionIds)->get();
            
            // Assign permissions to the role (this will add new permissions without removing existing ones)
            $role->givePermissionTo($permissions);
            
            return $role->fresh('permissions');
        });
    }

    /**
     * Revoke permissions from a role
     */
    public function revokePermissions(string $roleId, array $permissionIds): Role
    {
        return DB::transaction(function () use ($roleId, $permissionIds) {
            $role = Role::find($roleId);
            
            if (!$role) {
                throw new ModelNotFoundException('Role not found');
            }
            
            // Get permission objects from IDs
            $permissions = \App\Models\Permission::whereIn('id', $permissionIds)->get();
            
            // Revoke permissions from the role
            $role->revokePermissionTo($permissions);
            
            return $role->fresh('permissions');
        });
    }

    /**
     * Sync permissions for a role (replace all existing permissions)
     */
    public function syncPermissions(string $roleId, array $permissionIds): Role
    {
        return DB::transaction(function () use ($roleId, $permissionIds) {
            $role = Role::find($roleId);
            
            if (!$role) {
                throw new ModelNotFoundException('Role not found');
            }
            
            // Get permission objects from IDs
            $permissions = \App\Models\Permission::whereIn('id', $permissionIds)->get();
            
            // Sync permissions (this will replace all existing permissions)
            $role->syncPermissions($permissions);
            
            return $role->fresh('permissions');
        });
    }

    /**
     * Get permissions for a specific role
     */
    public function getRolePermissions(string $roleId): Collection
    {
        $role = Role::find($roleId);
        
        if (!$role) {
            throw new ModelNotFoundException('Role not found');
        }
        
        return $role->permissions;
    }
}