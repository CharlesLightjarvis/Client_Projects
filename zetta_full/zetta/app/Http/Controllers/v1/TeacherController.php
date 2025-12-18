<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Services\V1\TeacherService;
use App\Models\Formation;
use App\Models\User;
use App\Trait\ApiResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    use ApiResponse;

    protected $teacherService;

    public function __construct(TeacherService $teacherService)
    {
        $this->teacherService = $teacherService;
    }

    public function sessions()
    {
        $sessions = $this->teacherService->getTeacherSessions();
        return $this->successResponse('Sessions retrieved successfully', 'sessions', $sessions);
    }

    public function getStatistics()
    {
        /** @var User $teacher */
        $teacher = Auth::user();
        $now = Carbon::now();

        // 1. Statistiques des sessions
        $sessionStats = [
            'total_sessions' => $teacher->teachingSessions()->count(),
            'active_sessions' => $teacher->teachingSessions()
                ->where('start_date', '<=', $now)
                ->where('end_date', '>=', $now)
                ->count(),
            'upcoming_sessions' => $teacher->teachingSessions()
                ->where('start_date', '>', $now)
                ->count(),
            'completed_sessions' => $teacher->teachingSessions()
                ->where('end_date', '<', $now)
                ->count(),
            'sessions_by_month' => $teacher->teachingSessions()
                ->select(DB::raw('MONTH(start_date) as month'), DB::raw('COUNT(*) as count'))
                ->groupBy(DB::raw('MONTH(start_date)'))
                ->get(),
        ];

        // 2. Statistiques des étudiants
        $studentStats = [
            'total_students' => DB::table('session_student')
                ->whereIn('session_id', $teacher->teachingSessions()->pluck('id'))
                ->distinct('student_id')
                ->count('student_id'),
            'average_students_per_session' => $teacher->teachingSessions()->avg('enrolled_students') ?? 0,
            'new_students_this_month' => DB::table('session_student')
                ->whereIn('session_id', $teacher->teachingSessions()->pluck('id'))
                ->whereMonth('created_at', $now->month)
                ->distinct('student_id')
                ->count('student_id'),
        ];

        // 3. Statistiques d'assiduité
        $sessions = $teacher->teachingSessions()->pluck('id');
        $totalAttendances = DB::table('attendances')
            ->whereIn('session_id', $sessions)
            ->count();

        $presentAttendances = DB::table('attendances')
            ->whereIn('session_id', $sessions)
            ->where('status', 'present')
            ->count();

        $attendanceRate = $totalAttendances > 0 ? ($presentAttendances / $totalAttendances) * 100 : 0;

        $attendanceStats = [
            'attendance_rate' => $attendanceRate,
            'recent_absences' => DB::table('attendances')
                ->whereIn('session_id', $sessions)
                ->where('status', 'absent')
                ->where('date', '>=', $now->subDays(30))
                ->count(),
            'attendance_by_session' => DB::table('attendances')
                ->join('formation_sessions', 'attendances.session_id', '=', 'formation_sessions.id')
                ->join('formations', 'formation_sessions.formation_id', '=', 'formations.id')
                ->whereIn('attendances.session_id', $sessions)
                ->select(
                    'formation_sessions.id',
                    'formations.name', // Utiliser le nom de la formation à la place
                    DB::raw('COUNT(*) as total'),
                    DB::raw('SUM(CASE WHEN attendances.status = "present" THEN 1 ELSE 0 END) as present_count')
                )
                ->groupBy('formation_sessions.id', 'formations.name')
                ->get(),
        ];

        // 4. Statistiques des formations
        $formationStats = [
            'total_formations' => $teacher->teachingSessions()
                ->distinct('formation_id')
                ->count('formation_id'),
            'popular_formations' => Formation::select([
                'formations.id',
                'formations.name',
                DB::raw('COUNT(DISTINCT session_student.student_id) as students_count')
            ])
                ->join('formation_sessions', 'formations.id', '=', 'formation_sessions.formation_id')
                ->leftJoin('session_student', 'formation_sessions.id', '=', 'session_student.session_id')
                ->where('formation_sessions.teacher_id', $teacher->id)
                ->groupBy('formations.id', 'formations.name')
                ->orderByDesc('students_count')
                ->limit(5)
                ->get(),
        ];

        // 5. Statistiques des certifications
        $certificationStats = [
            'total_certifications' => DB::table('certifications')
                ->join('formation_certifications', 'certifications.id', '=', 'formation_certifications.certification_id')
                ->join('formations', 'formation_certifications.formation_id', '=', 'formations.id')
                ->join('formation_sessions', 'formations.id', '=', 'formation_sessions.formation_id')
                ->where('formation_sessions.teacher_id', $teacher->id)
                ->distinct('certifications.id')
                ->count('certifications.id'),
            'certification_success_rate' => DB::table('progress_tracking')
                ->join('certifications', 'progress_tracking.trackable_id', '=', 'certifications.id')
                ->where('progress_tracking.trackable_type', 'App\\Models\\Certification')
                ->join('formation_certifications', 'certifications.id', '=', 'formation_certifications.certification_id')
                ->join('formations', 'formation_certifications.formation_id', '=', 'formations.id')
                ->join('formation_sessions', 'formations.id', '=', 'formation_sessions.formation_id')
                ->where('formation_sessions.teacher_id', $teacher->id)
                ->select(
                    DB::raw('COUNT(*) as total'),
                    DB::raw('SUM(CASE WHEN progress_tracking.passed = 1 THEN 1 ELSE 0 END) as passed')
                )
                ->first(),
        ];

        // 6. Top étudiants
        $topStudents = User::select([
            'users.id',
            'users.fullName',
            DB::raw('AVG(progress_tracking.score) as average_score'),
            DB::raw('COUNT(DISTINCT attendances.id) as attendance_count')
        ])
            ->join('session_student', 'users.id', '=', 'session_student.student_id')
            ->join('formation_sessions', 'session_student.session_id', '=', 'formation_sessions.id')
            ->leftJoin('attendances', function ($join) {
                $join->on('users.id', '=', 'attendances.student_id')
                    ->on('formation_sessions.id', '=', 'attendances.session_id');
            })
            ->leftJoin('progress_tracking', 'users.id', '=', 'progress_tracking.user_id')
            ->where('formation_sessions.teacher_id', $teacher->id)
            ->groupBy('users.id', 'users.fullName')
            ->orderByDesc('average_score')
            ->limit(5)
            ->get();

        // 7. Statistiques de croissance
        $lastMonth = Carbon::now()->subMonth();
        $sessionsLastMonth = $teacher->teachingSessions()
            ->whereMonth('start_date', $lastMonth->month)
            ->count();
        $sessionsThisMonth = $teacher->teachingSessions()
            ->whereMonth('start_date', $now->month)
            ->count();

        $studentsLastMonth = DB::table('session_student')
            ->whereIn('session_id', $teacher->teachingSessions()->pluck('id'))
            ->whereMonth('created_at', $lastMonth->month)
            ->distinct('student_id')
            ->count('student_id');
        $studentsThisMonth = DB::table('session_student')
            ->whereIn('session_id', $teacher->teachingSessions()->pluck('id'))
            ->whereMonth('created_at', $now->month)
            ->distinct('student_id')
            ->count('student_id');

        $growthStats = [
            'session_growth' => $this->calculateGrowthRate($sessionsLastMonth, $sessionsThisMonth),
            'student_growth' => $this->calculateGrowthRate($studentsLastMonth, $studentsThisMonth),
        ];

        return $this->successResponse('Teacher statistics retrieved successfully', 'statistics', [
            'session_stats' => $sessionStats,
            'student_stats' => $studentStats,
            'attendance_stats' => $attendanceStats,
            'formation_stats' => $formationStats,
            'certification_stats' => $certificationStats,
            'top_students' => $topStudents,
            'growth_stats' => $growthStats,
        ]);
    }


    private function calculateGrowthRate($previous, $current)
    {
        if ($previous == 0) return $current > 0 ? 100 : 0;
        return (($current - $previous) / $previous) * 100;
    }
}
