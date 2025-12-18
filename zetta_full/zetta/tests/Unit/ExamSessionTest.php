<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\ExamSession;
use App\Models\User;
use App\Models\Certification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class ExamSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_exam_session_belongs_to_user()
    {
        $user = User::factory()->create();
        $session = ExamSession::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $session->user);
        $this->assertEquals($user->id, $session->user->id);
    }

    public function test_exam_session_belongs_to_certification()
    {
        $certification = Certification::factory()->create();
        $session = ExamSession::factory()->create(['certification_id' => $certification->id]);

        $this->assertInstanceOf(Certification::class, $session->certification);
        $this->assertEquals($certification->id, $session->certification->id);
    }

    public function test_is_expired_returns_true_when_expires_at_is_past()
    {
        $session = ExamSession::factory()->create([
            'expires_at' => Carbon::now()->subMinutes(10)
        ]);

        $this->assertTrue($session->isExpired());
    }

    public function test_is_expired_returns_false_when_expires_at_is_future()
    {
        $session = ExamSession::factory()->create([
            'expires_at' => Carbon::now()->addMinutes(10)
        ]);

        $this->assertFalse($session->isExpired());
    }

    public function test_is_active_returns_true_when_status_active_and_not_expired()
    {
        $session = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->addMinutes(10)
        ]);

        $this->assertTrue($session->isActive());
    }

    public function test_is_active_returns_false_when_status_not_active()
    {
        $session = ExamSession::factory()->create([
            'status' => 'submitted',
            'expires_at' => Carbon::now()->addMinutes(10)
        ]);

        $this->assertFalse($session->isActive());
    }

    public function test_is_active_returns_false_when_expired()
    {
        $session = ExamSession::factory()->create([
            'status' => 'active',
            'expires_at' => Carbon::now()->subMinutes(10)
        ]);

        $this->assertFalse($session->isActive());
    }

    public function test_remaining_time_returns_zero_when_expired()
    {
        $session = ExamSession::factory()->create([
            'expires_at' => Carbon::now()->subMinutes(10)
        ]);

        $this->assertEquals(0, $session->remaining_time);
    }

    public function test_remaining_time_returns_correct_seconds_when_not_expired()
    {
        $expiresAt = Carbon::now()->addMinutes(5);
        $session = ExamSession::factory()->create([
            'expires_at' => $expiresAt
        ]);

        $expectedSeconds = now()->diffInSeconds($expiresAt);
        $this->assertEqualsWithDelta($expectedSeconds, $session->remaining_time, 2);
    }

    public function test_total_questions_attribute_returns_correct_count()
    {
        $examData = [
            'questions' => [
                ['id' => '1', 'question' => 'Q1'],
                ['id' => '2', 'question' => 'Q2'],
                ['id' => '3', 'question' => 'Q3'],
            ]
        ];

        $session = ExamSession::factory()->create(['exam_data' => $examData]);

        $this->assertEquals(3, $session->total_questions);
    }

    public function test_total_questions_attribute_returns_zero_when_no_questions()
    {
        $session = ExamSession::factory()->create(['exam_data' => []]);

        $this->assertEquals(0, $session->total_questions);
    }

    public function test_answered_questions_attribute_returns_correct_count()
    {
        $answers = [
            'question1' => [1, 2],
            'question2' => [3],
            'question3' => [1]
        ];

        $session = ExamSession::factory()->create(['answers' => $answers]);

        $this->assertEquals(3, $session->answered_questions);
    }

    public function test_answered_questions_attribute_returns_zero_when_no_answers()
    {
        $session = ExamSession::factory()->create(['answers' => null]);

        $this->assertEquals(0, $session->answered_questions);
    }

    public function test_exam_data_is_cast_to_array()
    {
        $examData = ['questions' => [], 'time_limit' => 60];
        $session = ExamSession::factory()->create(['exam_data' => $examData]);

        $this->assertIsArray($session->exam_data);
        $this->assertEquals($examData, $session->exam_data);
    }

    public function test_answers_is_cast_to_array()
    {
        $answers = ['question1' => [1, 2]];
        $session = ExamSession::factory()->create(['answers' => $answers]);

        $this->assertIsArray($session->answers);
        $this->assertEquals($answers, $session->answers);
    }

    public function test_datetime_fields_are_cast_to_carbon_instances()
    {
        $session = ExamSession::factory()->create();

        $this->assertInstanceOf(Carbon::class, $session->started_at);
        $this->assertInstanceOf(Carbon::class, $session->expires_at);
    }
}