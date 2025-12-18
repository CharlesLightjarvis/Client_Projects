<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Get all users.
     */
    public function getAllUsers()
    {
        return User::orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new user.
     */
    public function createUser(array $data)
    {
        return DB::transaction(function () use ($data) {
            $password = Hash::make('password');

            $user = User::create($data + ['password' => $password]);
            $user->assignRole($data['role']);
            $user->syncPermissions($data['permissions'] ?? []);

            return $user->fresh();
        });
    }

    /**
     * Update an existing user.
     */
    public function updateUser(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            $user->update($data);
            $user->syncRoles($data['role']);
            $user->syncPermissions($data['permissions']);

            return $user->fresh();
        });
    }
}