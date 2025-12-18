<?php

namespace Database\Factories;

use App\Enums\LevelEnum;
use App\Models\Certification;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Certification>
 */
class CertificationFactory extends Factory
{
    protected $model = Certification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->sentence(3);
        
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'image' => $this->faker->imageUrl(),
            'provider' => $this->faker->company(),
            'validity_period' => $this->faker->numberBetween(1, 5),
            'level' => $this->faker->randomElement(LevelEnum::values()),
            'benefits' => [$this->faker->sentence(), $this->faker->sentence()],
            'skills' => [$this->faker->word(), $this->faker->word()],
            'best_for' => [$this->faker->jobTitle(), $this->faker->jobTitle()],
            'prerequisites' => [$this->faker->sentence()],
            'link' => null,
        ];
    }
}