<?php

namespace Tests\Unit;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Services\ExamGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class ExamGeneratorServiceTest extends TestCase
{
    use RefreshDatabase;

    private ExamGeneratorService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ExamGeneratorService();
    }

    public function test_generates_exam_with_correct_structure()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter1 = Chapter::factory()->create(['certification_id' => $certification->id]);
        $chapter2 = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        // Create questions for each chapter
        Question::factory()->count(5)->create(['chapter_id' => $chapter1->id]);
        Question::factory()->count(5)->create(['chapter_id' => $chapter2->id]);
        
        // Create configuration
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [
                $chapter1->id => 2,
                $chapter2->id => 3,
            ],
            'time_limit' => 60,
        ]);

        // Act
        $exam = $this->service->generateExam($certification);

        // Assert
        $this->assertArrayHasKey('certification_id', $exam);
        $this->assertArrayHasKey('questions', $exam);
        $this->assertArrayHasKey('time_limit', $exam);
        $this->assertArrayHasKey('total_points', $exam);
        $this->assertArrayHasKey('total_questions', $exam);
        
        $this->assertEquals($certification->id, $exam['certification_id']);
        $this->assertEquals(60, $exam['time_limit']);
        $this->assertEquals(5, $exam['total_questions']);
        $this->assertCount(5, $exam['questions']);
    }

    public function test_selects_correct_number_of_questions_per_chapter()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter1 = Chapter::factory()->create(['certification_id' => $certification->id, 'name' => 'Chapter 1']);
        $chapter2 = Chapter::factory()->create(['certification_id' => $certification->id, 'name' => 'Chapter 2']);
        
        Question::factory()->count(10)->create(['chapter_id' => $chapter1->id]);
        Question::factory()->count(10)->create(['chapter_id' => $chapter2->id]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [
                $chapter1->id => 3,
                $chapter2->id => 4,
            ],
        ]);

        // Act
        $exam = $this->service->generateExam($certification);

        // Assert
        $chapter1Questions = collect($exam['questions'])->where('chapter_name', 'Chapter 1');
        $chapter2Questions = collect($exam['questions'])->where('chapter_name', 'Chapter 2');
        
        $this->assertCount(3, $chapter1Questions);
        $this->assertCount(4, $chapter2Questions);
    }

    public function test_questions_are_shuffled()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        // Create questions with predictable order
        $questions = [];
        for ($i = 1; $i <= 10; $i++) {
            $questions[] = Question::factory()->create([
                'chapter_id' => $chapter->id,
                'question' => "Question {$i}",
            ]);
        }
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 10],
        ]);

        // Act - Generate multiple exams to test randomization
        $exam1 = $this->service->generateExam($certification);
        $exam2 = $this->service->generateExam($certification);

        // Assert - Questions should be in different order (with high probability)
        $questions1 = collect($exam1['questions'])->pluck('question')->toArray();
        $questions2 = collect($exam2['questions'])->pluck('question')->toArray();
        
        // It's extremely unlikely that two shuffled arrays of 10 items are identical
        $this->assertNotEquals($questions1, $questions2);
    }

    public function test_answers_are_shuffled_for_each_question()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        $originalAnswers = [
            ['id' => 1, 'text' => 'Answer A', 'is_correct' => true],
            ['id' => 2, 'text' => 'Answer B', 'is_correct' => false],
            ['id' => 3, 'text' => 'Answer C', 'is_correct' => false],
            ['id' => 4, 'text' => 'Answer D', 'is_correct' => false],
        ];
        
        Question::factory()->create([
            'chapter_id' => $chapter->id,
            'answers' => $originalAnswers,
        ]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 1],
        ]);

        // Act - Generate multiple exams
        $shuffledAnswersFound = false;
        for ($i = 0; $i < 10; $i++) {
            $exam = $this->service->generateExam($certification);
            $examAnswers = $exam['questions'][0]['answers'];
            
            if ($examAnswers !== $originalAnswers) {
                $shuffledAnswersFound = true;
                break;
            }
        }

        // Assert
        $this->assertTrue($shuffledAnswersFound, 'Answers should be shuffled');
    }

    public function test_calculates_total_points_correctly()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        Question::factory()->create(['chapter_id' => $chapter->id, 'points' => 5]);
        Question::factory()->create(['chapter_id' => $chapter->id, 'points' => 3]);
        Question::factory()->create(['chapter_id' => $chapter->id, 'points' => 2]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 3],
        ]);

        // Act
        $exam = $this->service->generateExam($certification);

        // Assert
        $this->assertEquals(10, $exam['total_points']); // 5 + 3 + 2
    }

    public function test_throws_exception_when_no_configuration_exists()
    {
        // Arrange
        $certification = Certification::factory()->create();

        // Act & Assert
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('No exam configuration found for this certification');
        
        $this->service->generateExam($certification);
    }

    public function test_throws_exception_when_no_chapter_distribution()
    {
        // Arrange
        $certification = Certification::factory()->create();
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => null,
        ]);

        // Act & Assert
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('No exam configuration found for this certification');
        
        $this->service->generateExam($certification);
    }

    public function test_throws_exception_when_chapter_not_found()
    {
        // Arrange
        $certification = Certification::factory()->create();
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => ['non-existent-id' => 5],
        ]);

        // Act & Assert
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Chapter with ID non-existent-id not found');
        
        $this->service->generateExam($certification);
    }

    public function test_throws_exception_when_insufficient_questions()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'name' => 'Test Chapter'
        ]);
        
        // Only create 2 questions
        Question::factory()->count(2)->create(['chapter_id' => $chapter->id]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 5], // But require 5
        ]);

        // Act & Assert
        $this->expectException(\App\Exceptions\InsufficientQuestionsException::class);
        $this->expectExceptionMessage("Chapter 'Test Chapter' has only 2 questions, but 5 are required");
        
        $this->service->generateExam($certification);
    }

    public function test_validate_exam_generation_returns_valid_for_good_configuration()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        Question::factory()->count(5)->create(['chapter_id' => $chapter->id]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 3],
        ]);

        // Act
        $result = $this->service->validateExamGeneration($certification);

        // Assert
        $this->assertTrue($result['valid']);
        $this->assertEmpty($result['errors']);
    }

    public function test_validate_exam_generation_returns_errors_for_bad_configuration()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'name' => 'Test Chapter'
        ]);
        
        // Only 2 questions available
        Question::factory()->count(2)->create(['chapter_id' => $chapter->id]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [
                $chapter->id => 5, // Require 5 questions
                'non-existent-id' => 2, // Non-existent chapter
            ],
        ]);

        // Act
        $result = $this->service->validateExamGeneration($certification);

        // Assert
        $this->assertFalse($result['valid']);
        $this->assertCount(2, $result['errors']);
        $this->assertContains("Chapter 'Test Chapter' has only 2 questions, but 5 are required", $result['errors']);
        $this->assertContains("Chapter with ID non-existent-id not found", $result['errors']);
    }

    public function test_question_format_includes_all_required_fields()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'name' => 'Test Chapter'
        ]);
        
        Question::factory()->create([
            'chapter_id' => $chapter->id,
            'question' => 'Test question?',
            'type' => 'certification',
            'difficulty' => 'medium',
            'points' => 5,
            'answers' => [
                ['id' => 1, 'text' => 'Answer A', 'is_correct' => true],
                ['id' => 2, 'text' => 'Answer B', 'is_correct' => false],
            ],
        ]);
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'chapter_distribution' => [$chapter->id => 1],
        ]);

        // Act
        $exam = $this->service->generateExam($certification);

        // Assert
        $question = $exam['questions'][0];
        $this->assertArrayHasKey('id', $question);
        $this->assertArrayHasKey('chapter_name', $question);
        $this->assertArrayHasKey('question', $question);
        $this->assertArrayHasKey('answers', $question);
        $this->assertArrayHasKey('type', $question);
        $this->assertArrayHasKey('difficulty', $question);
        $this->assertArrayHasKey('points', $question);
        
        $this->assertEquals('Test Chapter', $question['chapter_name']);
        $this->assertEquals('Test question?', $question['question']);
        $this->assertEquals('certification', $question['type']);
        $this->assertEquals('medium', $question['difficulty']);
        $this->assertEquals(5, $question['points']);
    }
}