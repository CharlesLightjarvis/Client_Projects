<?php

namespace Tests\Unit;

use App\Models\Chapter;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionChapterRelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_question_belongs_to_chapter()
    {
        $chapter = Chapter::factory()->create();
        $question = Question::factory()->forChapter($chapter->id)->create();

        $this->assertInstanceOf(Chapter::class, $question->chapter);
        $this->assertEquals($chapter->id, $question->chapter->id);
    }

    public function test_question_can_have_null_chapter_id()
    {
        $question = Question::factory()->create([
            'chapter_id' => null,
            'questionable_type' => 'App\Models\Module',
            'questionable_id' => '123e4567-e89b-12d3-a456-426614174000'
        ]);

        $this->assertNull($question->chapter_id);
        $this->assertNull($question->chapter);
    }

    public function test_certification_questions_scope()
    {
        $chapter = Chapter::factory()->create();
        $certificationQuestion = Question::factory()->forChapter($chapter->id)->create();
        $moduleQuestion = Question::factory()->create([
            'chapter_id' => null,
            'questionable_type' => 'App\Models\Module',
            'questionable_id' => '123e4567-e89b-12d3-a456-426614174000'
        ]);

        $certificationQuestions = Question::certificationQuestions()->get();

        $this->assertCount(1, $certificationQuestions);
        $this->assertTrue($certificationQuestions->contains($certificationQuestion));
        $this->assertFalse($certificationQuestions->contains($moduleQuestion));
    }

    public function test_deleting_chapter_deletes_questions()
    {
        $chapter = Chapter::factory()->create();
        $question = Question::factory()->forChapter($chapter->id)->create();

        $this->assertDatabaseHas('questions', ['id' => $question->id]);

        $chapter->delete();

        $this->assertDatabaseMissing('questions', ['id' => $question->id]);
    }
}