<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Formation;
use App\Models\FormationSession;
use App\Models\Payment;
use App\Models\Certification;
use App\Models\Question;
use App\Models\QuizConfiguration;
use App\Enums\RoleEnum;
use App\Enums\UserStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\LevelEnum;
use App\Trait\ApiResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    use ApiResponse;

    public function getStatistics()
    {
        $now = Carbon::now();

        // 1. Statistiques des utilisateurs étendues
        $userStats = [
            'total_users' => User::count(),
            'total_students' => User::role(RoleEnum::STUDENT->value)->count(),
            'total_teachers' => User::role(RoleEnum::TEACHER->value)->count(),
            'new_students_this_month' => User::role(RoleEnum::STUDENT->value)
                ->whereMonth('created_at', $now->month)
                ->count(),
            'new_teachers_this_month' => User::role(RoleEnum::TEACHER->value)
                ->whereMonth('created_at', $now->month)
                ->count(),
            'active_users' => User::where('status', UserStatusEnum::ACTIVE->value)->count(),
            'inactive_users' => User::where('status', UserStatusEnum::INACTIVE->value)->count(),
            'users_with_2fa' => User::whereNotNull('two_factor_confirmed_at')->count(),
            'verified_users' => User::whereNotNull('email_verified_at')->count(),
        ];

        // 2. Statistiques des formations étendues
        $formationStats = [
            'total_formations' => Formation::count(),
            'active_sessions' => FormationSession::where('start_date', '<=', $now)
                ->where('end_date', '>=', $now)
                ->count(),
            'upcoming_sessions' => FormationSession::where('start_date', '>', $now)->count(),
            'completed_sessions' => FormationSession::where('end_date', '<', $now)->count(),
            'average_students_per_session' => FormationSession::avg('enrolled_students') ?? 0,
            'formations_by_level' => Formation::select('level', DB::raw('count(*) as count'))
                ->groupBy('level')
                ->get(),
            'most_popular_categories' => DB::table('categories')
                ->join('formations', 'categories.id', '=', 'formations.category_id')
                ->select('categories.name', DB::raw('count(*) as formation_count'))
                ->groupBy('categories.id', 'categories.name')
                ->orderByDesc('formation_count')
                ->limit(5)
                ->get(),
        ];

        // 3. Statistiques financières étendues
        $financialStats = [
            'total_revenue' => Payment::where('status', PaymentStatusEnum::COMPLETED)->sum('amount'),
            'revenue_this_month' => Payment::where('status', PaymentStatusEnum::COMPLETED)
                ->whereMonth('payment_date', $now->month)
                ->sum('amount'),
            'revenue_last_month' => Payment::where('status', PaymentStatusEnum::COMPLETED)
                ->whereMonth('payment_date', $now->subMonth()->month)
                ->sum('amount'),
            'partial_payments' => Payment::where('status', PaymentStatusEnum::PARTIAL)->count(),
            'average_payment' => Payment::where('status', PaymentStatusEnum::COMPLETED)->avg('amount') ?? 0,
            'revenue_by_month' => Payment::where('status', PaymentStatusEnum::COMPLETED)
                ->select(DB::raw('MONTH(payment_date) as month'), DB::raw('SUM(amount) as total'))
                ->groupBy(DB::raw('MONTH(payment_date)'))
                ->get(),
        ];

        // 4. Statistiques des certifications étendues
        $certificationStats = [
            'total_certifications' => Certification::count(),
            'certifications_by_level' => Certification::select('level', DB::raw('count(*) as count'))
                ->groupBy('level')
                ->get(),
            'certifications_by_provider' => Certification::select('provider', DB::raw('count(*) as count'))
                ->groupBy('provider')
                ->get(),
            'average_validity_period' => Certification::avg('validity_period'),
        ];

        // 5. Statistiques des quiz
        $quizStats = [
            'total_questions' => Question::count(),
            'questions_by_difficulty' => Question::select('difficulty', DB::raw('count(*) as count'))
                ->groupBy('difficulty')
                ->get(),
            'average_quiz_duration' => QuizConfiguration::avg('time_limit'),
            'average_passing_score' => QuizConfiguration::avg('passing_score'),
        ];

        // 6. Statistiques d'engagement
        // 6. Statistiques d'engagement
        $engagementStats = [
            'most_active_days' => FormationSession::select(DB::raw('DAYNAME(start_date) as day'), DB::raw('COUNT(*) as count'))
                ->groupBy(DB::raw('DAYNAME(start_date)'))
                ->orderByDesc('count')
                ->get(),
            'peak_hours' => FormationSession::select(DB::raw('HOUR(start_date) as hour'), DB::raw('COUNT(*) as count'))
                ->groupBy(DB::raw('HOUR(start_date)'))
                ->orderByDesc('count')
                ->get(),
        ];

        // 7. Top Performances
        // 7. Top Performances
        // 7. Top Performances
        $topPerformers = [
            'top_formations' => Formation::select([
                'formations.id',
                'formations.name',
                DB::raw('COUNT(DISTINCT formation_student.student_id) as students_count'),
                DB::raw('COUNT(DISTINCT formation_sessions.id) as sessions_count')
            ])
                ->leftJoin('formation_sessions', 'formations.id', '=', 'formation_sessions.formation_id')
                ->leftJoin('formation_student', 'formations.id', '=', 'formation_student.formation_id')
                ->groupBy('formations.id', 'formations.name')
                ->orderByDesc('sessions_count')
                ->limit(5)
                ->get(),

            'top_teachers' => User::role(RoleEnum::TEACHER->value)
                ->withCount('teachingSessions')
                ->orderBy('teaching_sessions_count', 'desc')
                ->limit(5)
                ->get(['id', 'fullName', 'teaching_sessions_count']),

            'most_certified_students' => User::role(RoleEnum::STUDENT->value)
                ->select([
                    'users.id',
                    'users.fullName',
                    DB::raw('COUNT(DISTINCT progress_tracking.id) as certifications_count')
                ])
                ->leftJoin('progress_tracking', 'users.id', '=', 'progress_tracking.user_id')
                ->where('progress_tracking.passed', true)
                ->groupBy('users.id', 'users.fullName')
                ->orderBy('certifications_count', 'desc')
                ->limit(5)
                ->get(),
        ];
        // 8. Statistiques de croissance
        $growthStats = [
            'user_growth' => $this->calculateGrowthRate(
                User::whereMonth('created_at', $now->subMonth()->month)->count(),
                User::whereMonth('created_at', $now->month)->count()
            ),
            'revenue_growth' => $this->calculateGrowthRate(
                $financialStats['revenue_last_month'],
                $financialStats['revenue_this_month']
            ),
            'formation_growth' => $this->calculateGrowthRate(
                Formation::whereMonth('created_at', $now->subMonth()->month)->count(),
                Formation::whereMonth('created_at', $now->month)->count()
            ),
        ];

        return $this->successResponse('Dashboard statistics retrieved successfully', 'statistics', [
            'user_stats' => $userStats,
            'formation_stats' => $formationStats,
            'financial_stats' => $financialStats,
            'certification_stats' => $certificationStats,
            'quiz_stats' => $quizStats,
            'engagement_stats' => $engagementStats,
            'top_performers' => $topPerformers,
            'growth_stats' => $growthStats,
        ]);
    }

    private function calculateGrowthRate($previous, $current)
    {
        if ($previous == 0) return $current > 0 ? 100 : 0;
        return (($current - $previous) / $previous) * 100;
    }
}
