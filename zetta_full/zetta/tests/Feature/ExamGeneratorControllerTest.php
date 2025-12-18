<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Models\ExamSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class ExamGeneratorControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Certification $certification;
    private Chapter $chapter1;
    private Chapter $chapter2;
    private QuizConfiguration $quizConfig;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->certification = Certification::factory()->create();
        
        // Create chapters
        $this->chapter1 = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'name' => 'Chapter 1',
            'order' => 1
        ]);
        
        $this->chapter2 = Chapter::factory()->create([
            'certification_id' => $this->certification->id,
            'name' => 'Chapter 2',
            'order' => 2
        ]);

        // Create questions for each chapter
        Question::factory()->count(5)->create([
            'chapter_id' => $this->chapter1->id,
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => true],
                ['id' => 2, 'text' => 'Answer 2', 'correct' => false],
                ['id' => 3, 'text' => 'Answer 3', 'correct' => false],
            ]
        ]);

        Question::factory()->count(5)->create([
            'chapter_id' => $this->chapter2->id,
            'answers' => [
                ['id' => 1, 'text' => 'Answer 1', 'correct' => false],
                ['id' => 2, 'text' => 'Answer 2', 'correct' => true],
                ['id' => 3, 'text' => 'Answer 3', 'correct' => false],
            ]
        ]);

        // Create quiz configuration
        $this->quizConfig = QuizConfiguration::factory()->create([
            'configurable_type' => Certification::class,
            'configurable_id' => $this->certification->id,
            'chapter_distribution' => [
                $this->chapter1->id => 2,
                $this->chapter2->id => 3
            ],
            'time_limit' => 60,
            'passing_score' => 70
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_can_generate_exam_successfully()
    {
        $response = $this->getJson("/api/v1/admin/certifications/{$this->certification->id}/exam/generate");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'certification_id',
                    'questions',
                    'time_limit',
                    'total_points',
                    'total_questions'
                ]
            ]);

        $data = $response->json('data');
        $this->assertEquals($this->certification->id, $data['certification_id']);
        $this->assertEquals(5, $data['total_questions']); // 2 + 3 from configuration
        $this->assertEquals(60, $data['time_limit']);
        $this->assertCount(5, $data['questions']);
    }

    public function test_cannot_generate_exam_without_configuration()
    {
        $certificationWithoutConfig = Certification::factory()->create();

        $response = $this->getJson("/api/v1/admin/certifications/{$certificationWithoutConfig->id}/exam/generate");

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Cannot generate exam'
            ]);
    }

    public function test_cannot_generate_exam_with_insufficient_questions()
    {
        // Create configuration requiring more questions than available
        $this->quizConfig->update([
            'chapter_distribution' => [
                $this->chapter1->id => 10, // Only 5 questions available
                $this->chapter2->id => 3
            ]
        ]);

        $response = $this->getJson("/api/v1/admin/certifications/{$this->certification->id}/exam/generate");

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Cannot generate exam'
            ])
            ->assertJsonPath('errors.0', "Chapter 'Chapter 1' has only 5 questions, but 10 are required");
    }

    public function test_can_start_exam_session()
    {
        $response = $this->postJson("/api/v1/admin/certifications/{$this->certification->id}/exam/start");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'session_id',
                    'exam_data',
                    'started_at',
                    'expires_at',
                    'remaining_time',
                    'total_questions'
                ]
            ]);

        $this->assertDatabaseHas('exam_sessions', [
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active'
        ]);
    }

    public function test_returns_existing_active_session_when_starting_exam()
    {
        // Create an active session
        $existingSession = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => now()->addMinutes(30)
        ]);

        $response = $this->postJson("/api/v1/admin/certifications/{$this->certification->id}/exam/start");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Active exam session found'
            ])
            ->assertJsonPath('data.session_id', $existingSession->id);
    }

    public function test_can_save_answer_during_exam()
    {
        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => now()->addMinutes(30)
        ]);

        $questionId = 'test-question-id';
        $answerIds = [1, 2];

        $response = $this->postJson("/api/v1/admin/exam-sessions/{$session->id}/save-answer", [
            'question_id' => $questionId,
            'answer_ids' => $answerIds
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Answer saved successfully'
            ]);

        $session->refresh();
        $this->assertEquals($answerIds, $session->answers[$questionId]);
    }

    public function test_cannot_save_answer_for_expired_session()
    {
        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => now()->subMinutes(10) // Expired
        ]);

        $response = $this->postJson("/api/v1/admin/exam-sessions/{$session->id}/save-answer", [
            'question_id' => 'test-question-id',
            'answer_ids' => [1]
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Exam session is not active or has expired'
            ]);
    }

    public function test_can_submit_exam_successfully()
    {
        $questions = Question::take(2)->get();
        $examData = [
            'questions' => $questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'points' => $question->points ?? 1
                ];
            })->toArray()
        ];

        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => now()->addMinutes(30),
            'exam_data' => $examData
        ]);

        $answers = [];
        foreach ($questions as $question) {
            $correctAnswers = collect($question->answers)
                ->where('correct', true)
                ->pluck('id')
                ->toArray();
            $answers[$question->id] = $correctAnswers;
        }

        $response = $this->postJson("/api/v1/admin/exam-sessions/{$session->id}/submit", [
            'answers' => $answers
        ]);

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
                        'questions',
                        'total_questions',
                        'correct_answers',
                        'session_id',
                        'status',
                        'submitted_at'
                    ]
                ]
            ]);

        $session->refresh();
        $this->assertEquals('submitted', $session->status);
        $this->assertEquals(100.0, $session->score); // All correct answers
        $this->assertNotNull($session->submitted_at);
        
        // Check the detailed result structure
        $result = $response->json('data.quiz_result');
        $this->assertEquals($this->certification->name, $result['certification_name']);
        $this->assertEquals(100.0, $result['score']);
        $this->assertTrue($result['passed']);
        $this->assertEquals('submitted', $result['status']);
    }

    public function test_cannot_submit_expired_exam()
    {
        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => now()->subMinutes(10) // Expired
        ]);

        $response = $this->postJson("/api/v1/admin/exam-sessions/{$session->id}/submit", [
            'answers' => []
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Exam session has expired'
            ]);

        $session->refresh();
        $this->assertEquals('expired', $session->status);
    }

    public function test_cannot_submit_already_submitted_exam()
    {
        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'submitted',
            'expires_at' => now()->addMinutes(30)
        ]);

        $response = $this->postJson("/api/v1/admin/exam-sessions/{$session->id}/submit", [
            'answers' => []
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Exam session is not active'
            ]);
    }

    public function test_can_get_exam_session_status()
    {
        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => now()->addMinutes(30)
        ]);

        $response = $this->getJson("/api/v1/admin/exam-sessions/{$session->id}/status");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'session_id',
                    'status',
                    'started_at',
                    'expires_at',
                    'remaining_time',
                    'answered_questions',
                    'total_questions'
                ]
            ]);
    }

    public function test_unauthorized_user_cannot_access_other_user_session()
    {
        $otherUser = User::factory()->create();
        $session = ExamSession::factory()->create([
            'user_id' => $otherUser->id,
            'certification_id' => $this->certification->id,
            'status' => 'active'
        ]);

        $response = $this->getJson("/api/v1/admin/exam-sessions/{$session->id}/status");

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthorized access to exam session'
            ]);
    }

    public function test_complete_exam_workflow()
    {
        // 1. Generate exam
        $generateResponse = $this->getJson("/api/v1/admin/certifications/{$this->certification->id}/exam/generate");
        $generateResponse->assertStatus(200);

        // 2. Start exam session
        $startResponse = $this->postJson("/api/v1/admin/certifications/{$this->certification->id}/exam/start");
        $startResponse->assertStatus(200);
        
        $sessionId = $startResponse->json('data.session_id');
        $examData = $startResponse->json('data.exam_data');

        // 3. Save answers for each question
        $answers = [];
        foreach ($examData['questions'] as $question) {
            $questionId = $question['id'];
            $answerIds = [1]; // Save first answer for each question
            $answers[$questionId] = $answerIds;

            $saveResponse = $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/save-answer", [
                'question_id' => $questionId,
                'answer_ids' => $answerIds
            ]);
            $saveResponse->assertStatus(200);
        }

        // 4. Check session status
        $statusResponse = $this->getJson("/api/v1/admin/exam-sessions/{$sessionId}/status");
        $statusResponse->assertStatus(200)
            ->assertJsonPath('data.status', 'active')
            ->assertJsonPath('data.answered_questions', count($examData['questions']));

        // 5. Submit exam
        $submitResponse = $this->postJson("/api/v1/admin/exam-sessions/{$sessionId}/submit", [
            'answers' => $answers
        ]);
        $submitResponse->assertStatus(200)
            ->assertJsonPath('data.quiz_result.status', 'submitted');

        // 6. Verify final status
        $finalStatusResponse = $this->getJson("/api/v1/admin/exam-sessions/{$sessionId}/status");
        $finalStatusResponse->assertStatus(200)
            ->assertJsonPath('data.status', 'submitted');
    }

    public function test_exam_validation_with_invalid_request_data()
    {
        $session = ExamSession::factory()->create([
            'user_id' => $this->user->id,
            'certification_id' => $this->certification->id,
            'status' => 'active',
            'expires_at' => now()->addMinutes(30)
        ]);

        // Test invalid answer format
        $response = $this->postJson("/api/v1/admin/exam-sessions/{$session->id}/save-answer", [
            'question_id' => 'test-question-id',
            'answer_ids' => 'invalid' // Should be array
        ]);

        $response->assertStatus(422);

        // Test missing question_id
        $response = $this->postJson("/api/v1/admin/exam-sessions/{$session->id}/save-answer", [
            'answer_ids' => [1]
        ]);

        $response->assertStatus(422);
    }
}