<?php

namespace Database\Seeders;

use App\Enums\SessionStatus;
use App\Enums\UserRoleEnum;
use App\Models\CourseSession;
use App\Models\Formation;
use App\Models\ModuleSessionInstructor;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formations = Formation::with('modules')->get();
        $instructors = User::whereHas('roles', fn($q) => $q->where('name', UserRoleEnum::INSTRUCTOR->value))->get();

        if ($instructors->isEmpty()) {
            $this->command->warn('Aucun instructeur trouvé! Les sessions seront créées sans assignation de professeurs.');
        }

        foreach ($formations as $formation) {
            // Session planifiée (dans le futur)
            $scheduledSession = CourseSession::create([
                'formation_id' => $formation->id,
                'start_date' => now()->addDays(30),
                'end_date' => now()->addDays(90),
                'status' => SessionStatus::SCHEDULED,
                'max_students' => 25,
                'location' => 'Salle ' . rand(101, 110),
            ]);

            // Auto-assign instructors to modules for this session
            if ($instructors->isNotEmpty()) {
                foreach ($formation->modules as $module) {
                    ModuleSessionInstructor::create([
                        'course_session_id' => $scheduledSession->id,
                        'module_id' => $module->id,
                        'instructor_id' => $instructors->random()->id,
                        'started_at' => now()->addDays(30), // Commence avec la session
                        'ended_at' => null, // Actif
                    ]);
                }
            }

            // Session en cours
            $ongoingSession = CourseSession::create([
                'formation_id' => $formation->id,
                'start_date' => now()->subDays(15),
                'end_date' => now()->addDays(45),
                'status' => SessionStatus::ONGOING,
                'max_students' => 30,
                'location' => 'Salle ' . rand(101, 110),
            ]);

            // Session en cours avec historique de changement d'instructeur
            if ($instructors->isNotEmpty() && $instructors->count() >= 2) {
                foreach ($formation->modules as $module) {
                    // Créer un premier instructeur qui a démissionné/été remplacé
                    $firstInstructor = $instructors->random();
                    ModuleSessionInstructor::create([
                        'course_session_id' => $ongoingSession->id,
                        'module_id' => $module->id,
                        'instructor_id' => $firstInstructor->id,
                        'started_at' => now()->subDays(15), // Début de la session
                        'ended_at' => now()->subDays(5), // Remplacé il y a 5 jours
                    ]);

                    // Instructeur actuel (différent pour montrer l'historique)
                    $currentInstructor = $instructors->where('id', '!=', $firstInstructor->id)->random();
                    ModuleSessionInstructor::create([
                        'course_session_id' => $ongoingSession->id,
                        'module_id' => $module->id,
                        'instructor_id' => $currentInstructor->id,
                        'started_at' => now()->subDays(5), // A pris le relais il y a 5 jours
                        'ended_at' => null, // Actif
                    ]);
                }
            }

            // Session complétée (with different instructors to show history)
            $completedSession = CourseSession::create([
                'formation_id' => $formation->id,
                'start_date' => now()->subDays(90),
                'end_date' => now()->subDays(30),
                'status' => SessionStatus::COMPLETED,
                'max_students' => 20,
                'location' => 'Salle ' . rand(101, 110),
            ]);

            // Session complétée avec instructeurs différents (déjà terminée)
            if ($instructors->isNotEmpty()) {
                foreach ($formation->modules as $module) {
                    $randomInstructor = $instructors->random();
                    ModuleSessionInstructor::create([
                        'course_session_id' => $completedSession->id,
                        'module_id' => $module->id,
                        'instructor_id' => $randomInstructor->id,
                        'started_at' => now()->subDays(90), // Début de la session
                        'ended_at' => now()->subDays(30), // Fin avec la session
                    ]);
                }
            }
        }

        $this->command->info('Course sessions et assignations de professeurs créées avec succès!');
    }
}
