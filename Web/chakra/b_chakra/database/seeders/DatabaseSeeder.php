<?php

namespace Database\Seeders;

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
            'last_name' => 'User',
            'email' => 'admin@example.com',
        ]);
        $admin->syncRoles('admin');

        $professor = User::factory()->create([
            'first_name' => 'Professor',
            'last_name' => 'User',
            'email' => 'professor@example.com',
        ]);
        $professor->syncRoles('professor');

        $client = User::factory()->create([
            'first_name' => 'Client',
            'last_name' => 'User',
            'email' => 'client@example.com',
        ]);
        $client->syncRoles('client');

        // Seed posts and other data
        $this->call([
            PostSeeder::class,
        ]);
    }
}
