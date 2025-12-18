<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamConfigurationTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Certification $certification;
    protected Chapter $chapter1;
    protected Chapter $chapter2;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create();
        $this->certification = Certification::factory()->create();
        
        $this->chapter1 = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'name' => 'Chapter 1',
        ]);
        
        $this->chapter2 = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'name' => 'Chapter 2',
        ]);

        // Create questions for chapters
        Question::factory()->count(10)->create([
            'chapter_id' => $this->chapter1->id,
        ]);
        
        Question::factory()->count(15)->create([
            'chapter_id' => $this->chapter2->id,
        ]);
    }

    public function test_can_view_exam_configuration_without_existing_config()
    {
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration");

        $response->assertOk()
            ->assertJsonStructure([
                'certification' => ['id', 'name'],
                'chapters' => [
                    '*' => ['id', 'name', 'description', 'questions_count']
                ],
                'configuration'
            ])
            ->assertJson([
                'certification' => [
                    'id' => $this->certification->id,
                    'name' => $this->certification->name,
                ],
                'configuration' => null,
            ]);

        // Verify chapters data
        $responseData = $response->json();
        $this->assertCount(2, $responseData['chapters']);
        
        $chapter1Data = collect($responseData['chapters'])->firstWhere('id', $this->chapter1->id);
        $this->assertEquals(10, $chapter1Data['questions_count']);
        
        $chapter2Data = collect($responseData['chapters'])->firstWhere('id', $this->chapter2->id);
        $this->assertEquals(15, $chapter2Data['questions_count']);
    }

    public function test_can_view_exam_configuration_with_existing_config()
    {
        // Create existing configuration
        $configuration = QuizConfiguration::factory()
            ->forCertification($this->certification->id)
            ->withChapterDistribution([
                $this->chapter1->id => 5,
                $this->chapter2->id => 8,
            ])
            ->create([
                'time_limit' => 90,
                'passing_score' => 75,
            ]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration");

        $response->assertOk()
            ->assertJson([
                'configuration' => [
                    'chapter_distribution' => [
                        $this->chapter1->id => 5,
                        $this->chapter2->id => 8,
                    ],
                    'time_limit' => 90,
                    'passing_score' => 75,
                    'total_questions' => 13,
                ],
            ]);
    }

    public function test_can_create_new_exam_configuration()
    {
        $configData = [
            'total_questions' => 15,
            'chapter_distribution' => [
                $this->chapter1->id => 5,
                $this->chapter2->id => 10,
            ],
            'time_limit' => 120,
            'passing_score' => 80,
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", $configData);

        $response->assertOk()
            ->assertJson([
                'message' => 'Exam configuration updated successfully',
                'configuration' => [
                    'chapter_distribution' => $configData['chapter_distribution'],
                    'time_limit' => 120,
                    'passing_score' => 80,
                    'total_questions' => 15,
                ],
            ]);

        // Verify configuration was saved to database
        $this->assertDatabaseHas('quiz_configurations', [
            'configurable_type' => Certification::class,
            'configurable_id' => $this->certification->id,
            'time_limit' => 120,
            'passing_score' => 80,
            'total_questions' => 15,
        ]);

        $config = QuizConfiguration::where('configurable_id', $this->certification->id)->first();
        $this->assertEquals($configData['chapter_distribution'], $config->chapter_distribution);
    }

    public function test_can_update_existing_exam_configuration()
    {
        // Create existing configuration
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $this->certification->id,
            'chapter_distribution' => [
                $this->chapter1->id => 3,
                $this->chapter2->id => 5,
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        $newConfigData = [
            'total_questions' => 20,
            'chapter_distribution' => [
                $this->chapter1->id => 8,
                $this->chapter2->id => 12,
            ],
            'time_limit' => 150,
            'passing_score' => 85,
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", $newConfigData);

        $response->assertOk()
            ->assertJson([
                'configuration' => [
                    'chapter_distribution' => $newConfigData['chapter_distribution'],
                    'time_limit' => 150,
                    'passing_score' => 85,
                    'total_questions' => 20,
                ],
            ]);

        // Verify only one configuration exists and it's updated
        $this->assertEquals(1, QuizConfiguration::where('configurable_id', $this->certification->id)->count());
        
        $config = QuizConfiguration::where('configurable_id', $this->certification->id)->first();
        $this->assertEquals($newConfigData['chapter_distribution'], $config->chapter_distribution);
        $this->assertEquals(150, $config->time_limit);
        $this->assertEquals(85, $config->passing_score);
    }

    public function test_validation_fails_for_missing_required_fields()
    {
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['total_questions', 'chapter_distribution', 'time_limit', 'passing_score']);
    }

    public function test_validation_fails_for_invalid_chapter_distribution()
    {
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
                'total_questions' => 1,
                'chapter_distribution' => [
                    $this->chapter1->id => 0, // Invalid: less than 1
                ],
                'time_limit' => 60,
                'passing_score' => 70,
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(["chapter_distribution.{$this->chapter1->id}"]);
    }

    public function test_validation_fails_for_insufficient_questions()
    {
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
                'total_questions' => 15,
                'chapter_distribution' => [
                    $this->chapter1->id => 15, // Requesting 15 but only 10 available
                ],
                'time_limit' => 60,
                'passing_score' => 70,
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(["chapter_distribution.{$this->chapter1->id}"]);
        
        $errors = $response->json('errors');
        $this->assertStringContainsString('Only 10 questions available', $errors["chapter_distribution.{$this->chapter1->id}"][0]);
    }

    public function test_validation_fails_for_nonexistent_chapter()
    {
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", [
                'total_questions' => 5,
                'chapter_distribution' => [
                    'nonexistent-chapter-id' => 5,
                ],
                'time_limit' => 60,
                'passing_score' => 70,
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['chapter_distribution.nonexistent-chapter-id']);
        
        $errors = $response->json('errors');
        $this->assertStringContainsString('Chapter not found', $errors['chapter_distribution.nonexistent-chapter-id'][0]);
    }

    public function test_validation_fails_for_invalid_time_limit()
    {
        $testCases = [
            ['time_limit' => 0],
            ['time_limit' => -1],
            ['time_limit' => 'invalid'],
        ];

        foreach ($testCases as $data) {
            $response = $this->actingAs($this->admin)
                ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", array_merge([
                    'total_questions' => 5,
                    'chapter_distribution' => [$this->chapter1->id => 5],
                    'passing_score' => 70,
                ], $data));

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['time_limit']);
        }
    }

    public function test_validation_fails_for_invalid_passing_score()
    {
        $testCases = [
            ['passing_score' => 0],
            ['passing_score' => 101],
            ['passing_score' => -1],
            ['passing_score' => 'invalid'],
        ];

        foreach ($testCases as $data) {
            $response = $this->actingAs($this->admin)
                ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", array_merge([
                    'total_questions' => 5,
                    'chapter_distribution' => [$this->chapter1->id => 5],
                    'time_limit' => 60,
                ], $data));

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['passing_score']);
        }
    }

    public function test_can_configure_multiple_chapters()
    {
        $configData = [
            'total_questions' => 20,
            'chapter_distribution' => [
                $this->chapter1->id => 7,
                $this->chapter2->id => 13,
            ],
            'time_limit' => 180,
            'passing_score' => 90,
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/certifications/{$this->certification->id}/exam-configuration", $configData);

        $response->assertOk()
            ->assertJson([
                'configuration' => [
                    'total_questions' => 20,
                ],
            ]);
    }

    public function test_returns_404_for_nonexistent_certification()
    {
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/certifications/nonexistent-id/exam-configuration");

        $response->assertNotFound();
    }
}