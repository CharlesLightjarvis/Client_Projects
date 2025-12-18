<?php

namespace Database\Factories;

use App\Models\Certification;
use App\Models\Chapter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chapter>
 */
class ChapterFactory extends Factory
{
    protected $model = Chapter::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'certification_id' => Certification::factory(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'order' => $this->faker->numberBetween(1, 10),
        ];
    }

    /**
     * Create a chapter without description.
     */
    public function withoutDescription(): static
    {
        return $this->state(fn (array $attributes) => [
            'description' => null,
        ]);
    }

    /**
     * Create a chapter with specific order.
     */
    public function withOrder(int $order): static
    {
        return $this->state(fn (array $attributes) => [
            'order' => $order,
        ]);
    }

    /**
     * Create a chapter for a specific certification.
     */
    public function forCertification($certificationId): static
    {
        return $this->state(fn (array $attributes) => [
            'certification_id' => $certificationId,
        ]);
    }

    /**
     * Create a chapter with realistic exam-focused content.
     */
    public function examFocused(): static
    {
        $examTopics = [
            'Fundamentals and Core Concepts',
            'Security and Best Practices', 
            'Implementation and Configuration',
            'Troubleshooting and Maintenance',
            'Advanced Topics and Integration'
        ];

        $examDescriptions = [
            'Essential foundational knowledge and core principles',
            'Security protocols, authentication, and best practices',
            'Practical implementation and configuration management',
            'Problem-solving and system maintenance techniques',
            'Advanced features and complex integration scenarios'
        ];

        $index = array_rand($examTopics);

        return $this->state(fn (array $attributes) => [
            'name' => $examTopics[$index],
            'description' => $examDescriptions[$index],
        ]);
    }

    /**
     * Create multiple chapters with sequential ordering.
     */
    public function sequentialOrder(int $startOrder = 1): static
    {
        return $this->sequence(function ($sequence) use ($startOrder) {
            return ['order' => $startOrder + $sequence->index];
        });
    }
}