<?php

namespace Database\Factories;

use App\Models\ExamSession;
use App\Models\User;
use App\Models\Certification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExamSession>
 */
class ExamSessionFactory extends Factory
{
    protected $model = ExamSession::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startedAt = $this->faker->dateTimeBetween('-2 hours', 'now');
        $expiresAt = (clone $startedAt)->modify('+60 minutes');

        return [
            'user_id' => User::factory(),
            'certification_id' => Certification::factory(),
            'exam_data' => [
                'questions' => [
                    [
                        'id' => $this->faker->uuid(),
                        'chapter_name' => 'Sample Chapter',
                        'question' => 'Sample question?',
                        'answers' => [
                            ['id' => 1, 'text' => 'Answer A'],
                            ['id' => 2, 'text' => 'Answer B'],
                            ['id' => 3, 'text' => 'Answer C'],
                        ],
                        'points' => 1
                    ]
                ],
                'time_limit' => 60,
                'total_points' => 1
            ],
            'answers' => null,
            'started_at' => $startedAt,
            'expires_at' => $expiresAt,
            'submitted_at' => null,
            'score' => null,
            'status' => 'active'
        ];
    }

    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'submitted_at' => now(),
            'status' => 'submitted',
            'score' => $this->faker->numberBetween(0, 100),
            'answers' => [
                $attributes['exam_data']['questions'][0]['id'] => [1]
            ]
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subMinutes(10),
            'submitted_at' => now(),
            'status' => 'expired',
            'score' => $this->faker->numberBetween(0, 100)
        ]);
    }

    public function withAnswers(): static
    {
        return $this->state(fn (array $attributes) => [
            'answers' => [
                $attributes['exam_data']['questions'][0]['id'] => [1, 2]
            ]
        ]);
    }
}
