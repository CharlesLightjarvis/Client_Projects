<?php

namespace Tests\Unit;

use App\Models\Chapter;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionFactoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_question_factory_creates_basic_question(): void
    {
        $question = Question::factory()->create();

        $this->assertInstanceOf(Question::class, $question);
        $this->assertNotNull($question->question);
        $this->assertIsArray($question->answers);
        $this->assertNotNull($question->difficulty);
        $this->assertNotNull($question->type);
        $this->assertNotNull($question->points);
    }

    public function test_question_factory_for_chapter(): void
    {
        $chapter = Chapter::factory()->create();
        $question = Question::factory()->forChapter($chapter->id)->create();

        $this->assertEquals($chapter->id, $question->chapter_id);
        $this->assertNull($question->questionable_type);
        $this->assertNull($question->questionable_id);
    }

    public function test_question_factory_easy_difficulty(): void
    {
        $question = Question::factory()->easy()->create();

        $this->assertEquals('easy', $question->difficulty);
        $this->assertGreaterThanOrEqual(1, $question->points);
        $this->assertLessThanOrEqual(3, $question->points);
    }

    public function test_question_factory_medium_difficulty(): void
    {
        $question = Question::factory()->medium()->create();

        $this->assertEquals('medium', $question->difficulty);
        $this->assertGreaterThanOrEqual(3, $question->points);
        $this->assertLessThanOrEqual(6, $question->points);
    }

    public function test_question_factory_hard_difficulty(): void
    {
        $question = Question::factory()->hard()->create();

        $this->assertEquals('hard', $question->difficulty);
        $this->assertGreaterThanOrEqual(6, $question->points);
        $this->assertLessThanOrEqual(10, $question->points);
    }

    public function test_question_factory_multiple_choice(): void
    {
        $question = Question::factory()->multipleChoice()->create();

        $this->assertEquals('certification', $question->type);
        $this->assertCount(4, $question->answers);
        
        // Should have multiple correct answers
        $correctAnswers = collect($question->answers)->where('correct', true);
        $this->assertGreaterThanOrEqual(2, $correctAnswers->count());
    }

    public function test_question_factory_single_choice(): void
    {
        $question = Question::factory()->singleChoice()->create();

        $this->assertEquals('certification', $question->type);
        $this->assertCount(4, $question->answers);
        
        // Should have exactly one correct answer
        $correctAnswers = collect($question->answers)->where('correct', true);
        $this->assertEquals(1, $correctAnswers->count());
    }

    public function test_question_factory_exam_realistic(): void
    {
        $question = Question::factory()->examRealistic()->create();

        $this->assertNotNull($question->question);
        $this->assertCount(4, $question->answers);
        
        // Should have exactly one correct answer for realistic exam questions
        $correctAnswers = collect($question->answers)->where('correct', true);
        $this->assertEquals(1, $correctAnswers->count());
        
        // Should have three incorrect answers
        $incorrectAnswers = collect($question->answers)->where('correct', false);
        $this->assertEquals(3, $incorrectAnswers->count());
    }

    public function test_question_factory_combined_states(): void
    {
        $chapter = Chapter::factory()->create();
        
        $question = Question::factory()
            ->forChapter($chapter->id)
            ->hard()
            ->multipleChoice()
            ->create();

        $this->assertEquals($chapter->id, $question->chapter_id);
        $this->assertEquals('hard', $question->difficulty);
        $this->assertEquals('certification', $question->type);
        $this->assertGreaterThanOrEqual(6, $question->points);
        $this->assertLessThanOrEqual(10, $question->points);
    }
}