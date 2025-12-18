<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\QuizConfiguration;
use Illuminate\Database\Seeder;

class ExamConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $certifications = Certification::with('chapters.questions')->get();

        if ($certifications->isEmpty()) {
            if ($this->command) {
                $this->command->info('No certifications found. Please run CertificationSeeder and ChapterSeeder first.');
            }
            return;
        }

        foreach ($certifications as $certification) {
            $this->createExamConfiguration($certification);
        }

        if ($this->command) {
            $this->command->info('Exam configurations created successfully!');
        }
    }

    /**
     * Create exam configuration for a certification
     */
    private function createExamConfiguration(Certification $certification): void
    {
        // Skip if configuration already exists
        if ($certification->quizConfiguration) {
            if ($this->command) {
                $this->command->info("Configuration already exists for certification: {$certification->name}");
            }
            return;
        }

        $chapters = $certification->chapters;
        
        if ($chapters->isEmpty()) {
            if ($this->command) {
                $this->command->warn("No chapters found for certification: {$certification->name}");
            }
            return;
        }

        // Create chapter distribution based on available questions
        $chapterDistribution = [];
        $totalQuestions = 0;

        foreach ($chapters as $chapter) {
            $availableQuestions = $chapter->questions()->count();
            
            if ($availableQuestions > 0) {
                // Use a percentage of available questions for the exam
                $examQuestions = $this->calculateExamQuestions($availableQuestions, $chapter->name);
                $chapterDistribution[$chapter->id] = $examQuestions;
                $totalQuestions += $examQuestions;
            }
        }

        if (empty($chapterDistribution)) {
            if ($this->command) {
                $this->command->warn("No questions found for certification: {$certification->name}");
            }
            return;
        }

        // Create the configuration
        QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => $totalQuestions,
            'chapter_distribution' => $chapterDistribution,
            'difficulty_distribution' => [],
            'module_distribution' => [],
            'time_limit' => $this->calculateTimeLimit($totalQuestions),
            'passing_score' => $this->calculatePassingScore($totalQuestions),
        ]);

        if ($this->command) {
            $this->command->info("Created exam configuration for: {$certification->name} ({$totalQuestions} questions)");
        }
    }

    /**
     * Calculate number of exam questions based on available questions and chapter type
     */
    private function calculateExamQuestions(int $availableQuestions, string $chapterName): int
    {
        // Define question distribution strategy based on chapter importance
        $strategies = [
            'Fundamentals and Core Concepts' => 0.67, // 67% of available questions
            'Security and Best Practices' => 0.75,    // 75% of available questions
            'Implementation and Configuration' => 0.56, // 56% of available questions
            'Troubleshooting and Maintenance' => 0.80,  // 80% of available questions
            'Advanced Topics and Integration' => 0.63,  // 63% of available questions
        ];

        $percentage = $strategies[$chapterName] ?? 0.60; // Default 60%
        $examQuestions = (int) ceil($availableQuestions * $percentage);

        // Ensure minimum and maximum bounds
        return max(1, min($examQuestions, $availableQuestions));
    }

    /**
     * Calculate time limit based on total questions
     */
    private function calculateTimeLimit(int $totalQuestions): int
    {
        // Base formula: 2 minutes per question + 10 minutes buffer
        $baseTime = ($totalQuestions * 2) + 10;
        
        // Adjust based on exam size
        if ($totalQuestions <= 10) {
            return max(30, $baseTime); // Minimum 30 minutes
        } elseif ($totalQuestions <= 25) {
            return $baseTime;
        } elseif ($totalQuestions <= 50) {
            return $baseTime + 15; // Add 15 minutes for larger exams
        } else {
            return $baseTime + 30; // Add 30 minutes for very large exams
        }
    }

    /**
     * Calculate passing score based on total questions
     */
    private function calculatePassingScore(int $totalQuestions): int
    {
        // Adaptive passing score based on exam difficulty and length
        if ($totalQuestions <= 15) {
            return 80; // Higher passing score for shorter exams
        } elseif ($totalQuestions <= 30) {
            return 75; // Standard passing score
        } elseif ($totalQuestions <= 50) {
            return 70; // Slightly lower for longer exams
        } else {
            return 65; // Lower passing score for very long exams
        }
    }
}