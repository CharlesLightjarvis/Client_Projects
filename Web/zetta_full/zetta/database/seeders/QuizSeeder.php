<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\QuizConfiguration;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Récupérer toutes les leçons et certifications
        $lessons = Lesson::all();
        $certifications = Certification::all();

        // Questions possibles pour les quiz
        $questionTemplates = [
            'Quelle est la principale caractéristique de %s ?',
            'Comment peut-on implémenter %s ?',
            'Quel est le meilleur cas d\'utilisation pour %s ?',
            'Expliquez le concept de %s',
            'Quels sont les avantages de %s ?',
        ];

        // Créer des configurations et questions normales pour chaque leçon
        foreach ($lessons as $lesson) {
            // Créer la configuration de quiz pour la leçon
            QuizConfiguration::create([
                'configurable_type' => Lesson::class,
                'configurable_id' => $lesson->id,
                'total_questions' => 5,
                'difficulty_distribution' => [
                    'easy' => 40,
                    'medium' => 40,
                    'hard' => 20
                ],
                'passing_score' => 70,
                'time_limit' => 30, // 30 minutes
            ]);

            // Créer des questions normales liées à cette leçon
            $this->createNormalQuestions($lesson, $faker, $questionTemplates, 5);
        }

        // Créer des configurations et questions de certification pour chaque certification
        foreach ($certifications as $certification) {
            // Créer la configuration de quiz pour la certification
            QuizConfiguration::create([
                'configurable_type' => Certification::class,
                'configurable_id' => $certification->id,
                'total_questions' => 20,
                'difficulty_distribution' => [
                    'easy' => 30,
                    'medium' => 40,
                    'hard' => 30
                ],
                'module_distribution' => $this->generateModuleDistribution($certification),
                'passing_score' => 75,
                'time_limit' => 60, // 60 minutes
            ]);

            // Récupérer tous les modules de la formation associée à cette certification
            $modules = $certification->formation->modules;
            
            // Si aucun module n'est trouvé, passer à la certification suivante
            if ($modules->isEmpty()) {
                continue;
            }
            
            // Calculer combien de questions créer par module
            $questionsPerModule = ceil(20 / $modules->count());
            
            // Créer des questions de certification pour chaque module
            foreach ($modules as $module) {
                $this->createCertificationQuestions($module, $faker, $questionTemplates, $questionsPerModule);
            }
        }
    }

    /**
     * Crée des questions normales liées à une leçon
     */
    private function createNormalQuestions($lesson, $faker, $questionTemplates, $count = 5): void
    {
        $difficulties = ['easy', 'medium', 'hard'];

        for ($i = 0; $i < $count; $i++) {
            $difficulty = $faker->randomElement($difficulties);
            $questionTemplate = $faker->randomElement($questionTemplates);
            $topic = $faker->words(3, true);

            // Créer 4 réponses dont une correcte
            $answers = [];
            $correctAnswer = $faker->numberBetween(0, 3);

            for ($j = 0; $j < 4; $j++) {
                $answers[] = [
                    'id' => $j,
                    'text' => $faker->sentence(),
                    'correct' => ($j === $correctAnswer)
                ];
            }

            Question::create([
                'questionable_type' => get_class($lesson), // App\Models\Lesson
                'questionable_id' => $lesson->id,
                'question' => sprintf($questionTemplate, $topic),
                'answers' => $answers,
                'difficulty' => $difficulty,
                'type' => 'normal', // Questions normales pour les leçons
                'points' => $difficulty === 'easy' ? 1 : ($difficulty === 'medium' ? 2 : 3) // Points selon la difficulté
            ]);
        }
    }
    
    /**
     * Crée des questions de certification liées à un module
     */
    private function createCertificationQuestions($module, $faker, $questionTemplates, $count = 5): void
    {
        $difficulties = ['easy', 'medium', 'hard'];

        for ($i = 0; $i < $count; $i++) {
            $difficulty = $faker->randomElement($difficulties);
            $questionTemplate = $faker->randomElement($questionTemplates);
            $topic = $faker->words(3, true);

            // Créer 4 réponses dont une correcte
            $answers = [];
            $correctAnswer = $faker->numberBetween(0, 3);

            for ($j = 0; $j < 4; $j++) {
                $answers[] = [
                    'id' => $j,
                    'text' => $faker->sentence(),
                    'correct' => ($j === $correctAnswer)
                ];
            }

            Question::create([
                'questionable_type' => get_class($module), // App\Models\Module
                'questionable_id' => $module->id,
                'question' => sprintf($questionTemplate, $topic),
                'answers' => $answers,
                'difficulty' => $difficulty,
                'type' => 'certification', // Questions de certification pour les modules
                'points' => $difficulty === 'easy' ? 1 : ($difficulty === 'medium' ? 2 : 3) // Points selon la difficulté
            ]);
        }
    }
    
    /**
     * Génère une distribution équitable des pourcentages pour les modules d'une certification
     */
    private function generateModuleDistribution($certification): array
    {
        // Récupérer les modules associés à la formation de cette certification
        $modules = $certification->formation->modules;
        
        // Si aucun module n'est trouvé, retourner un tableau vide
        if ($modules->isEmpty()) {
            return [];
        }
        
        // Calculer une distribution équitable des pourcentages
        $moduleCount = $modules->count();
        $basePercentage = floor(100 / $moduleCount);
        $remainder = 100 - ($basePercentage * $moduleCount);
        
        $distribution = [];
        
        foreach ($modules as $index => $module) {
            // Ajouter le reste au premier module
            $percentage = $basePercentage + ($index === 0 ? $remainder : 0);
            $distribution[$module->id] = $percentage;
        }
        
        return $distribution;
    }
}