<?php

namespace Database\Seeders;

use App\Enums\UserRoleEnum;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles & permissions first
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        // Create baseline users with fixed emails, roles replaced (not appended)
        $admin = User::factory()->create([
            'first_name' => 'Admin',
            'last_name'=> 'User',
            'email' => 'admin@example.com',
        ]);
        $admin->syncRoles(UserRoleEnum::ADMIN);

        $instructor = User::factory()->create([
            'first_name' => 'Instructor',
            'last_name'=> 'User',
            'email' => 'instructor@example.com',
        ]);
        $instructor->syncRoles(UserRoleEnum::INSTRUCTOR);

        $student = User::factory()->create([
            'first_name' => 'Student',
            'last_name'=> 'User',
            'email' => 'student@example.com',
        ]);
        $student->syncRoles(UserRoleEnum::STUDENT);

        // Create additional users for testing
        User::factory(5)->create()->each(function ($user) {
            $user->syncRoles(UserRoleEnum::INSTRUCTOR);
        });

        User::factory(20)->create()->each(function ($user) {
            $user->syncRoles(UserRoleEnum::STUDENT);
        });

        // Seed formations, modules, lessons and other data
        $this->call([
            PostSeeder::class,
            FormationSeeder::class,
            AttachmentSeeder::class, // Must be after FormationSeeder (creates lessons)
            CourseSessionSeeder::class,
            EnrollmentSeeder::class,
            LessonProgressSeeder::class,
        ]);
    }
}
