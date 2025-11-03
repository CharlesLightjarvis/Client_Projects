<?php

namespace Database\Seeders;

use App\Enums\SessionStatus;
use App\Enums\UserRoleEnum;
use App\Models\CourseSession;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formations = Formation::all();

        $instructors = User::whereHas('roles', function ($query) {
            $query->where('name', UserRoleEnum::INSTRUCTOR->value);
        })->get();

        if ($instructors->isEmpty()) {
            $this->command->warn('Aucun instructeur trouvé. Veuillez créer des utilisateurs avec le rôle INSTRUCTOR d\'abord.');
            return;
        }

        foreach ($formations as $formation) {
            // Session planifiée (dans le futur)
            CourseSession::create([
                'formation_id' => $formation->id,
                'instructor_id' => $instructors->random()->id,
                'start_date' => now()->addDays(30),
                'end_date' => now()->addDays(90),
                'status' => SessionStatus::SCHEDULED,
                'max_students' => 25,
                'location' => 'Salle ' . rand(101, 110),
            ]);

            // Session en cours
            CourseSession::create([
                'formation_id' => $formation->id,
                'instructor_id' => $instructors->random()->id,
                'start_date' => now()->subDays(15),
                'end_date' => now()->addDays(45),
                'status' => SessionStatus::ONGOING,
                'max_students' => 30,
                'location' => 'Salle ' . rand(101, 110),
            ]);

            // Session complétée
            CourseSession::create([
                'formation_id' => $formation->id,
                'instructor_id' => $instructors->random()->id,
                'start_date' => now()->subDays(90),
                'end_date' => now()->subDays(30),
                'status' => SessionStatus::COMPLETED,
                'max_students' => 20,
                'location' => 'Salle ' . rand(101, 110),
            ]);
        }

        $this->command->info('Course sessions créées avec succès!');
    }
}
