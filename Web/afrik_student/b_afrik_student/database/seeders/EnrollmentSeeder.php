<?php

namespace Database\Seeders;

use App\Enums\EnrollmentStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRoleEnum;
use App\Models\CourseSession;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
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

        $courseSessions = CourseSession::all();

        if ($courseSessions->isEmpty()) {
            $this->command->warn('Aucune session de cours trouvée. Veuillez exécuter CourseSessionSeeder d\'abord.');
            return;
        }

        foreach ($courseSessions as $courseSession) {
            // Nombre aléatoire d'inscriptions par session (entre 5 et 15 ou max_students)
            $enrollmentCount = min(rand(5, 15), $courseSession->max_students);

            // Prendre des étudiants aléatoires
            $selectedStudents = $students->random(min($enrollmentCount, $students->count()));

            foreach ($selectedStudents as $student) {
                // Différents scénarios d'inscription
                $scenario = rand(1, 4);

                switch ($scenario) {
                    case 1: // Inscription confirmée et payée
                        Enrollment::create([
                            'student_id' => $student->id,
                            'course_session_id' => $courseSession->id,
                            'enrollment_date' => now()->subDays(rand(1, 30)),
                            'status' => EnrollmentStatus::CONFIRMED,
                            'payment_status' => PaymentStatus::PAID,
                            'payment_amount' => rand(50000, 200000),
                        ]);
                        break;

                    case 2: // Inscription confirmée mais paiement partiel
                        Enrollment::create([
                            'student_id' => $student->id,
                            'course_session_id' => $courseSession->id,
                            'enrollment_date' => now()->subDays(rand(1, 20)),
                            'status' => EnrollmentStatus::CONFIRMED,
                            'payment_status' => PaymentStatus::PARTIAL,
                            'payment_amount' => rand(25000, 100000),
                        ]);
                        break;

                    case 3: // Inscription en attente, non payée
                        Enrollment::create([
                            'student_id' => $student->id,
                            'course_session_id' => $courseSession->id,
                            'enrollment_date' => now()->subDays(rand(1, 10)),
                            'status' => EnrollmentStatus::PENDING,
                            'payment_status' => PaymentStatus::UNPAID,
                            'payment_amount' => 0,
                        ]);
                        break;

                    case 4: // Inscription annulée avec remboursement
                        Enrollment::create([
                            'student_id' => $student->id,
                            'course_session_id' => $courseSession->id,
                            'enrollment_date' => now()->subDays(rand(10, 40)),
                            'status' => EnrollmentStatus::CANCELLED,
                            'payment_status' => PaymentStatus::REFUNDED,
                            'payment_amount' => rand(50000, 150000),
                        ]);
                        break;
                }
            }
        }

        $this->command->info('Enrollments créés avec succès!');
    }
}
