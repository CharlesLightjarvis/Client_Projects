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
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);
        $admin->syncRoles('admin');

        $professor = User::factory()->create([
            'name' => 'Professor User',
            'email' => 'professor@example.com',
        ]);
        $professor->syncRoles('professor');

        $client = User::factory()->create([
            'name' => 'Client User',
            'email' => 'client@example.com',
        ]);
        $client->syncRoles('client');

        // Seed posts and other data
        $this->call([
            PostSeeder::class,
        ]);
    }
}
