<?php

namespace Database\Seeders;

use App\Models\Formation;
use App\Models\FormationSession;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class FormationSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $formations = Formation::all();
        $teachers = User::role('teacher')->get(); // Spatie simplifie whereHas()
        $faker = Faker::create();

        if ($teachers->isEmpty() || $formations->isEmpty()) {
            $this->command->warn('Pas assez de formations ou de professeurs pour créer des sessions.');
            return;
        }

        foreach ($formations as $formation) {
            for ($i = 0; $i < 2; $i++) { // 2 sessions par formation
                FormationSession::create([
                    'formation_id' => $formation->id,
                    'teacher_id' => $teachers->random()->id,
                    'course_type' => $faker->randomElement(['day course', 'night course']),
                    'start_date' => Carbon::now()->addDays($faker->numberBetween(1, 30)),
                    'end_date' => Carbon::now()->addDays($faker->numberBetween(31, 60)),
                    'capacity' => $faker->numberBetween(20, 50),
                    'enrolled_students' => $faker->numberBetween(0, 20),
                ]);
            }
        }
    }
}
