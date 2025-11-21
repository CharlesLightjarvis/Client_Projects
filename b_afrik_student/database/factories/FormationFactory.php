<?php

namespace Database\Factories;

use App\Enums\FormationLevel;
use App\Models\Formation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Formation>
 */
class FormationFactory extends Factory
{
    protected $model = Formation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(3),
            'learning_objectives' => fake()->paragraph(2),
            'target_skills' => [
                fake()->word(),
                fake()->word(),
                fake()->word(),
            ],
            'level' => fake()->randomElement(FormationLevel::cases()),
            'duration' => fake()->numberBetween(10, 200), // Durée en heures
            'image_url' => null,
            'price' => fake()->randomFloat(2, 100, 5000),
        ];
    }

    /**
     * Indicate that the formation is for beginners.
     */
    public function beginner(): static
    {
        return $this->state(fn (array $attributes) => [
            'level' => FormationLevel::EASY,
            'duration' => fake()->numberBetween(10, 50),
            'price' => fake()->randomFloat(2, 100, 1000),
        ]);
    }

    /**
     * Indicate that the formation is intermediate.
     */
    public function intermediate(): static
    {
        return $this->state(fn (array $attributes) => [
            'level' => FormationLevel::MEDIUM,
            'duration' => fake()->numberBetween(40, 100),
            'price' => fake()->randomFloat(2, 800, 2500),
        ]);
    }

    /**
     * Indicate that the formation is advanced.
     */
    public function advanced(): static
    {
        return $this->state(fn (array $attributes) => [
            'level' => FormationLevel::HARD,
            'duration' => fake()->numberBetween(80, 200),
            'price' => fake()->randomFloat(2, 2000, 5000),
        ]);
    }

    /**
     * Indicate that the formation is free.
     */
    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => null,
        ]);
    }
}
