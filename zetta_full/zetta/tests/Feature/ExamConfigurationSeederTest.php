<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use Database\Seeders\ExamConfigurationSeeder;
use Database\Seeders\ChapterSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamConfigurationSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_exam_configuration_seeder_creates_configurations(): void
    {
        // Create test data first
        $certification = Certification::factory()->create();
        $chapters = Chapter::factory()->forCertification($certification->id)->count(3)->create();
        
        foreach ($chapters as $chapter) {
            Question::factory()->forChapter($chapter->id)->count(10)->create();
        }

        // Run the configuration seeder
        $seeder = new ExamConfigurationSeeder();
        $seeder->run();

        // Assert configuration was created
        $this->assertDatabaseHas('quiz_configurations', [
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
        ]);

        $configuration = $certification->fresh()->quizConfiguration;
        $this->assertNotNull($configuration);
        $this->assertNotEmpty($configuration->chapter_distribution);
        $this->assertGreaterThan(0, $configuration->total_questions);
        $this->assertGreaterThan(0, $configuration->time_limit);
        $this->assertGreaterThan(0, $configuration->passing_score);
    }

    public function test_seeder_calculates_appropriate_question_distribution(): void
    {
        $certification = Certification::factory()->create();
        
        // Create chapters with different question counts
        $fundamentals = Chapter::factory()
            ->forCertification($certification->id)
            ->create(['name' => 'Fundamentals and Core Concepts']);
        Question::factory()->forChapter($fundamentals->id)->count(15)->create();

        $security = Chapter::factory()
            ->forCertification($certification->id)
            ->create(['name' => 'Security and Best Practices']);
        Question::factory()->forChapter($security->id)->count(12)->create();

        $seeder = new ExamConfigurationSeeder();
        $seeder->run();

        $configuration = $certification->fresh()->quizConfiguration;
        $distribution = $configuration->chapter_distribution;

        // Assert that distribution respects available questions
        $this->assertLessThanOrEqual(15, $distribution[$fundamentals->id]);
        $this->assertLessThanOrEqual(12, $distribution[$security->id]);
        
        // Assert that some questions are selected from each chapter
        $this->assertGreaterThan(0, $distribution[$fundamentals->id]);
        $this->assertGreaterThan(0, $distribution[$security->id]);
    }

    public function test_seeder_calculates_appropriate_time_limits(): void
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->forCertification($certification->id)->create();
        
        // Create different numbers of questions to test time calculation
        Question::factory()->forChapter($chapter->id)->count(20)->create();

        $seeder = new ExamConfigurationSeeder();
        $seeder->run();

        $configuration = $certification->fresh()->quizConfiguration;
        
        // Time should be reasonable (roughly 2 minutes per question + buffer)
        $expectedMinTime = $configuration->total_questions * 1.5; // 1.5 min minimum
        $expectedMaxTime = $configuration->total_questions * 3;   // 3 min maximum
        
        $this->assertGreaterThanOrEqual($expectedMinTime, $configuration->time_limit);
        $this->assertLessThanOrEqual($expectedMaxTime, $configuration->time_limit);
    }

    public function test_seeder_sets_appropriate_passing_scores(): void
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->forCertification($certification->id)->create();
        Question::factory()->forChapter($chapter->id)->count(25)->create();

        $seeder = new ExamConfigurationSeeder();
        $seeder->run();

        $configuration = $certification->fresh()->quizConfiguration;
        
        // Passing score should be between 60-85%
        $this->assertGreaterThanOrEqual(60, $configuration->passing_score);
        $this->assertLessThanOrEqual(85, $configuration->passing_score);
    }

    public function test_seeder_skips_existing_configurations(): void
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->forCertification($certification->id)->create();
        Question::factory()->forChapter($chapter->id)->count(10)->create();

        // Create existing configuration
        $existingConfig = QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 5,
            'time_limit' => 30,
        ]);

        $seeder = new ExamConfigurationSeeder();
        $seeder->run();

        // Assert configuration wasn't changed
        $configuration = $certification->fresh()->quizConfiguration;
        $this->assertEquals($existingConfig->id, $configuration->id);
        $this->assertEquals(5, $configuration->total_questions);
        $this->assertEquals(30, $configuration->time_limit);
    }

    public function test_seeder_handles_certifications_without_chapters(): void
    {
        // Create certification without chapters
        $certification = Certification::factory()->create();

        $seeder = new ExamConfigurationSeeder();
        $seeder->run();

        // Assert no configuration was created
        $this->assertNull($certification->fresh()->quizConfiguration);
    }

    public function test_combined_seeder_creates_complete_exam_setup(): void
    {
        // Create a certification
        $certification = Certification::factory()->create();

        // Run the combined seeder
        $this->artisan('db:seed', ['--class' => 'CertificationExamSeeder']);

        // Assert chapters were created
        $this->assertGreaterThan(0, $certification->fresh()->chapters()->count());

        // Assert questions were created
        $totalQuestions = $certification->fresh()->chapters()
            ->withCount('questions')
            ->get()
            ->sum('questions_count');
        $this->assertGreaterThan(0, $totalQuestions);

        // Assert configuration was created
        $configuration = $certification->fresh()->quizConfiguration;
        $this->assertNotNull($configuration);
        $this->assertNotEmpty($configuration->chapter_distribution);
    }
}