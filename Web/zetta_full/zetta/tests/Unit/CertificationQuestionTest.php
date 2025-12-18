<?php

namespace Tests\Unit;

use App\Enums\QuestionDifficultyEnum;
use App\Enums\QuestionTypeEnum;
use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificationQuestionTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_certification_question_with_chapter()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);

        // Act
        $question = Question::create([
            'chapter_id' => $chapter->id,
            'question' => 'What is Laravel?',
            'answers' => [
                ['id' => 1, 'text' => 'A PHP framework', 'correct' => true],
                ['id' => 2, 'text' => 'A JavaScript library', 'correct' => false],
            ],
            'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 5,
        ]);

        // Assert
        $this->assertInstanceOf(Question::class, $question);
        $this->assertEquals($chapter->id, $question->chapter_id);
        $this->assertEquals('What is Laravel?', $question->question);
        $this->assertEquals(QuestionDifficultyEnum::MEDIUM->value, $question->difficulty);
        $this->assertEquals(QuestionTypeEnum::CERTIFICATION->value, $question->type);
        $this->assertEquals(5, $question->points);
        $this->assertIsArray($question->answers);
    }

    /** @test */
    public function it_belongs_to_a_chapter()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        $question = Question::factory()->forChapter($chapter->id)->create();

        // Act & Assert
        $this->assertInstanceOf(Chapter::class, $question->chapter);
        $this->assertEquals($chapter->id, $question->chapter->id);
        $this->assertEquals($chapter->name, $question->chapter->name);
    }

    /** @test */
    public function it_can_scope_certification_questions()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        // Create certification questions (with chapter_id)
        $certificationQuestion1 = Question::factory()->forChapter($chapter->id)->create();
        $certificationQuestion2 = Question::factory()->forChapter($chapter->id)->create();
        
        // Create non-certification questions (without chapter_id)
        $moduleQuestion = Question::factory()->create([
            'chapter_id' => null,
            'questionable_type' => 'App\\Models\\Module',
            'questionable_id' => 'some-uuid',
        ]);

        // Act
        $certificationQuestions = Question::certificationQuestions()->get();

        // Assert
        $this->assertCount(2, $certificationQuestions);
        $this->assertTrue($certificationQuestions->contains($certificationQuestion1));
        $this->assertTrue($certificationQuestions->contains($certificationQuestion2));
        $this->assertFalse($certificationQuestions->contains($moduleQuestion));
    }

    /** @test */
    public function it_casts_answers_to_array()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        $answersData = [
            ['id' => 1, 'text' => 'Answer 1', 'correct' => true],
            ['id' => 2, 'text' => 'Answer 2', 'correct' => false],
        ];

        // Act
        $question = Question::create([
            'chapter_id' => $chapter->id,
            'question' => 'Test question?',
            'answers' => $answersData,
            'difficulty' => QuestionDifficultyEnum::EASY->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 3,
        ]);

        // Assert
        $this->assertIsArray($question->answers);
        $this->assertEquals($answersData, $question->answers);
    }

    /** @test */
    public function it_can_be_deleted_when_chapter_is_deleted()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        $question = Question::factory()->forChapter($chapter->id)->create();

        $questionId = $question->id;

        // Act
        $chapter->delete();

        // Assert
        $this->assertDatabaseMissing('questions', ['id' => $questionId]);
    }

    /** @test */
    public function it_has_correct_fillable_attributes()
    {
        // Arrange
        $question = new Question();

        // Act
        $fillable = $question->getFillable();

        // Assert
        $expectedFillable = [
            'questionable_type',
            'questionable_id',
            'chapter_id',
            'question',
            'answers',
            'type',
            'difficulty',
            'points',
        ];

        $this->assertEquals($expectedFillable, $fillable);
    }

    /** @test */
    public function it_has_correct_casts()
    {
        // Arrange
        $question = new Question();

        // Act
        $casts = $question->getCasts();

        // Assert
        $this->assertArrayHasKey('answers', $casts);
        $this->assertEquals('array', $casts['answers']);
    }

    /** @test */
    public function it_can_have_multiple_correct_answers()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);
        
        $answersData = [
            ['id' => 1, 'text' => 'Correct answer 1', 'correct' => true],
            ['id' => 2, 'text' => 'Incorrect answer', 'correct' => false],
            ['id' => 3, 'text' => 'Correct answer 2', 'correct' => true],
        ];

        // Act
        $question = Question::create([
            'chapter_id' => $chapter->id,
            'question' => 'Which are correct?',
            'answers' => $answersData,
            'difficulty' => QuestionDifficultyEnum::HARD->value,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
            'points' => 10,
        ]);

        // Assert
        $correctAnswers = collect($question->answers)->where('correct', true);
        $this->assertCount(2, $correctAnswers);
    }

    /** @test */
    public function it_stores_difficulty_as_enum_value()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);

        // Act
        $question = Question::factory()->forChapter($chapter->id)->create([
            'difficulty' => QuestionDifficultyEnum::HARD->value,
        ]);

        // Assert
        $this->assertEquals(QuestionDifficultyEnum::HARD->value, $question->difficulty);
        $this->assertDatabaseHas('questions', [
            'id' => $question->id,
            'difficulty' => QuestionDifficultyEnum::HARD->value,
        ]);
    }

    /** @test */
    public function it_stores_type_as_enum_value()
    {
        // Arrange
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);

        // Act
        $question = Question::factory()->forChapter($chapter->id)->create([
            'type' => QuestionTypeEnum::CERTIFICATION->value,
        ]);

        // Assert
        $this->assertEquals(QuestionTypeEnum::CERTIFICATION->value, $question->type);
        $this->assertDatabaseHas('questions', [
            'id' => $question->id,
            'type' => QuestionTypeEnum::CERTIFICATION->value,
        ]);
    }
}