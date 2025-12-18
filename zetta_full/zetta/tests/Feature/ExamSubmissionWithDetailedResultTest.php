<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Models\User;
use App\Services\ExamSessionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamSubmissionWithDetailedResultTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->certification = Certification::factory()->create(['name' => 'Laravel Certification']);
        
        // Create chapters and questions
        $this->chapter = Chapter::factory()
            ->forCertification($this->certification->id)
            ->create(['name' => 'Laravel Basics']);
            
        // Create questions with known answers
        $this->question1 = Question::factory()->create([
            'chapter_id' => $this->chapter->id,
            'question' => 'Laravel Framework is in which programming language?',
            'answers' => [
                ['id' => 1, 'text' => 'PHP', 'correct' => true],
                ['id' => 2, 'text' => 'Python', 'correct' => false],
                ['id' => 3, 'text' => 'Java', 'correct' => false],
                ['id' => 4, 'text' => 'JavaScript', 'correct' => false],
            ],
            'difficulty' => 'easy',
            'points' => 3,
        ]);
        
        $this->question2 = Question::factory()->create([
            'chapter_id' => $this->chapter->id,
            'question' => 'Which statement is true about basic principles?',
            'answers' => [
                ['id' => 1, 'text' => 'Enable proper configuration and follow best practices', 'correct' => true],
                ['id' => 2, 'text' => 'Ignore performance implications', 'correct' => false],
                ['id' => 3, 'text' => 'Skip validation', 'correct' => false],
                ['id' => 4, 'text' => 'Use hardcoded values', 'correct' => false],
            ],
            'difficulty' => 'easy',
            'points' => 2,
        ]);

        // Create quiz configuration
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $this->certification->id,
            'total_questions' => 2,
            'chapter_distribution' => [$this->chapter->id => 2],
            'time_limit' => 30,
            'passing_score' => 75,
        ]);
    }

    public function test_exam_submission_calculates_correct_score(): void
    {
        $this->actingAs($this->user);

        // Start exam session
        $response = $this->postJson("/api/v1/admin/certifications/{$this->certification->id}/exam/start");
        $response->assertStatus(200);
        
        $sessionId = $response->json('data.session_id');

        // Answer first question correctly
        $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/save-answer", [
            'question_id' => $this->question1->id,
            'answer_ids' => [1] // PHP - correct
        ]);

        // Answer second question incorrectly
        $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/save-answer", [
            'question_id' => $this->question2->id,
            'answer_ids' => [2] // Ignore performance implications - incorrect
        ]);

        // Submit exam
        $response = $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/submit");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'quiz_result' => [
                            'certification_name',
                            'score',
                            'passing_score',
                            'passed',
                            'attempt_number',
                            'completed_at',
                            'questions' => [
                                '*' => [
                                    'question',
                                    'student_answer',
                                    'correct_answer',
                                    'explanation',
                                    'is_correct',
                                    'points_earned',
                                    'points_possible',
                                    'difficulty'
                                ]
                            ],
                            'total_questions',
                            'correct_answers',
                            'session_id',
                            'status',
                            'submitted_at'
                        ]
                    ]
                ]);

        $result = $response->json('data.quiz_result');
        
        // Check basic info
        $this->assertEquals('Laravel Certification', $result['certification_name']);
        $this->assertEquals(75, $result['passing_score']);
        $this->assertEquals(1, $result['attempt_number']);
        $this->assertEquals(2, $result['total_questions']);
        $this->assertEquals(1, $result['correct_answers']);
        $this->assertEquals('submitted', $result['status']);

        // Check score calculation: 3 points out of 5 total = 60%
        $this->assertEquals(60.0, $result['score']);
        $this->assertFalse($result['passed']); // 60% < 75%

        // Check question details
        $questions = $result['questions'];
        $this->assertCount(2, $questions);

        // First question (correct)
        $q1 = collect($questions)->firstWhere('question', 'Laravel Framework is in which programming language?');
        $this->assertEquals('PHP', $q1['student_answer']);
        $this->assertEquals('PHP', $q1['correct_answer']);
        $this->assertTrue($q1['is_correct']);
        $this->assertEquals(3, $q1['points_earned']);
        $this->assertEquals(3, $q1['points_possible']);

        // Second question (incorrect)
        $q2 = collect($questions)->firstWhere('question', 'Which statement is true about basic principles?');
        $this->assertEquals('Ignore performance implications', $q2['student_answer']);
        $this->assertEquals('Enable proper configuration and follow best practices', $q2['correct_answer']);
        $this->assertFalse($q2['is_correct']);
        $this->assertEquals(0, $q2['points_earned']);
        $this->assertEquals(2, $q2['points_possible']);
    }

    public function test_perfect_score_exam_submission(): void
    {
        $this->actingAs($this->user);

        // Start exam session
        $response = $this->postJson("/api/v1/admin/certifications/{$this->certification->id}/exam/start");
        $sessionId = $response->json('data.session_id');

        // Answer both questions correctly
        $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/save-answer", [
            'question_id' => $this->question1->id,
            'answer_ids' => [1] // PHP - correct
        ]);

        $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/save-answer", [
            'question_id' => $this->question2->id,
            'answer_ids' => [1] // Enable proper configuration - correct
        ]);

        // Submit exam
        $response = $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/submit");

        $result = $response->json('data.quiz_result');
        
        // Check perfect score: 5 points out of 5 total = 100%
        $this->assertEquals(100.0, $result['score']);
        $this->assertTrue($result['passed']); // 100% > 75%
        $this->assertEquals(2, $result['correct_answers']);

        // Both questions should be correct
        foreach ($result['questions'] as $question) {
            $this->assertTrue($question['is_correct']);
            $this->assertEquals($question['points_possible'], $question['points_earned']);
        }
    }

    public function test_multiple_choice_question_scoring(): void
    {
        // Remove existing questions first
        Question::where('chapter_id', $this->chapter->id)->delete();
        
        // Create a multiple choice question
        $multipleChoiceQuestion = Question::factory()->create([
            'chapter_id' => $this->chapter->id,
            'question' => 'Which are PHP frameworks?',
            'answers' => [
                ['id' => 1, 'text' => 'Laravel', 'correct' => true],
                ['id' => 2, 'text' => 'Symfony', 'correct' => true],
                ['id' => 3, 'text' => 'Django', 'correct' => false],
                ['id' => 4, 'text' => 'Rails', 'correct' => false],
            ],
            'difficulty' => 'medium',
            'points' => 4,
        ]);

        // Update quiz configuration
        $this->certification->quizConfiguration->update([
            'total_questions' => 1,
            'chapter_distribution' => [$this->chapter->id => 1],
        ]);

        $this->actingAs($this->user);

        $response = $this->postJson("/api/v1/admin/certifications/{$this->certification->id}/exam/start");
        $sessionId = $response->json('data.session_id');

        // Answer with both correct answers
        $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/save-answer", [
            'question_id' => $multipleChoiceQuestion->id,
            'answer_ids' => [1, 2] // Laravel and Symfony - both correct
        ]);

        $response = $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/submit");
        $result = $response->json('data.quiz_result');

        $this->assertEquals(100.0, $result['score']);
        $this->assertEquals('Laravel, Symfony', $result['questions'][0]['student_answer']);
        $this->assertEquals('Laravel, Symfony', $result['questions'][0]['correct_answer']);
        $this->assertTrue($result['questions'][0]['is_correct']);
    }

    public function test_attempt_number_increments(): void
    {
        $examSessionService = app(ExamSessionService::class);
        
        // Create first completed session
        $session1 = $examSessionService->createSession($this->user, $this->certification);
        $session1->update(['status' => 'submitted', 'submitted_at' => now()]);

        // Create second completed session
        $session2 = $examSessionService->createSession($this->user, $this->certification);
        $session2->update(['status' => 'expired', 'submitted_at' => now()]);

        // Start third session
        $this->actingAs($this->user);
        $response = $this->postJson("/api/v1/admin/certifications/{$this->certification->id}/exam/start");
        $sessionId = $response->json('data.session_id');

        // Submit exam
        $response = $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/submit");
        $result = $response->json('data.quiz_result');

        $this->assertEquals(3, $result['attempt_number']);
    }
}