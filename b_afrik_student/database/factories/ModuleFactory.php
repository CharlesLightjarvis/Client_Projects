<?php

namespace Database\Factories;

use App\Models\Formation;
use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Module>
 */
class ModuleFactory extends Factory
{
    protected $model = Module::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'formation_id' => Formation::factory(),
            'order' => fake()->numberBetween(1, 10),
        ];
    }

    /**
     * Assign a specific formation to the module.
     */
    public function forFormation(Formation $formation): static
    {
        return $this->state(fn (array $attributes) => [
            'formation_id' => $formation->id,
        ]);
    }
}
