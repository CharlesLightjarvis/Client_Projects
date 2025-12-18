<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            RoleAndPermissionSeeder::class,
            UserSeeder::class,        // 1. Crée les utilisateurs (admin, teachers, students)
            CategorySeeder::class,    // 2. Crée les catégories
            FormationSeeder::class,   // 3. Crée les formations
            CertificationSeeder::class, // 4. Crée les certifications
            // CertificationExamSeeder::class, // 5. Crée les chapitres, questions et configurations d'examen
            ModuleSeeder::class,      // 6. Crée les modules
            LessonSeeder::class,      // 7. Crée les leçons
            // FormationSessionSeeder::class, // 8. Crée les sessions de formation
            // QuizSeeder::class,        // 9. Crée les configurations et questions pour les quiz
            ChapterSeeder::class,
            // ExamConfigurationSeeder::class
        ]);
    }
}
