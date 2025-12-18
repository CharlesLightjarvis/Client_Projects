<?php

namespace App\Services;

use App\Models\Permission;
use App\Trait\ApiResponse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PermissionService
{
    use ApiResponse;

    /**
     * Get all permissions with their roles
     */
    public function getAllPermissions(): Collection
    {
        return Permission::with('roles')->get();
    }

    /**
     * Create a new permission
     */
    public function createPermission(array $data): Permission
    {
        return DB::transaction(function () use ($data) {
            return Permission::create([
                'name' => $data['name'],
                'guard_name' => $data['guard_name'] ?? 'web',
                'description' => $data['description'] ?? null,
            ]);
        });
    }

    /**
     * Get a permission by ID with its roles
     */
    public function getPermissionById(string $id): Permission
    {
        $permission = Permission::with('roles')->find($id);
        
        if (!$permission) {
            throw new ModelNotFoundException('Permission not found');
        }
        
        return $permission;
    }

    /**
     * Update a permission
     */
    public function updatePermission(string $id, array $data): Permission
    {
        return DB::transaction(function () use ($id, $data) {
            $permission = Permission::find($id);
            
            if (!$permission) {
                throw new ModelNotFoundException('Permission not found');
            }
            
            $permission->update([
                'name' => $data['name'],
                'guard_name' => $data['guard_name'] ?? $permission->guard_name,
                'description' => $data['description'] ?? $permission->description,
            ]);
            
            return $permission->fresh('roles');
        });
    }

    /**
     * Delete a permission
     */
    public function deletePermission(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            $permission = Permission::find($id);
            
            if (!$permission) {
                throw new ModelNotFoundException('Permission not found');
            }
            
            // Remove permission from all roles before deletion
            $permission->roles()->detach();
            
            // Remove permission from all users before deletion
            $permission->users()->detach();
            
            return $permission->delete();
        });
    }
}