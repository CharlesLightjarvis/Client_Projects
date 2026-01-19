<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $roles = [
            ['name' => 'admin', 'guard_name' => 'web'],
            ['name' => 'client', 'guard_name' => 'web'],
            ['name' => 'professor', 'guard_name' => 'web'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate($role);
        }

        // Create permissions
        $permissions = [
            ['name' => 'post.create', 'guard_name' => 'web'],
            ['name' => 'post.read', 'guard_name' => 'web'],
            ['name' => 'post.update', 'guard_name' => 'web'],
            ['name' => 'post.delete', 'guard_name' => 'web'],
            ['name' => 'user.manage', 'guard_name' => 'web'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate($permission);
        }

        // Assign permissions to roles
        $admin = Role::where('name', 'admin')->first();
        $client = Role::where('name', 'client')->first();
        $professor = Role::where('name', 'professor')->first();

        if ($admin) {
            $admin->syncPermissions([
                'post.create', 'post.read', 'post.update', 'post.delete', 'user.manage',
            ]);
        }

        if ($professor) {
            $professor->syncPermissions([
                'post.create', 'post.read', 'post.update',
            ]);
        }

        if ($client) {
            $client->syncPermissions([
                'post.read','post.create', 'post.update',  'post.delete'
            ]);
        }
    }
}
