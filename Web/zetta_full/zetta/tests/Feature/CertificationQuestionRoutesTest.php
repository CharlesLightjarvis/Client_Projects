<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificationQuestionRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->certification = Certification::factory()->create();
        $this->chapter = Chapter::factory()
            ->forCertification($this->certification->id)
            ->create();
        $this->question = Question::factory()
            ->forChapter($this->chapter->id)
            ->create();
    }

    public function test_can_list_questions_for_chapter(): void
    {
        $response = $this->getJson("/api/v1/admin/chapters/{$this->chapter->id}/questions");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => [
                            'id',
                            'question',
                            'answers',
                            'difficulty',
                            'type',
                            'points',
                            'chapter_id'
                        ]
                    ]
                ]);
    }

    public function test_can_create_question_for_chapter(): void
    {
        $questionData = [
            'question' => 'What is the primary purpose of testing?',
            'answers' => [
                ['id' => 1, 'text' => 'To find bugs', 'correct' => true],
                ['id' => 2, 'text' => 'To waste time', 'correct' => false],
                ['id' => 3, 'text' => 'To confuse developers', 'correct' => false],
                ['id' => 4, 'text' => 'To delay deployment', 'correct' => false],
            ],
            'difficulty' => 'medium',
            'type' => 'certification',
            'points' => 5,
        ];

        $response = $this->postJson("/api/v1/admin/chapters/{$this->chapter->id}/questions", $questionData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'question',
                        'answers',
                        'difficulty',
                        'type',
                        'points',
                        'chapter_id'
                    ]
                ]);

        $this->assertEquals($this->chapter->id, $response->json('data.chapter_id'));
    }

    public function test_can_show_specific_question_in_chapter(): void
    {
        $response = $this->getJson("/api/v1/admin/chapters/{$this->chapter->id}/questions/{$this->question->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'question',
                        'answers',
                        'difficulty',
                        'type',
                        'points',
                        'chapter_id'
                    ]
                ]);

        $this->assertEquals($this->question->id, $response->json('data.id'));
    }

    public function test_cannot_show_question_from_different_chapter(): void
    {
        $otherChapter = Chapter::factory()
            ->forCertification($this->certification->id)
            ->create();

        $response = $this->getJson("/api/v1/admin/chapters/{$otherChapter->id}/questions/{$this->question->id}");

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Question non trouvée dans ce chapitre.'
                ]);
    }

    public function test_can_update_question_in_chapter(): void
    {
        $updateData = [
            'question' => 'Updated question text?',
            'answers' => [
                ['id' => 1, 'text' => 'Updated correct answer', 'correct' => true],
                ['id' => 2, 'text' => 'Updated wrong answer 1', 'correct' => false],
                ['id' => 3, 'text' => 'Updated wrong answer 2', 'correct' => false],
                ['id' => 4, 'text' => 'Updated wrong answer 3', 'correct' => false],
            ],
            'difficulty' => 'hard',
            'type' => 'certification',
            'points' => 8,
        ];

        $response = $this->putJson("/api/v1/admin/chapters/{$this->chapter->id}/questions/{$this->question->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data'
                ]);

        $this->assertEquals('Updated question text?', $response->json('data.question'));
        $this->assertEquals('hard', $response->json('data.difficulty'));
        $this->assertEquals(8, $response->json('data.points'));
    }

    public function test_cannot_update_question_from_different_chapter(): void
    {
        $otherChapter = Chapter::factory()
            ->forCertification($this->certification->id)
            ->create();

        $updateData = [
            'question' => 'Updated question text?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer', 'correct' => true],
                ['id' => 2, 'text' => 'Answer', 'correct' => false],
            ],
            'difficulty' => 'hard',
            'type' => 'certification',
            'points' => 8,
        ];

        $response = $this->putJson("/api/v1/admin/chapters/{$otherChapter->id}/questions/{$this->question->id}", $updateData);

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Question non trouvée dans ce chapitre.'
                ]);
    }

    public function test_can_delete_question_from_chapter(): void
    {
        $response = $this->deleteJson("/api/v1/admin/chapters/{$this->chapter->id}/questions/{$this->question->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Question supprimée avec succès.'
                ]);

        $this->assertDatabaseMissing('questions', ['id' => $this->question->id]);
    }

    public function test_cannot_delete_question_from_different_chapter(): void
    {
        $otherChapter = Chapter::factory()
            ->forCertification($this->certification->id)
            ->create();

        $response = $this->deleteJson("/api/v1/admin/chapters/{$otherChapter->id}/questions/{$this->question->id}");

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Question non trouvée dans ce chapitre.'
                ]);

        // Question should still exist
        $this->assertDatabaseHas('questions', ['id' => $this->question->id]);
    }

    public function test_routes_are_consistent(): void
    {
        // Test that all CRUD operations use the same base route pattern
        $baseRoute = "/api/v1/admin/chapters/{$this->chapter->id}/questions";
        
        // List questions
        $response = $this->getJson($baseRoute);
        $response->assertStatus(200);
        
        // Create question
        $questionData = [
            'question' => 'Test question?',
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => true],
                ['id' => 2, 'text' => 'Answer 2', 'correct' => false],
            ],
            'difficulty' => 'easy',
            'type' => 'certification',
            'points' => 3,
        ];
        $response = $this->postJson($baseRoute, $questionData);
        $response->assertStatus(201);
        
        // Show, update, and delete use the same pattern with question ID
        $questionRoute = "{$baseRoute}/{$this->question->id}";
        
        $response = $this->getJson($questionRoute);
        $response->assertStatus(200);
        
        $response = $this->putJson($questionRoute, $questionData);
        $response->assertStatus(200);
        
        $response = $this->deleteJson($questionRoute);
        $response->assertStatus(200);
    }
}