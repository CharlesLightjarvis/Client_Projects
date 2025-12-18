<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\User;
use App\Models\ProgressTracking;
use App\Trait\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StudentController extends Controller
{
    use ApiResponse;

    public function getStatistics()
    {
        /** @var User $student */
        $student = Auth::user();
        $now = Carbon::now();

        // 1. Statistiques des formations
        $formationStats = [
            'total_formations' => $student->formations()->count(),
            'active_formations' => $student->formations()
                ->whereHas('sessions', function ($query) use ($now) {
                    $query->where('start_date', '<=', $now)
                        ->where('end_date', '>=', $now);
                })
                ->count(),
            'completed_formations' => $student->formations()
                ->whereHas('sessions', function ($query) use ($now) {
                    $query->where('end_date', '<', $now);
                })
                ->count(),
            'upcoming_formations' => $student->formations()
                ->whereHas('sessions', function ($query) use ($now) {
                    $query->where('start_date', '>', $now);
                })
                ->count(),
        ];

        // 2. Statistiques des sessions
        $sessionStats = [
            'total_sessions' => $student->enrolledSessions()->count(),
            'active_sessions' => $student->enrolledSessions()
                ->where('start_date', '<=', $now)
                ->where('end_date', '>=', $now)
                ->count(),
            'upcoming_sessions' => $student->enrolledSessions()
                ->where('start_date', '>', $now)
                ->count(),
            'completed_sessions' => $student->enrolledSessions()
                ->where('end_date', '<', $now)
                ->count(),
            'sessions_by_month' => DB::table('formation_sessions')
                ->join('session_student', 'formation_sessions.id', '=', 'session_student.session_id')
                ->where('session_student.student_id', $student->id)
                ->select(DB::raw('MONTH(start_date) as month'), DB::raw('COUNT(*) as count'))
                ->groupBy(DB::raw('MONTH(start_date)'))
                ->get(),
        ];

        // 3. Statistiques d'assiduité
        $attendanceStats = [
            'total_attendances' => $student->attendances()->count(),
            'present_count' => $student->attendances()->where('status', 'present')->count(),
            'absent_count' => $student->attendances()->where('status', 'absent')->count(),
            'late_count' => $student->attendances()->where('status', 'late')->count(),
            'excused_count' => $student->attendances()->where('status', 'excused')->count(),
            'attendance_rate' => $student->attendances()->count() > 0
                ? ($student->attendances()->where('status', 'present')->count() / $student->attendances()->count()) * 100
                : 0,
            'recent_attendance' => $student->attendances()
                ->with('session.formation')
                ->orderBy('date', 'desc')
                ->limit(5)
                ->get(),
        ];

        // 4. Statistiques des certifications
        $certificationStats = [
            'total_certifications' => $student->certifications()->count(),
            'completed_certifications' => ProgressTracking::where('user_id', $student->id)
                ->where('trackable_type', Certification::class)
                ->where('passed', true)
                ->count(),
            'passed_certifications' => ProgressTracking::where('user_id', $student->id)
                ->where('trackable_type', Certification::class)
                ->where('passed', true)
                ->count(),
            'certification_success_rate' => ProgressTracking::where('user_id', $student->id)
                ->where('trackable_type', Certification::class)
                ->count() > 0
                ? (ProgressTracking::where('user_id', $student->id)
                    ->where('trackable_type', Certification::class)
                    ->where('passed', true)
                    ->count() /
                    ProgressTracking::where('user_id', $student->id)
                    ->where('trackable_type', Certification::class)
                    ->count()) * 100
                : 0,
        ];

        // 5. Statistiques des quiz et évaluations
        $quizStats = [
            'total_quizzes' => ProgressTracking::where('user_id', $student->id)
                ->where('trackable_type', 'App\\Models\\Quiz')
                ->count(),
            'average_score' => ProgressTracking::where('user_id', $student->id)
                ->where('trackable_type', 'App\\Models\\Quiz')
                ->avg('score') ?? 0,
            'best_score' => ProgressTracking::where('user_id', $student->id)
                ->where('trackable_type', 'App\\Models\\Quiz')
                ->max('score') ?? 0,
            'recent_quizzes' => ProgressTracking::where('user_id', $student->id)
                ->where('trackable_type', 'App\\Models\\Quiz')
                ->with('trackable')
                ->orderBy('completed_at', 'desc')
                ->limit(5)
                ->get(),
        ];

        // 6. Statistiques des paiements
        $paymentStats = [
            'total_payments' => $student->payments()->count(),
            'total_amount' => $student->payments()->sum('amount'),
            'pending_payments' => $student->payments()->where('status', 'pending')->count(),
            'completed_payments' => $student->payments()->where('status', 'completed')->count(),
            'recent_payments' => $student->payments()
                ->with('formation')
                ->orderBy('payment_date', 'desc')
                ->limit(5)
                ->get(),
        ];

        return $this->successResponse('Student statistics retrieved successfully', 'statistics', [
            'formation_stats' => $formationStats,
            'session_stats' => $sessionStats,
            'attendance_stats' => $attendanceStats,
            'certification_stats' => $certificationStats,
            'quiz_stats' => $quizStats,
            'payment_stats' => $paymentStats,
        ]);
    }
}
