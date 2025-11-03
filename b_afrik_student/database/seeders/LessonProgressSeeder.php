<?php

namespace Database\Seeders;

use App\Enums\UserRoleEnum;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\User;
use Illuminate\Database\Seeder;

class LessonProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = User::whereHas('roles', function ($query) {
            $query->where('name', UserRoleEnum::STUDENT->value);
        })->get();

        if ($students->isEmpty()) {
            $this->command->warn('Aucun étudiant trouvé. Veuillez créer des utilisateurs avec le rôle STUDENT d\'abord.');
            return;
        }

        $enrollments = Enrollment::with(['courseSession.formation.modules.lessons'])->get();

        if ($enrollments->isEmpty()) {
            $this->command->warn('Aucune inscription trouvée. Veuillez exécuter EnrollmentSeeder d\'abord.');
            return;
        }

        foreach ($enrollments as $enrollment) {
            $formation = $enrollment->courseSession->formation;

            if (!$formation) {
                continue;
            }

            $modules = $formation->modules;

            foreach ($modules as $module) {
                $lessons = $module->lessons;

                // Créer de la progression pour certaines leçons (pas toutes)
                $completionRate = rand(30, 90); // Pourcentage de leçons complétées

                foreach ($lessons as $index => $lesson) {
                    // Vérifier si le progress existe déjà pour éviter les doublons
                    $existingProgress = LessonProgress::where('student_id', $enrollment->student_id)
                        ->where('lesson_id', $lesson->id)
                        ->exists();

                    if ($existingProgress) {
                        continue;
                    }

                    // Décider si cette leçon est complétée
                    if (rand(1, 100) <= $completionRate) {
                        LessonProgress::create([
                            'student_id' => $enrollment->student_id,
                            'lesson_id' => $lesson->id,
                            'completed' => true,
                            'completed_at' => now()->subDays(rand(1, 30)),
                            'score' => rand(60, 100) / 10, // Score entre 6.0 et 10.0
                        ]);
                    } else {
                        // Certaines leçons commencées mais non terminées
                        if (rand(1, 100) <= 40) {
                            LessonProgress::create([
                                'student_id' => $enrollment->student_id,
                                'lesson_id' => $lesson->id,
                                'completed' => false,
                                'completed_at' => null,
                                'score' => null,
                            ]);
                        }
                    }
                }
            }
        }

        $this->command->info('Lesson progress créé avec succès!');
    }
}
