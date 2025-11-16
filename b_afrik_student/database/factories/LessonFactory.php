<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lesson>
 */
class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(5),
            'content' => fake()->paragraphs(3, true),
            'module_id' => Module::factory(),
        ];
    }

    /**
     * Assign a specific module to the lesson.
     */
    public function forModule(Module $module): static
    {
        return $this->state(fn (array $attributes) => [
            'module_id' => $module->id,
        ]);
    }

    /**
     * Create a short lesson with minimal content.
     */
    public function short(): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => fake()->sentence(3),
            'content' => fake()->paragraph(),
        ]);
    }

    /**
     * Create a detailed lesson with extensive content.
     */
    public function detailed(): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => fake()->sentence(6),
            'content' => fake()->paragraphs(8, true),
        ]);
    }
}
