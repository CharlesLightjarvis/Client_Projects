<?php

namespace App\Http\Controllers\v1;

use App\Http\Services\V1\CourseScheduleService;
use App\Models\CourseSchedule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CourseSchedulesController extends Controller
{

    protected $scheduleService;

    public function __construct(CourseScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }



    /**
     * Créer un nouvel horaire de cours avec plusieurs jours
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|exists:formation_sessions,id',
            'days_of_week' => 'required|array',
            'days_of_week.*' => 'integer|between:1,7',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:255',
            'recurrence' => 'required|in:weekly,biweekly,monthly',
            'teacher_id' => 'nullable|exists:users,id',
        ]);

        $schedule = $this->scheduleService->createSchedule($validated);

        return response()->json($schedule, 201);
    }

    public function getTeacherSchedules($teacherId)
    {
        return $this->scheduleService->getTeacherSchedules($teacherId);
    }

    public function getStudentSchedules($studentId)
    {
        return $this->scheduleService->getStudentSchedules($studentId);
    }

    public function getSessionSchedules($sessionId)
    {
        return $this->scheduleService->getSessionSchedules($sessionId);
    }

    public function getWeekSchedules(Carbon $weekStart, ?int $sessionId = null): array
    {
        return $this->scheduleService->getWeekSchedules($weekStart, $sessionId);
    }

    /**
     * Obtenir les horaires pour un intervalle de dates spécifique
     */
    public function getDateRangeSchedules(Request $request)
    {

        Log::info('Requête reçue pour date-range', [
            'all_params' => $request->all()
        ]);

        $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
            'formation_id' => 'nullable|exists:formations,id',
            'session_id' => 'nullable|exists:formation_sessions,id',
            'teacher_id' => 'nullable|exists:users,id',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        Log::info('Recherche d\'horaires', [
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'formation_id' => $request->formation_id,
            'session_id' => $request->session_id,
            'teacher_id' => $request->teacher_id
        ]);

        $schedules = $this->scheduleService->getSchedulesByDateRange(
            $startDate,
            $endDate,
            $request->formation_id,
            $request->session_id,
            $request->teacher_id
        );

        return response()->json($schedules);
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseSchedule $course_schedules)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseSchedule $course_schedules)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseSchedule $course_schedules)
    {
        //
    }
}
