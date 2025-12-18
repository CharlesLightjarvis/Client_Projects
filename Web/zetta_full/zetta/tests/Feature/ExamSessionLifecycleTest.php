<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Models\ExamSession;
use App\Services\ExamSessionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class ExamSessionLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Certification $certification;
    private Chapter $chapter;
    private Question $question;
    private ExamSessionService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->certification = Certification::factory()->create();
        $this->chapter = Chapter::factory()->create([
            'certification_id' => $this->certification->id
        ]);
        
        $this->question = Question::factory()->create([
            'chapter_id' => $this->chapter->id,
            'answers' => [
                ['id' => 1, 'text' => 'Correct Answer', 'correct' => true],
                ['id' => 2, 'text' => 'Wrong Answer 1', 'correct' => false],
                ['id' => 3, 'text' => 'Wrong Answer 2', 'correct' => false],
            ]
        ]);

        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $this->certification->id,
            'chapter_distribution' => [
                $this->chapter->id => 1
            ],
            'time_limit' => 60,
            'passing_score' => 70
        ]);

        $this->service = app(ExamSessionService::class);
    }

    public function test_complete_exam_session_lifecycle()
    {
        // 1. Create exam session
        $session = $this->service->createSession($this->user, $this->certification);
        
        $this->assertInstanceOf(ExamSession::class, $session);
        $this->assertEquals('active', $session->status);
        $this->assertTrue($session->isActive());
        $this->assertNotNull($session->exam_data);
        $this->assertCount(1, $session->exam_data['questions']);

        // 2. Save answer
        $questionId = $session->exam_data['questions'][0]['id'];
        $this->service->saveAnswer($session, $questionId, [1]); // Correct answer

        $session->refresh();
        $this->assertEquals([1], $session->answers[$questionId]);

        // 3. Submit exam
        $submittedSession = $this->service->submitExam($session);
        
        $this->assertEquals('submitted', $submittedSession->status);
        $this->assertEquals(100.0, $submittedSession->score); // Correct answer = 100%
        $this->assertNotNull($submittedSession->submitted_at);
        $this->assertFalse($submittedSession->isActive());
    }

    public function test_exam_session_expiration()
    {
        // Create session that expires in the past
        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => Carbon::now()->subMinutes(10),
            'exam_data' => [
                'questions' => [
                    [
                        'id' => $this->question->id,
                        'question' => 'Test question?',
                        'points' => 1
                    ]
                ]
            ],
            'answers' => [
                $this->question->id => [2] // Wrong answer
            ]
        ]);

        $this->assertTrue($session->isExpired());
        $this->assertFalse($session->isActive());

        // Expire the session
        $expiredSession = $this->service->expireSession($session);
        
        $this->assertEquals('expired', $expiredSession->status);
        $this->assertEquals(0, $expiredSession->score); // Wrong answer = 0%
        $this->assertNotNull($expiredSession->submitted_at);
    }

    public function test_multiple_answers_per_question()
    {
        // Create question with multiple correct answers
        $multiAnswerQuestion = Question::factory()->create([
            'chapter_id' => $this->chapter->id,
            'answers' => [
                ['id' => 1, 'text' => 'Correct 1', 'correct' => true],
                ['id' => 2, 'text' => 'Correct 2', 'correct' => true],
                ['id' => 3, 'text' => 'Wrong', 'correct' => false],
            ]
        ]);

        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => Carbon::now()->addMinutes(30),
            'exam_data' => [
                'questions' => [
                    [
                        'id' => $multiAnswerQuestion->id,
                        'question' => 'Multi-answer question?',
                        'points' => 1
                    ]
                ]
            ]
        ]);

        // Test partial correct answers (should be wrong)
        $this->service->saveAnswer($session, $multiAnswerQuestion->id, [1]); // Only one correct
        $score = $this->service->calculateScore($session);
        $this->assertEquals(0, $score);

        // Test all correct answers
        $this->service->saveAnswer($session, $multiAnswerQuestion->id, [1, 2]); // Both correct
        $score = $this->service->calculateScore($session);
        $this->assertEquals(100.0, $score);
    }

    public function test_cannot_save_answer_to_inactive_session()
    {
        // Test with submitted session (not expired)
        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'submitted',
            'expires_at' => now()->addMinutes(30) // Not expired
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Exam session is not active');

        $this->service->saveAnswer($session, 'question1', [1]);
    }

    public function test_cannot_submit_non_active_session()
    {
        $session = ExamSession::factory()->submitted()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Exam session is not active');

        $this->service->submitExam($session);
    }

    public function test_create_session_returns_existing_active_session()
    {
        // Create first session
        $firstSession = $this->service->createSession($this->user, $this->certification);
        
        // Try to create another session - should return the same one
        $secondSession = $this->service->createSession($this->user, $this->certification);
        
        $this->assertEquals($firstSession->id, $secondSession->id);
    }

    public function test_expired_sessions_cleanup()
    {
        // Create multiple sessions with different states
        $activeSession = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->addMinutes(30)
        ]);

        $expiredSession1 = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->subMinutes(10)
        ]);

        $expiredSession2 = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->subMinutes(5)
        ]);

        $submittedSession = ExamSession::factory()->submitted()->create([
            'expires_at' => Carbon::now()->subMinutes(15)
        ]);

        $count = $this->service->checkAndExpireExpiredSessions();

        $this->assertEquals(2, $count); // Only 2 active expired sessions

        // Refresh models
        $activeSession->refresh();
        $expiredSession1->refresh();
        $expiredSession2->refresh();
        $submittedSession->refresh();

        $this->assertEquals('active', $activeSession->status);
        $this->assertEquals('expired', $expiredSession1->status);
        $this->assertEquals('expired', $expiredSession2->status);
        $this->assertEquals('submitted', $submittedSession->status); // Unchanged
    }

    public function test_score_calculation_with_different_point_values()
    {
        $question1 = Question::factory()->create([
            'chapter_id' => $this->chapter->id,
            'answers' => [
                ['id' => 1, 'text' => 'Correct', 'correct' => true],
                ['id' => 2, 'text' => 'Wrong', 'correct' => false]
            ]
        ]);

        $question2 = Question::factory()->create([
            'chapter_id' => $this->chapter->id,
            'answers' => [
                ['id' => 3, 'text' => 'Correct', 'correct' => true],
                ['id' => 4, 'text' => 'Wrong', 'correct' => false]
            ]
        ]);

        $session = ExamSession::factory()->create([
            'exam_data' => [
                'questions' => [
                    ['id' => $question1->id, 'points' => 2], // Worth 2 points
                    ['id' => $question2->id, 'points' => 3]  // Worth 3 points
                ]
            ],
            'answers' => [
                $question1->id => [1], // Correct (2 points)
                $question2->id => [4]  // Wrong (0 points)
            ]
        ]);

        $score = $this->service->calculateScore($session);

        $this->assertEquals(40.0, $score); // 2 out of 5 total points = 40%
    }

    public function test_remaining_time_calculation()
    {
        $now = Carbon::now();
        $expiresAt = $now->copy()->addMinutes(5);
        
        $session = ExamSession::factory()->create([
            'started_at' => $now,
            'expires_at' => $expiresAt
        ]);

        // Refresh to get the actual database values
        $session->refresh();
        
        $remainingTime = $session->remaining_time;
        
        // Should be approximately 5 minutes (300 seconds), allow for timing differences
        $this->assertGreaterThan(250, $remainingTime);
        $this->assertLessThan(350, $remainingTime);
    }

    public function test_session_attributes()
    {
        $examData = [
            'questions' => [
                ['id' => '1', 'question' => 'Q1'],
                ['id' => '2', 'question' => 'Q2'],
                ['id' => '3', 'question' => 'Q3'],
            ]
        ];

        $answers = [
            '1' => [1],
            '2' => [2, 3]
        ];

        $session = ExamSession::factory()->create([
            'exam_data' => $examData,
            'answers' => $answers
        ]);

        $this->assertEquals(3, $session->total_questions);
        $this->assertEquals(2, $session->answered_questions);
    }
}