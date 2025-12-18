<?php

namespace Database\Factories;

use App\Models\QuizConfiguration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizConfiguration>
 */
class QuizConfigurationFactory extends Factory
{
    protected $model = QuizConfiguration::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'configurable_type' => null, // Will be set when using the factory
            'configurable_id' => null, // Will be set when using the factory
            'total_questions' => $this->faker->numberBetween(10, 50),
            'difficulty_distribution' => [],
            'module_distribution' => [],
            'chapter_distribution' => [],
            'passing_score' => $this->faker->numberBetween(60, 90),
            'time_limit' => $this->faker->numberBetween(30, 180),
        ];
    }

    /**
     * Configure the factory for certification exam configurations
     */
    public function forCertification(string $certificationId): static
    {
        return $this->state(fn (array $attributes) => [
            'configurable_type' => \App\Models\Certification::class,
            'configurable_id' => $certificationId,
        ]);
    }

    /**
     * Configure the factory with chapter distribution
     */
    public function withChapterDistribution(array $chapterDistribution): static
    {
        return $this->state(fn (array $attributes) => [
            'chapter_distribution' => $chapterDistribution,
            'total_questions' => array_sum($chapterDistribution),
        ]);
    }
}