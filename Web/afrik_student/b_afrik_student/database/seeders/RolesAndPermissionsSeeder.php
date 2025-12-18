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

        PermissionEnum::CREATE_FORMATIONS->value,
        PermissionEnum::READ_FORMATIONS->value,
        PermissionEnum::UPDATE_FORMATIONS->value,
        PermissionEnum::DELETE_FORMATIONS->value,

        PermissionEnum::CREATE_MODULES->value,
        PermissionEnum::READ_MODULES->value,
        PermissionEnum::UPDATE_MODULES->value,
        PermissionEnum::DELETE_MODULES->value,

        PermissionEnum::CREATE_LESSONS->value,
        PermissionEnum::READ_LESSONS->value,
        PermissionEnum::UPDATE_LESSONS->value,
        PermissionEnum::DELETE_LESSONS->value,

        PermissionEnum::CREATE_SESSIONS->value,
        PermissionEnum::READ_SESSIONS->value,
        PermissionEnum::UPDATE_SESSIONS->value,
        PermissionEnum::DELETE_SESSIONS->value,
    ]);
}

        if ($instructor) {
            $instructor->syncPermissions([
                PermissionEnum::READ_USERS->value,
                
                PermissionEnum::CREATE_LESSONS->value,
                PermissionEnum::READ_LESSONS->value,
                PermissionEnum::UPDATE_LESSONS->value,
                PermissionEnum::DELETE_LESSONS->value,
            ]);
        }

        if ($student) {
            $student->syncPermissions([
                PermissionEnum::READ_USERS->value,
            ]);
        }
    }
}