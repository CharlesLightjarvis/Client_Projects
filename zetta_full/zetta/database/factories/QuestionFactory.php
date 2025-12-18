<?php

namespace Database\Factories;

use App\Enums\QuestionDifficultyEnum;
use App\Enums\QuestionTypeEnum;
use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    protected $model = Question::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question' => $this->faker->sentence() . '?',
            'answers' => [
                ['id' => 1, 'text' => $this->faker->sentence(), 'correct' => true],
                ['id' => 2, 'text' => $this->faker->sentence(), 'correct' => false],
                ['id' => 3, 'text' => $this->faker->sentence(), 'correct' => false],
                ['id' => 4, 'text' => $this->faker->sentence(), 'correct' => false],
            ],
            'difficulty' => $this->faker->randomElement(QuestionDifficultyEnum::values()),
            'type' => $this->faker->randomElement(QuestionTypeEnum::values()),
            'points' => $this->faker->numberBetween(1, 10),
        ];
    }

    /**
     * Create a question for a specific chapter.
     */
    public function forChapter($chapterId): static
    {
        return $this->state(fn (array $attributes) => [
            'chapter_id' => $chapterId,
            'questionable_type' => null,
            'questionable_id' => null,
        ]);
    }

    /**
     * Create an easy difficulty question.
     */
    public function easy(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'easy',
            'points' => $this->faker->numberBetween(1, 3),
        ]);
    }

    /**
     * Create a medium difficulty question.
     */
    public function medium(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'medium',
            'points' => $this->faker->numberBetween(3, 6),
        ]);
    }

    /**
     * Create a hard difficulty question.
     */
    public function hard(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'hard',
            'points' => $this->faker->numberBetween(6, 10),
        ]);
    }

    /**
     * Create a multiple choice question (multiple correct answers).
     */
    public function multipleChoice(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'certification',
            'answers' => [
                ['id' => 1, 'text' => $this->faker->sentence(), 'correct' => true],
                ['id' => 2, 'text' => $this->faker->sentence(), 'correct' => true],
                ['id' => 3, 'text' => $this->faker->sentence(), 'correct' => false],
                ['id' => 4, 'text' => $this->faker->sentence(), 'correct' => false],
            ],
        ]);
    }

    /**
     * Create a single choice question (one correct answer).
     */
    public function singleChoice(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'certification',
            'answers' => [
                ['id' => 1, 'text' => $this->faker->sentence(), 'correct' => true],
                ['id' => 2, 'text' => $this->faker->sentence(), 'correct' => false],
                ['id' => 3, 'text' => $this->faker->sentence(), 'correct' => false],
                ['id' => 4, 'text' => $this->faker->sentence(), 'correct' => false],
            ],
        ]);
    }

    /**
     * Create a question with realistic exam content.
     */
    public function examRealistic(): static
    {
        $examQuestions = [
            'What is the primary purpose of implementing proper authentication mechanisms?',
            'Which approach is recommended for handling sensitive configuration data?',
            'How should you implement error handling in production systems?',
            'What are the key considerations when designing scalable architecture?',
            'Which security practice should be prioritized in web applications?'
        ];

        $correctAnswers = [
            'Implement multi-factor authentication and secure session management',
            'Use environment variables and secure configuration management',
            'Implement comprehensive logging and graceful error handling',
            'Design for horizontal scaling and load distribution',
            'Validate all input and implement proper authorization'
        ];

        $incorrectAnswers = [
            'Use simple password-only authentication',
            'Store sensitive data in source code',
            'Display detailed error messages to users',
            'Focus only on vertical scaling solutions',
            'Trust all user input without validation'
        ];

        return $this->state(fn (array $attributes) => [
            'question' => $this->faker->randomElement($examQuestions),
            'answers' => [
                ['id' => 1, 'text' => $this->faker->randomElement($correctAnswers), 'correct' => true],
                ['id' => 2, 'text' => $this->faker->randomElement($incorrectAnswers), 'correct' => false],
                ['id' => 3, 'text' => $this->faker->randomElement($incorrectAnswers), 'correct' => false],
                ['id' => 4, 'text' => $this->faker->randomElement($incorrectAnswers), 'correct' => false],
            ],
        ]);
    }
}