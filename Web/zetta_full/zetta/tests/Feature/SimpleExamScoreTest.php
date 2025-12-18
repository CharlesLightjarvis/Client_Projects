<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SimpleExamScoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_simple_exam_score_calculation(): void
    {
        $user = User::factory()->create();
        $certification = Certification::factory()->create(['name' => 'Test Certification']);
        
        $chapter = Chapter::factory()
            ->forCertification($certification->id)
            ->create();
            
        // Create one simple question
        $question = Question::factory()->create([
            'chapter_id' => $chapter->id,
            'question' => 'What is 2 + 2?',
            'answers' => [
                ['id' => 1, 'text' => '4', 'correct' => true],
                ['id' => 2, 'text' => '3', 'correct' => false],
                ['id' => 3, 'text' => '5', 'correct' => false],
                ['id' => 4, 'text' => '6', 'correct' => false],
            ],
            'difficulty' => 'easy',
            'points' => 10,
        ]);

        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 1,
            'chapter_distribution' => [$chapter->id => 1],
            'time_limit' => 30,
            'passing_score' => 50,
        ]);

        $this->actingAs($user);

        // Start exam
        $response = $this->postJson("/api/v1/admin/certifications/{$certification->id}/exam/start");
        $response->assertStatus(200);
        
        $sessionId = $response->json('data.session_id');

        // Answer correctly
        $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/save-answer", [
            'question_id' => $question->id,
            'answer_ids' => [1] // Correct answer
        ]);

        // Submit exam
        $response = $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/submit");
        $response->assertStatus(200);

        $result = $response->json('data.quiz_result');
        
        // Should get 100% score
        $this->assertEquals(100.0, $result['score']);
        $this->assertTrue($result['passed']);
        $this->assertEquals(1, $result['correct_answers']);
        $this->assertEquals(1, $result['total_questions']);
        
        // Check question details
        $this->assertCount(1, $result['questions']);
        $this->assertEquals('4', $result['questions'][0]['student_answer']);
        $this->assertEquals('4', $result['questions'][0]['correct_answer']);
        $this->assertTrue($result['questions'][0]['is_correct']);
        $this->assertEquals(10, $result['questions'][0]['points_earned']);
        $this->assertEquals(10, $result['questions'][0]['points_possible']);
    }

    public function test_wrong_answer_gives_zero_score(): void
    {
        $user = User::factory()->create();
        $certification = Certification::factory()->create(['name' => 'Test Certification']);
        
        $chapter = Chapter::factory()
            ->forCertification($certification->id)
            ->create();
            
        $question = Question::factory()->create([
            'chapter_id' => $chapter->id,
            'question' => 'What is 2 + 2?',
            'answers' => [
                ['id' => 1, 'text' => '4', 'correct' => true],
                ['id' => 2, 'text' => '3', 'correct' => false],
                ['id' => 3, 'text' => '5', 'correct' => false],
                ['id' => 4, 'text' => '6', 'correct' => false],
            ],
            'difficulty' => 'easy',
            'points' => 10,
        ]);

        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 1,
            'chapter_distribution' => [$chapter->id => 1],
            'time_limit' => 30,
            'passing_score' => 50,
        ]);

        $this->actingAs($user);

        $response = $this->postJson("/api/v1/admin/certifications/{$certification->id}/exam/start");
        $sessionId = $response->json('data.session_id');

        // Answer incorrectly
        $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/save-answer", [
            'question_id' => $question->id,
            'answer_ids' => [2] // Wrong answer
        ]);

        $response = $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/submit");
        $result = $response->json('data.quiz_result');
        
        // Should get 0% score
        $this->assertEquals(0.0, $result['score']);
        $this->assertFalse($result['passed']);
        $this->assertEquals(0, $result['correct_answers']);
        
        // Check question details
        $this->assertEquals('3', $result['questions'][0]['student_answer']);
        $this->assertEquals('4', $result['questions'][0]['correct_answer']);
        $this->assertFalse($result['questions'][0]['is_correct']);
        $this->assertEquals(0, $result['questions'][0]['points_earned']);
        $this->assertEquals(10, $result['questions'][0]['points_possible']);
    }
}