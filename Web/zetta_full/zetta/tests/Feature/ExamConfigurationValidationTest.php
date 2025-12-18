<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamConfigurationValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test data
        $this->certification = Certification::factory()->create();
        
        $this->chapter1 = Chapter::factory()
            ->forCertification($this->certification->id)
            ->create(['name' => 'Chapter 1']);
        Question::factory()->forChapter($this->chapter1->id)->count(10)->create();
        
        $this->chapter2 = Chapter::factory()
            ->forCertification($this->certification->id)
            ->create(['name' => 'Chapter 2']);
        Question::factory()->forChapter($this->chapter2->id)->count(15)->create();
    }

    public function test_total_questions_is_required(): void
    {
        $response = $this->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
            'chapter_distribution' => [
                $this->chapter1->id => 5,
                $this->chapter2->id => 8,
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['total_questions']);
    }

    public function test_chapter_distribution_sum_cannot_exceed_total_questions(): void
    {
        $response = $this->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
            'total_questions' => 10,
            'chapter_distribution' => [
                $this->chapter1->id => 5,
                $this->chapter2->id => 8, // 5 + 8 = 13 > 10
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['chapter_distribution']);
        
        $this->assertStringContainsString(
            'cannot exceed the total questions limit',
            $response->json('errors.chapter_distribution.0')
        );
    }

    public function test_chapter_distribution_sum_should_equal_total_questions(): void
    {
        $response = $this->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
            'total_questions' => 15,
            'chapter_distribution' => [
                $this->chapter1->id => 5,
                $this->chapter2->id => 8, // 5 + 8 = 13 < 15
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['chapter_distribution']);
        
        $this->assertStringContainsString(
            'should equal the total questions',
            $response->json('errors.chapter_distribution.0')
        );
    }

    public function test_chapter_questions_cannot_exceed_available_questions(): void
    {
        $response = $this->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
            'total_questions' => 20,
            'chapter_distribution' => [
                $this->chapter1->id => 15, // Chapter 1 only has 10 questions
                $this->chapter2->id => 5,
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(["chapter_distribution.{$this->chapter1->id}"]);
        
        $errors = $response->json('errors');
        $this->assertArrayHasKey("chapter_distribution.{$this->chapter1->id}", $errors);
        $this->assertStringContainsString(
            'Only 10 questions available',
            $errors["chapter_distribution.{$this->chapter1->id}"][0]
        );
    }

    public function test_valid_configuration_is_accepted(): void
    {
        $response = $this->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
            'total_questions' => 13,
            'chapter_distribution' => [
                $this->chapter1->id => 5,
                $this->chapter2->id => 8,
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'configuration' => [
                        'total_questions',
                        'chapter_distribution',
                        'time_limit',
                        'passing_score',
                    ]
                ]);

        $this->assertEquals(13, $response->json('configuration.total_questions'));
        $this->assertEquals(5, $response->json("configuration.chapter_distribution.{$this->chapter1->id}"));
        $this->assertEquals(8, $response->json("configuration.chapter_distribution.{$this->chapter2->id}"));
    }

    public function test_configuration_show_includes_total_questions(): void
    {
        // First create a configuration
        $this->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
            'total_questions' => 13,
            'chapter_distribution' => [
                $this->chapter1->id => 5,
                $this->chapter2->id => 8,
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        // Then retrieve it
        $response = $this->getJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'certification',
                    'chapters',
                    'configuration' => [
                        'total_questions',
                        'chapter_distribution',
                        'time_limit',
                        'passing_score',
                    ]
                ]);

        $this->assertEquals(13, $response->json('configuration.total_questions'));
    }

    public function test_chapters_are_ordered_in_response(): void
    {
        // Update chapter orders
        $this->chapter1->update(['order' => 2]);
        $this->chapter2->update(['order' => 1]);

        $response = $this->getJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration");

        $response->assertStatus(200);
        
        $chapters = $response->json('chapters');
        $this->assertEquals(1, $chapters[0]['order']);
        $this->assertEquals(2, $chapters[1]['order']);
    }

    public function test_nonexistent_chapter_in_distribution_fails(): void
    {
        $response = $this->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
            'total_questions' => 10,
            'chapter_distribution' => [
                'nonexistent-chapter-id' => 5,
                $this->chapter2->id => 5,
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['chapter_distribution.nonexistent-chapter-id']);
    }
}