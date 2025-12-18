<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChapterManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Certification $certification;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create();
        $this->certification = Certification::factory()->create();
    }

    /** @test */
    public function it_can_list_chapters_for_a_certification()
    {
        // Arrange
        $chapters = Chapter::factory()->count(3)->create([
            'certification_id' => $this->certification->id,
        ]);

        // Act
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/certifications/{$this->certification->id}/chapters");

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'certification_id',
                        'name',
                        'description',
                        'order',
                        'questions_count',
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
    public function it_can_create_a_new_chapter()
    {
        // Arrange
        $chapterData = [
            'name' => 'Test Chapter',
            'description' => 'This is a test chapter',
            'order' => 1,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/certifications/{$this->certification->id}/chapters", $chapterData);

        // Assert
        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'certification_id',
                    'name',
                    'description',
                    'order',
                    'questions_count',
                    'created_at',
                    'updated_at',
                ]
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Chapitre créé avec succès.',
                'data' => [
                    'certification_id' => $this->certification->id,
                    'name' => 'Test Chapter',
                    'description' => 'This is a test chapter',
                    'order' => 1,
                    'questions_count' => 0,
                ]
            ]);

        $this->assertDatabaseHas('chapters', [
            'certification_id' => $this->certification->id,
            'name' => 'Test Chapter',
            'description' => 'This is a test chapter',
            'order' => 1,
        ]);
    }

    /** @test */
    public function it_auto_assigns_order_when_not_provided()
    {
        // Arrange
        Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'order' => 5,
        ]);

        $chapterData = [
            'name' => 'New Chapter',
            'description' => 'Chapter without order',
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/certifications/{$this->certification->id}/chapters", $chapterData);

        // Assert
        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'order' => 6, // Should be max order + 1
                ]
            ]);
    }

    /** @test */
    public function it_can_show_a_specific_chapter()
    {
        // Arrange
        $chapter = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
        ]);

        // Act
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/chapters/{$chapter->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'certification_id',
                    'name',
                    'description',
                    'order',
                    'questions_count',
                    'certification',
                    'created_at',
                    'updated_at',
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $chapter->id,
                    'certification_id' => $this->certification->id,
                    'name' => $chapter->name,
                ]
            ]);
    }

    /** @test */
    public function it_can_update_a_chapter()
    {
        // Arrange
        $chapter = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'name' => 'Original Name',
        ]);

        $updateData = [
            'name' => 'Updated Chapter Name',
            'description' => 'Updated description',
            'order' => 10,
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/chapters/{$chapter->id}", $updateData);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Chapitre mis à jour avec succès.',
                'data' => [
                    'id' => $chapter->id,
                    'name' => 'Updated Chapter Name',
                    'description' => 'Updated description',
                    'order' => 10,
                ]
            ]);

        $this->assertDatabaseHas('chapters', [
            'id' => $chapter->id,
            'name' => 'Updated Chapter Name',
            'description' => 'Updated description',
            'order' => 10,
        ]);
    }

    /** @test */
    public function it_can_delete_a_chapter_without_questions()
    {
        // Arrange
        $chapter = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'name' => 'Chapter to Delete',
        ]);

        // Act
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/chapters/{$chapter->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => "Le chapitre 'Chapter to Delete' a été supprimé avec succès.",
            ]);

        $this->assertDatabaseMissing('chapters', [
            'id' => $chapter->id,
        ]);
    }

    /** @test */
    public function it_cannot_delete_a_chapter_with_questions()
    {
        // Arrange
        $chapter = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
        ]);

        // Create questions for this chapter
        Question::factory()->count(2)->create([
            'chapter_id' => $chapter->id,
        ]);

        // Act
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/chapters/{$chapter->id}");

        // Assert
        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Impossible de supprimer le chapitre car il contient 2 question(s). Supprimez d\'abord les questions associées.',
            ]);

        $this->assertDatabaseHas('chapters', [
            'id' => $chapter->id,
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_chapter()
    {
        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/certifications/{$this->certification->id}/chapters", []);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_validates_name_max_length()
    {
        // Arrange
        $chapterData = [
            'name' => str_repeat('a', 256), // 256 characters, exceeds max of 255
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/certifications/{$this->certification->id}/chapters", $chapterData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_validates_order_is_positive_integer()
    {
        // Arrange
        $chapterData = [
            'name' => 'Test Chapter',
            'order' => 0, // Should be at least 1
        ];

        // Act
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/certifications/{$this->certification->id}/chapters", $chapterData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['order']);
    }

    /** @test */
    public function it_returns_chapters_ordered_by_order_field()
    {
        // Arrange
        $chapter1 = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'order' => 3,
            'name' => 'Third Chapter',
        ]);

        $chapter2 = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'order' => 1,
            'name' => 'First Chapter',
        ]);

        $chapter3 = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'order' => 2,
            'name' => 'Second Chapter',
        ]);

        // Act
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/certifications/{$this->certification->id}/chapters");

        // Assert
        $response->assertStatus(200);

        $chapters = $response->json('data');
        $this->assertEquals('First Chapter', $chapters[0]['name']);
        $this->assertEquals('Second Chapter', $chapters[1]['name']);
        $this->assertEquals('Third Chapter', $chapters[2]['name']);
    }
}
