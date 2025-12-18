<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\ExamSessionService;
use App\Services\ExamGeneratorService;
use App\Models\ExamSession;
use App\Models\User;
use App\Models\Certification;
use App\Models\Question;
use App\Models\QuizConfiguration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Carbon\Carbon;

class ExamSessionServiceTest extends TestCase
{
    use RefreshDatabase;

    private ExamSessionService $service;
    private ExamGeneratorService $mockExamGenerator;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->mockExamGenerator = Mockery::mock(ExamGeneratorService::class);
        $this->service = new ExamSessionService($this->mockExamGenerator);
    }

    public function test_create_session_generates_new_session()
    {
        $user = User::factory()->create();
        $certification = Certification::factory()->create();
        
        QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'time_limit' => 90
        ]);

        $examData = [
            'questions' => [
                ['id' => 'q1', 'question' => 'Test question?', 'points' => 1]
            ],
            'time_limit' => 90
        ];

        $this->mockExamGenerator
            ->shouldReceive('generateExam')
            ->with($certification)
            ->once()
            ->andReturn($examData);

        $session = $this->service->createSession($user, $certification);

        $this->assertInstanceOf(ExamSession::class, $session);
        $this->assertEquals($user->id, $session->user_id);
        $this->assertEquals($certification->id, $session->certification_id);
        $this->assertEquals($examData, $session->exam_data);
        $this->assertEquals('active', $session->status);
        $this->assertNotNull($session->started_at);
        $this->assertNotNull($session->expires_at);
    }

    public function test_create_session_returns_existing_active_session()
    {
        $user = User::factory()->create();
        $certification = Certification::factory()->create();
        
        $existingSession = ExamSession::factory()->create([
            'user_id' => $user->id,
            'certification_id' => $certification->id,
            'status' => 'active',
            'expires_at' => Carbon::now()->addMinutes(30)
        ]);

        $this->mockExamGenerator->shouldNotReceive('generateExam');

        $session = $this->service->createSession($user, $certification);

        $this->assertEquals($existingSession->id, $session->id);
    }

    public function test_save_answer_updates_session_answers()
    {
        $session = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->addMinutes(30)
        ]);

        $this->service->saveAnswer($session, 'question1', [1, 2]);

        $session->refresh();
        $this->assertEquals(['question1' => [1, 2]], $session->answers);
    }

    public function test_save_answer_throws_exception_for_inactive_session()
    {
        $session = ExamSession::factory()->create([
            'status' => 'submitted',
            'expires_at' => Carbon::now()->addMinutes(30) // Not expired, just inactive
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Exam session is not active');

        $this->service->saveAnswer($session, 'question1', [1]);
    }

    public function test_save_answer_throws_exception_for_expired_session()
    {
        $session = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->subMinutes(10)
        ]);

        $this->expectException(\App\Exceptions\ExamTimeExpiredException::class);
        $this->expectExceptionMessage('Cannot save answer: exam time has expired');

        $this->service->saveAnswer($session, 'question1', [1]);
    }

    public function test_submit_exam_calculates_score_and_updates_status()
    {
        $question = Question::factory()->create([
            'answers' => [
                ['id' => 1, 'text' => 'Correct', 'correct' => true],
                ['id' => 2, 'text' => 'Wrong', 'correct' => false]
            ]
        ]);

        $session = ExamSession::factory()->create([
            'status' => 'active',
            'exam_data' => [
                'questions' => [
                    [
                        'id' => $question->id,
                        'question' => 'Test question?',
                        'points' => 1
                    ]
                ]
            ],
            'answers' => [
                $question->id => [1] // Correct answer
            ]
        ]);

        $result = $this->service->submitExam($session);

        $this->assertEquals('submitted', $result->status);
        $this->assertEquals(100, $result->score);
        $this->assertNotNull($result->submitted_at);
    }

    public function test_submit_exam_throws_exception_for_non_active_session()
    {
        $session = ExamSession::factory()->create(['status' => 'submitted']);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Exam session is not active');

        $this->service->submitExam($session);
    }

    public function test_expire_session_updates_status_and_calculates_score()
    {
        $question = Question::factory()->create([
            'answers' => [
                ['id' => 1, 'text' => 'Correct', 'correct' => true],
                ['id' => 2, 'text' => 'Wrong', 'correct' => false]
            ]
        ]);

        $session = ExamSession::factory()->create([
            'status' => 'active',
            'exam_data' => [
                'questions' => [
                    [
                        'id' => $question->id,
                        'question' => 'Test question?',
                        'points' => 1
                    ]
                ]
            ],
            'answers' => [
                $question->id => [2] // Wrong answer
            ]
        ]);

        $result = $this->service->expireSession($session);

        $this->assertEquals('expired', $result->status);
        $this->assertEquals(0, $result->score);
        $this->assertNotNull($result->submitted_at);
    }

    public function test_calculate_score_returns_correct_percentage()
    {
        $question1 = Question::factory()->create([
            'answers' => [
                ['id' => 1, 'text' => 'Correct', 'correct' => true],
                ['id' => 2, 'text' => 'Wrong', 'correct' => false]
            ]
        ]);

        $question2 = Question::factory()->create([
            'answers' => [
                ['id' => 3, 'text' => 'Correct', 'correct' => true],
                ['id' => 4, 'text' => 'Wrong', 'correct' => false]
            ]
        ]);

        $session = ExamSession::factory()->create([
            'exam_data' => [
                'questions' => [
                    ['id' => $question1->id, 'points' => 1],
                    ['id' => $question2->id, 'points' => 1]
                ]
            ],
            'answers' => [
                $question1->id => [1], // Correct
                $question2->id => [4]  // Wrong
            ]
        ]);

        $score = $this->service->calculateScore($session);

        $this->assertEquals(50, $score); // 1 out of 2 correct = 50%
    }

    public function test_calculate_score_handles_multiple_correct_answers()
    {
        $question = Question::factory()->create([
            'answers' => [
                ['id' => 1, 'text' => 'Correct 1', 'correct' => true],
                ['id' => 2, 'text' => 'Correct 2', 'correct' => true],
                ['id' => 3, 'text' => 'Wrong', 'correct' => false]
            ]
        ]);

        $session = ExamSession::factory()->create([
            'exam_data' => [
                'questions' => [
                    ['id' => $question->id, 'points' => 1]
                ]
            ],
            'answers' => [
                $question->id => [1, 2] // Both correct answers
            ]
        ]);

        $score = $this->service->calculateScore($session);

        $this->assertEquals(100, $score);
    }

    public function test_calculate_score_returns_zero_for_no_answers()
    {
        $question = Question::factory()->create();
        
        $session = ExamSession::factory()->create([
            'exam_data' => [
                'questions' => [
                    ['id' => $question->id, 'points' => 1]
                ]
            ],
            'answers' => []
        ]);

        $score = $this->service->calculateScore($session);

        $this->assertEquals(0, $score);
    }

    public function test_check_and_expire_expired_sessions()
    {
        // Create active but expired session
        $expiredSession = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->subMinutes(10)
        ]);

        // Create active non-expired session
        $activeSession = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->addMinutes(10)
        ]);

        $count = $this->service->checkAndExpireExpiredSessions();

        $this->assertEquals(1, $count);
        
        $expiredSession->refresh();
        $activeSession->refresh();
        
        $this->assertEquals('expired', $expiredSession->status);
        $this->assertEquals('active', $activeSession->status);
    }

    public function test_get_active_session_returns_active_session()
    {
        $user = User::factory()->create();
        $certification = Certification::factory()->create();
        
        $activeSession = ExamSession::factory()->create([
            'user_id' => $user->id,
            'certification_id' => $certification->id,
            'status' => 'active',
            'expires_at' => Carbon::now()->addMinutes(30)
        ]);

        $result = $this->service->getActiveSession($user, $certification);

        $this->assertEquals($activeSession->id, $result->id);
    }

    public function test_get_active_session_returns_null_when_no_active_session()
    {
        $user = User::factory()->create();
        $certification = Certification::factory()->create();

        $result = $this->service->getActiveSession($user, $certification);

        $this->assertNull($result);
    }
}