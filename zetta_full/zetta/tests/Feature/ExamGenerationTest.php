<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Services\ExamGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_complete_exam_generation_workflow()
    {
        // Arrange - Create a realistic certification with multiple chapters
        $certification = Certification::factory()->create([
            'name' => 'Laravel Developer Certification'
        ]);

        // Create chapters
        $chapter1 = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'name' => 'Laravel Basics',
            'order' => 1,
        ]);

        $chapter2 = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'name' => 'Eloquent ORM',
            'order' => 2,
        ]);

        $chapter3 = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'name' => 'Testing',
            'order' => 3,
        ]);

        // Create questions for each chapter
        Question::factory()->count(15)->create([
            'chapter_id' => $chapter1->id,
            'type' => 'certification',
        ]);

        Question::factory()->count(20)->create([
            'chapter_id' => $chapter2->id,
            'type' => 'certification',
        ]);

        Question::factory()->count(10)->create([
            'chapter_id' => $chapter3->id,
            'type' => 'certification',
        ]);

        // Create exam configuration
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [
                $chapter1->id => 5,  // 5 questions from Laravel Basics
                $chapter2->id => 8,  // 8 questions from Eloquent ORM
                $chapter3->id => 2,  // 2 questions from Testing
            ],
            'time_limit' => 90, // 90 minutes
            'passing_score' => 70,
        ]);

        // Act
        $service = new ExamGeneratorService();
        $exam = $service->generateExam($certification);

        // Assert exam structure
        $this->assertEquals($certification->id, $exam['certification_id']);
        $this->assertEquals(90, $exam['time_limit']);
        $this->assertEquals(15, $exam['total_questions']); // 5 + 8 + 2
        $this->assertCount(15, $exam['questions']);

        // Assert chapter distribution
        $questionsByChapter = collect($exam['questions'])->groupBy('chapter_name');
        $this->assertCount(5, $questionsByChapter['Laravel Basics']);
        $this->assertCount(8, $questionsByChapter['Eloquent ORM']);
        $this->assertCount(2, $questionsByChapter['Testing']);

        // Assert each question has required fields
        foreach ($exam['questions'] as $question) {
            $this->assertArrayHasKey('id', $question);
            $this->assertArrayHasKey('chapter_name', $question);
            $this->assertArrayHasKey('question', $question);
            $this->assertArrayHasKey('answers', $question);
            $this->assertArrayHasKey('type', $question);
            $this->assertArrayHasKey('difficulty', $question);
            $this->assertArrayHasKey('points', $question);
            
            $this->assertNotEmpty($question['question']);
            $this->assertIsArray($question['answers']);
            $this->assertEquals('certification', $question['type']);
        }

        // Assert total points calculation
        $expectedPoints = collect($exam['questions'])->sum('points');
        $this->assertEquals($expectedPoints, $exam['total_points']);
    }

    public function test_exam_generation_with_edge_cases()
    {
        // Arrange - Create minimal setup
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        // Create exactly the number of questions needed
        Question::factory()->count(3)->create([
            'chapter_id' => $chapter->id,
            'type' => 'certification',
            'points' => 1,
        ]);

        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 3], // Use all available questions
            'time_limit' => 30,
        ]);

        // Act
        $service = new ExamGeneratorService();
        $exam = $service->generateExam($certification);

        // Assert
        $this->assertCount(3, $exam['questions']);
        $this->assertEquals(3, $exam['total_points']);
        $this->assertEquals(30, $exam['time_limit']);
    }

    public function test_exam_generation_with_different_point_values()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        // Create questions with different point values
        Question::factory()->create(['chapter_id' => $chapter->id, 'points' => 1]);
        Question::factory()->create(['chapter_id' => $chapter->id, 'points' => 2]);
        Question::factory()->create(['chapter_id' => $chapter->id, 'points' => 3]);
        Question::factory()->create(['chapter_id' => $chapter->id, 'points' => 5]);

        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 4],
        ]);

        // Act
        $service = new ExamGeneratorService();
        $exam = $service->generateExam($certification);

        // Assert
        $this->assertEquals(11, $exam['total_points']); // 1 + 2 + 3 + 5
        $this->assertCount(4, $exam['questions']);
        
        // Verify each question has correct points
        $pointsFound = collect($exam['questions'])->pluck('points')->sort()->values();
        $this->assertEquals([1, 2, 3, 5], $pointsFound->toArray());
    }

    public function test_validation_method_works_correctly()
    {
        // Arrange - Valid setup
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        Question::factory()->count(10)->create(['chapter_id' => $chapter->id]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 5],
        ]);

        // Act
        $service = new ExamGeneratorService();
        $validation = $service->validateExamGeneration($certification);

        // Assert
        $this->assertTrue($validation['valid']);
        $this->assertEmpty($validation['errors']);
    }

    public function test_randomization_produces_different_exams()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        // Create many questions to ensure randomization
        Question::factory()->count(20)->create(['chapter_id' => $chapter->id]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 10],
        ]);

        // Act - Generate multiple exams
        $service = new ExamGeneratorService();
        $exam1 = $service->generateExam($certification);
        $exam2 = $service->generateExam($certification);
        $exam3 = $service->generateExam($certification);

        // Assert - Questions should be different across exams
        $questions1 = collect($exam1['questions'])->pluck('id')->sort()->values();
        $questions2 = collect($exam2['questions'])->pluck('id')->sort()->values();
        $questions3 = collect($exam3['questions'])->pluck('id')->sort()->values();

        // At least one exam should have different questions (very high probability)
        $allSame = $questions1->toArray() === $questions2->toArray() && 
                   $questions2->toArray() === $questions3->toArray();
        
        $this->assertFalse($allSame, 'Generated exams should have different question selections');
    }
}