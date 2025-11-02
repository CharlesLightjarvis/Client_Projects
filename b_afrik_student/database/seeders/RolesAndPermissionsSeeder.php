<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\UserRoleEnum;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 🔁 Nettoyer le cache Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | 🔹 Création des rôles à partir de l'Enum UserRoleEnum
        |--------------------------------------------------------------------------
        */
        foreach (UserRoleEnum::cases() as $roleEnum) {
            Role::firstOrCreate([
                'name' => $roleEnum->value,
                'guard_name' => 'web',
            ]);
            // ❌ Enlevez le deuxième paramètre avec uuid
        }

        /*
        |--------------------------------------------------------------------------
        | 🔹 Création des permissions à partir de l'Enum PermissionEnum
        |--------------------------------------------------------------------------
        */
        foreach (PermissionEnum::cases() as $permissionEnum) {
            Permission::firstOrCreate([
                'name' => $permissionEnum->value,
                'guard_name' => 'web',
            ]);
            // ❌ Enlevez le deuxième paramètre avec uuid
        }

        /*
        |--------------------------------------------------------------------------
        | 🔹 Attribution des permissions aux rôles
        |--------------------------------------------------------------------------
        */
        $admin = Role::where('name', UserRoleEnum::ADMIN->value)->first();
        $student = Role::where('name', UserRoleEnum::STUDENT->value)->first();
        $instructor = Role::where('name', UserRoleEnum::INSTRUCTOR->value)->first();

        if ($admin) {
            $admin->syncPermissions([
                PermissionEnum::CREATE_USERS->value,
                PermissionEnum::READ_USERS->value,
                PermissionEnum::UPDATE_USERS->value,
                PermissionEnum::DELETE_USERS->value,
            ]);
        }

        if ($instructor) {
            $instructor->syncPermissions([
                PermissionEnum::READ_USERS->value,
            ]);
        }

        if ($student) {
            $student->syncPermissions([
                PermissionEnum::READ_USERS->value,
            ]);
        }
    }
}