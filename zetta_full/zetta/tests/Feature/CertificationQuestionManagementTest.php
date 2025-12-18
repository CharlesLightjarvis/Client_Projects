<?php

namespace Tests\Feature;

use App\Enums\QuestionDifficultyEnum;
use App\Enums\QuestionTypeEnum;
use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificationQuestionManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Certification $certification;
    private Chapter $chapter;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create();
        $this->certification = Certification::factory()->create();
        $this->chapter = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
        ]);
    }

    /** @test */
    public function it_can_list_questions_for_a_chapter()
    {
        // Arrange
        $questions = Question::factory()->count(3)->forChapter($this->chapter->id)->create();

        // Act
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/chapters/{$this->chapter->id}/questions");

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'chapter_id',
                        'question',
                        'answers',
                        'difficulty',
                        'type',
                        'points',
                        'created_at',
                        'updated_at',
                    ]
                ]
            ])
            ->assertJson([
                'success' => true,
            ]);

        $this->assertCount(3, $response->json('data'));
    }

    /** @test */
    public function it_can_create_a_new_question_for_a_chapter()
    {
        // Arrange
        $questionData = [
            'question' => 'What is Laravel?',
            'answers' => [
                ['id' => 1, 'text' => 'A PHP framework', 'correct' => true],
                ['id' => 2, 'text' => 'A JavaScript library', 'correct' => false],
                ['id' => 3, 'text' => 'A database', 'correct' => false],
            ],
            'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 5,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        // Assert
        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'chapter_id',
                    'question',
                    'answers',
                    'difficulty',
                    'type',
                    'points',
                    'chapter',
                    'created_at',
                    'updated_at',
                ]
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Question créée avec succès.',
                'data' => [
                    'chapter_id' => $this->chapter->id,
                    'question' => 'What is Laravel?',
                    'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                    'type' => QuestionTypeEnum::CERTIFICATION->value,
                    'points' => 5,
                ]
            ]);

        $this->assertDatabaseHas('questions', [
            'chapter_id' => $this->chapter->id,
            'question' => 'What is Laravel?',
            'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 5,
        ]);
    }

    /** @test */
    public function it_can_show_a_specific_certification_question()
    {
        // Arrange
        $question = Question::factory()->forChapter($this->chapter->id)->create();

        // Act
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/certification-questions/{$question->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'chapter_id',
                    'question',
                    'answers',
                    'difficulty',
                    'type',
                    'points',
                    'chapter',
                    'created_at',
                    'updated_at',
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $question->id,
                    'chapter_id' => $this->chapter->id,
                    'question' => $question->question,
                ]
            ]);
    }

    /** @test */
    public function it_cannot_show_non_certification_question()
    {
        // Arrange - Create a question without chapter_id (not a certification question)
        $question = Question::factory()->create([
            'chapter_id' => null,
            'questionable_type' => 'App\\Models\\Module',
            'questionable_id' => 'some-uuid',
        ]);

        // Act
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/certification-questions/{$question->id}");

        // Assert
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Question non trouvée.',
            ]);
    }

    /** @test */
    public function it_can_update_a_certification_question()
    {
        // Arrange
        $question = Question::factory()->forChapter($this->chapter->id)->create([
            'question' => 'Original question?',
            'points' => 3,
        ]);

        $updateData = [
            'question' => 'Updated question?',
            'answers' => [
                ['id' => 1, 'text' => 'Updated answer 1', 'correct' => true],
                ['id' => 2, 'text' => 'Updated answer 2', 'correct' => false],
            ],
            'difficulty' => QuestionDifficultyEnum::HARD->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 8,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certification-questions/{$question->id}", $updateData);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Question mise à jour avec succès.',
                'data' => [
                    'id' => $question->id,
                    'question' => 'Updated question?',
                    'difficulty' => QuestionDifficultyEnum::HARD->value,
                    'points' => 8,
                ]
            ]);

        $this->assertDatabaseHas('questions', [
            'id' => $question->id,
            'question' => 'Updated question?',
            'difficulty' => QuestionDifficultyEnum::HARD->value,
            'points' => 8,
        ]);
    }

    /** @test */
    public function it_cannot_update_non_certification_question()
    {
        // Arrange - Create a question without chapter_id (not a certification question)
        $question = Question::factory()->create([
            'chapter_id' => null,
            'questionable_type' => 'App\\Models\\Module',
            'questionable_id' => 'some-uuid',
        ]);

        $updateData = [
            'question' => 'Updated question?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => true],
                ['id' => 2, 'text' => 'Answer 2', 'correct' => false],
            ],
            'difficulty' => QuestionDifficultyEnum::EASY->value,
            'type' => QuestionTypeEnum::NORMAL->value,
            'points' => 5,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certification-questions/{$question->id}", $updateData);

        // Assert
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Question non trouvée.',
            ]);
    }

    /** @test */
    public function it_can_delete_a_certification_question()
    {
        // Arrange
        $question = Question::factory()->forChapter($this->chapter->id)->create();

        // Act
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/certification-questions/{$question->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Question supprimée avec succès.',
            ]);

        $this->assertDatabaseMissing('questions', [
            'id' => $question->id,
        ]);
    }

    /** @test */
    public function it_cannot_delete_non_certification_question()
    {
        // Arrange - Create a question without chapter_id (not a certification question)
        $question = Question::factory()->create([
            'chapter_id' => null,
            'questionable_type' => 'App\\Models\\Module',
            'questionable_id' => 'some-uuid',
        ]);

        // Act
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/certification-questions/{$question->id}");

        // Assert
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Question non trouvée.',
            ]);

        $this->assertDatabaseHas('questions', [
            'id' => $question->id,
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_question()
    {
        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", []);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'question',
                'answers',
                'difficulty',
                'type',
                'points',
            ]);
    }

    /** @test */
    public function it_validates_answers_structure()
    {
        // Arrange
        $questionData = [
            'question' => 'Test question?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1'], // Missing 'correct' field
                ['text' => 'Answer 2', 'correct' => false], // Missing 'id' field
            ],
            'difficulty' => QuestionDifficultyEnum::EASY->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 5,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'answers.0.correct',
                'answers.1.id',
            ]);
    }

    /** @test */
    public function it_validates_at_least_one_correct_answer()
    {
        // Arrange
        $questionData = [
            'question' => 'Test question?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => false],
                ['id' => 2, 'text' => 'Answer 2', 'correct' => false],
            ],
            'difficulty' => QuestionDifficultyEnum::EASY->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 5,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);
        
        $errors = $response->json('errors.answers');
        $this->assertContains('Au moins une réponse doit être marquée comme correcte.', $errors);
    }

    /** @test */
    public function it_validates_unique_answer_ids()
    {
        // Arrange
        $questionData = [
            'question' => 'Test question?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => true],
                ['id' => 1, 'text' => 'Answer 2', 'correct' => false], // Duplicate ID
            ],
            'difficulty' => QuestionDifficultyEnum::EASY->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 5,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);
        
        $errors = $response->json('errors.answers');
        $this->assertContains('Les IDs des réponses doivent être uniques.', $errors);
    }

    /** @test */
    public function it_validates_minimum_number_of_answers()
    {
        // Arrange
        $questionData = [
            'question' => 'Test question?',
            'answers' => [
                ['id' => 1, 'text' => 'Only one answer', 'correct' => true],
            ],
            'difficulty' => QuestionDifficultyEnum::EASY->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 5,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);
    }

    /** @test */
    public function it_validates_difficulty_enum_values()
    {
        // Arrange
        $questionData = [
            'question' => 'Test question?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => true],
                ['id' => 2, 'text' => 'Answer 2', 'correct' => false],
            ],
            'difficulty' => 'invalid_difficulty',
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 5,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['difficulty']);
    }

    /** @test */
    public function it_validates_type_enum_values()
    {
        // Arrange
        $questionData = [
            'question' => 'Test question?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => true],
                ['id' => 2, 'text' => 'Answer 2', 'correct' => false],
            ],
            'difficulty' => QuestionDifficultyEnum::EASY->value,
            'type' => 'invalid_type',
            'points' => 5,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    /** @test */
    public function it_validates_points_are_positive_integer()
    {
        // Arrange
        $questionData = [
            'question' => 'Test question?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => true],
                ['id' => 2, 'text' => 'Answer 2', 'correct' => false],
            ],
            'difficulty' => QuestionDifficultyEnum::EASY->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 0, // Should be at least 1
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['points']);
    }

    /** @test */
    public function it_returns_questions_ordered_by_created_at_desc()
    {
        // Arrange
        $question1 = Question::factory()->forChapter($this->chapter->id)->create([
            'question' => 'First question',
            'created_at' => now()->subHours(2),
        ]);
        
        $question2 = Question::factory()->forChapter($this->chapter->id)->create([
            'question' => 'Second question',
            'created_at' => now()->subHour(),
        ]);
        
        $question3 = Question::factory()->forChapter($this->chapter->id)->create([
            'question' => 'Third question',
            'created_at' => now(),
        ]);

        // Act
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/chapters/{$this->chapter->id}/questions");

        // Assert
        $response->assertStatus(200);
        
        $questions = $response->json('data');
        $this->assertEquals('Third question', $questions[0]['question']);
        $this->assertEquals('Second question', $questions[1]['question']);
        $this->assertEquals('First question', $questions[2]['question']);
    }
}