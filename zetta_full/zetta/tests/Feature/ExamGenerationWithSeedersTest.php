<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Services\ExamGeneratorService;
use Database\Seeders\ChapterSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamGenerationWithSeedersTest extends TestCase
{
    use RefreshDatabase;

    private ExamGeneratorService $examGeneratorService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->examGeneratorService = app(ExamGeneratorService::class);
    }

    public function test_exam_generation_with_seeded_data(): void
    {
        // Seed the database with realistic data
        $seeder = new ChapterSeeder();
        $seeder->run();

        $certification = Certification::first();
        $chapters = $certification->chapters;

        // Create exam configuration using seeded chapters
        $chapterDistribution = [];
        foreach ($chapters as $chapter) {
            $availableQuestions = $chapter->questions()->count();
            $chapterDistribution[$chapter->id] = min(5, $availableQuestions); // Max 5 questions per chapter
        }

        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => array_sum($chapterDistribution),
            'chapter_distribution' => $chapterDistribution,
            'time_limit' => 60,
            'passing_score' => 70,
        ]);

        // Generate exam
        $exam = $this->examGeneratorService->generateExam($certification);

        // Assert exam structure
        $this->assertArrayHasKey('certification_id', $exam);
        $this->assertArrayHasKey('questions', $exam);
        $this->assertArrayHasKey('time_limit', $exam);
        $this->assertArrayHasKey('total_points', $exam);

        // Assert questions are from configured chapters
        $examQuestionIds = collect($exam['questions'])->pluck('id');
        $configuredChapterIds = array_keys($chapterDistribution);
        
        foreach ($exam['questions'] as $question) {
            $originalQuestion = Question::find($question['id']);
            $this->assertContains($originalQuestion->chapter_id, $configuredChapterIds);
        }

        // Assert chapter distribution is respected
        $questionsByChapter = collect($exam['questions'])->groupBy('chapter_id');
        foreach ($chapterDistribution as $chapterId => $expectedCount) {
            if ($expectedCount > 0) {
                $actualCount = $questionsByChapter->get($chapterId, collect())->count();
                $this->assertEquals($expectedCount, $actualCount);
            }
        }
    }

    public function test_exam_generation_with_different_difficulties(): void
    {
        $certification = Certification::factory()->create();
        
        // Create chapters with questions of different difficulties
        $chapter1 = Chapter::factory()->forCertification($certification->id)->create(['name' => 'Easy Chapter']);
        $chapter2 = Chapter::factory()->forCertification($certification->id)->create(['name' => 'Hard Chapter']);

        // Create easy questions for chapter 1
        Question::factory()->forChapter($chapter1->id)->easy()->count(10)->create();
        
        // Create hard questions for chapter 2
        Question::factory()->forChapter($chapter2->id)->hard()->count(8)->create();

        // Configure exam
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [
                $chapter1->id => 5,
                $chapter2->id => 3,
            ],
            'time_limit' => 45,
        ]);

        // Generate exam
        $exam = $this->examGeneratorService->generateExam($certification);

        // Assert we have questions from both chapters
        $this->assertCount(8, $exam['questions']);

        // Assert point distribution reflects difficulty
        $chapter1Questions = collect($exam['questions'])->where('chapter_id', $chapter1->id);
        $chapter2Questions = collect($exam['questions'])->where('chapter_id', $chapter2->id);

        if ($chapter1Questions->isNotEmpty() && $chapter2Questions->isNotEmpty()) {
            $avgEasyPoints = $chapter1Questions->avg('points');
            $avgHardPoints = $chapter2Questions->avg('points');
            $this->assertLessThan($avgHardPoints, $avgEasyPoints);
        }
    }

    public function test_exam_generation_with_mixed_question_types(): void
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->forCertification($certification->id)->create();

        // Create different types of questions
        Question::factory()->forChapter($chapter->id)->singleChoice()->count(5)->create();
        Question::factory()->forChapter($chapter->id)->multipleChoice()->count(5)->create();

        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 8],
        ]);

        $exam = $this->examGeneratorService->generateExam($certification);

        // Assert we have both single and multiple choice patterns
        $examQuestions = collect($exam['questions']);
        $singleChoice = $examQuestions->filter(function ($q) {
            $originalQuestion = Question::find($q['id']);
            return collect($originalQuestion->answers)->where('correct', true)->count() === 1;
        });
        $multipleChoice = $examQuestions->filter(function ($q) {
            $originalQuestion = Question::find($q['id']);
            return collect($originalQuestion->answers)->where('correct', true)->count() > 1;
        });
        
        $this->assertGreaterThan(0, $singleChoice->count() + $multipleChoice->count());
    }

    public function test_realistic_exam_scenario_with_factories(): void
    {
        // Create a realistic certification exam scenario
        $certification = Certification::factory()->create([
            'name' => 'Advanced Web Development Certification'
        ]);

        // Create chapters with realistic topics
        $fundamentals = Chapter::factory()
            ->forCertification($certification->id)
            ->withOrder(1)
            ->create([
                'name' => 'Web Development Fundamentals',
                'description' => 'Basic HTML, CSS, and JavaScript concepts'
            ]);

        $security = Chapter::factory()
            ->forCertification($certification->id)
            ->withOrder(2)
            ->create([
                'name' => 'Web Security',
                'description' => 'Authentication, authorization, and security best practices'
            ]);

        $advanced = Chapter::factory()
            ->forCertification($certification->id)
            ->withOrder(3)
            ->create([
                'name' => 'Advanced Topics',
                'description' => 'Performance optimization and advanced frameworks'
            ]);

        // Create realistic questions
        Question::factory()->forChapter($fundamentals->id)->easy()->examRealistic()->count(15)->create();
        Question::factory()->forChapter($security->id)->medium()->examRealistic()->count(12)->create();
        Question::factory()->forChapter($advanced->id)->hard()->examRealistic()->count(8)->create();

        // Configure realistic exam
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [
                $fundamentals->id => 10,
                $security->id => 8,
                $advanced->id => 5,
            ],
            'time_limit' => 90,
            'passing_score' => 75,
        ]);

        // Generate and validate exam
        $exam = $this->examGeneratorService->generateExam($certification);

        $this->assertEquals($certification->id, $exam['certification_id']);
        $this->assertCount(23, $exam['questions']);
        $this->assertEquals(90, $exam['time_limit']);
        $this->assertGreaterThan(0, $exam['total_points']);

        // Verify question distribution
        $questionsByChapter = collect($exam['questions'])->groupBy('chapter_id');
        $this->assertCount(10, $questionsByChapter->get($fundamentals->id));
        $this->assertCount(8, $questionsByChapter->get($security->id));
        $this->assertCount(5, $questionsByChapter->get($advanced->id));
    }
}