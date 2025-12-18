<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Création de l'admin
        $admin = User::create([
            'fullName' => 'Admin Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // // Création du teacher par défaut
        // $teacher = User::create([
        //     'fullName' => 'Teacher Teacher',
        //     'email' => 'teacher@gmail.com',
        //     'bio' => 'Teacher bio',
        //     'title' => 'Teacher title',
        //     'password' => Hash::make('password'),
        // ]);
        // $teacher->assignRole('teacher');

        // // Création du student par défaut
        // $student = User::create([
        //     'fullName' => 'Student Student',
        //     'email' => 'student@gmail.com',
        //     'password' => Hash::make('password'),
        // ]);
        // $student->assignRole('student');

        // // Création de 20 enseignants avec Faker
        // $faker = Faker::create();

        // for ($i = 0; $i < 20; $i++) {
        //     $teacher = User::create([
        //         'fullName' => $faker->name,
        //         'email' => $faker->unique()->safeEmail,
        //         'bio' => $faker->paragraph,
        //         'phone' => $faker->phoneNumber,
        //         'title' => $faker->jobTitle,
        //         'password' => Hash::make('password'), // Mot de passe par défaut
        //     ]);
        //     $teacher->assignRole('teacher');
        // }
    }
}
