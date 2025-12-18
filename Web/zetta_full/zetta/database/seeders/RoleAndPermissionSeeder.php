<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $permissions = [
            'role-list',
            'role-create',
            'role-edit',
            'role-delete',
            'user-list',
            'user-create',
            'user-edit',
            'user-delete',
            'formation-list',
            'formation-create',
            'formation-edit',
            'formation-delete',
            'category-list',
            'category-create',
            'category-edit',
            'category-delete',
            'certification-list',
            'certification-create',
            'certification-edit',
            'certification-delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // assign role with enum values

        foreach (RoleEnum::cases() as $role) {
            $role = Role::create(['name' => $role->value]);
        }
    }
}
