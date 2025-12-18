<?php

namespace App\Http\Services\V1;

use App\Models\CourseSchedule;
use App\Models\CourseScheduleDay;
use App\Models\FormationSession;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CourseScheduleService
{
    /**
     * Créer un nouvel horaire de cours avec plusieurs jours
     */
    public function createSchedule(array $data): CourseSchedule
{
    // Extraire les jours du tableau de données
    $days = $data['days_of_week'] ?? [];
    unset($data['days_of_week']);
    
    // Récupérer la session et ses dates
    $session = FormationSession::findOrFail($data['session_id']);
    
    // Utiliser les dates de la session pour l'horaire
    $data['start_date'] = $session->start_date;
    $data['end_date'] = $session->end_date;
    
    // Utiliser une transaction pour garantir l'intégrité des données
    return DB::transaction(function () use ($data, $days) {
        // Créer l'horaire principal
        $schedule = CourseSchedule::create($data);
        
        // Ajouter les jours
        foreach ($days as $day) {
            CourseScheduleDay::create([
                'course_schedule_id' => $schedule->id,
                'day_of_week' => $day
            ]);
        }
        
        // Charger la relation days pour le retour
        return $schedule->load('days');
    });
}
    
    /**
     * Obtenir les horaires d'une session avec les jours
     */
    public function getSessionSchedules(int $sessionId): Collection
    {
        return CourseSchedule::where('session_id', $sessionId)
            ->with('days')
            ->get();
    }
    
    /**
     * Obtenir les horaires d'un étudiant avec les jours
     */
    public function getStudentSchedules(int $studentId): Collection
    {
        // Récupérer les sessions auxquelles l'étudiant est inscrit
        $user = User::findOrFail($studentId);
        $sessionIds = $user->enrolledSessions->pluck('id');
        
        return CourseSchedule::whereIn('session_id', $sessionIds)
            ->with(['days', 'session.formation', 'teacher'])
            ->get();
    }
    
    /**
     * Obtenir les horaires d'un professeur avec les jours
     */
    public function getTeacherSchedules(int $teacherId): Collection
    {
        return CourseSchedule::where('teacher_id', $teacherId)
            ->with(['days', 'session.formation'])
            ->get();
    }
    
    /**
     * Obtenir les horaires pour une semaine spécifique
     */
    public function getWeekSchedules(Carbon $weekStart, ?int $sessionId = null): array
    {
        $query = CourseSchedule::query()->with(['days', 'session.formation', 'teacher']);
        
        if ($sessionId) {
            $query->where('session_id', $sessionId);
        }
        
        $schedules = $query->get();
        
        // Organiser les horaires par jour
        $weekSchedule = [];
        for ($day = 1; $day <= 7; $day++) {
            $date = $weekStart->copy()->addDays($day - 1);
            
            // Filtrer les horaires qui ont ce jour dans leur liste de jours
            $daySchedules = $schedules->filter(function ($schedule) use ($day) {
                // Vérifier uniquement si l'horaire inclut ce jour de la semaine
                return $schedule->days->contains('day_of_week', $day);
            });
            
            $weekSchedule[$day] = [
                'date' => $date->format('Y-m-d'),
                'day_name' => (new CourseScheduleDay(['day_of_week' => $day]))->getDayNameAttribute(),
                'schedules' => $daySchedules
            ];
        }
        
        return $weekSchedule;
    }

    public function getSchedulesByDateRange(Carbon $startDate, Carbon $endDate, ?string $formationId = null, ?string $sessionId = null, ?string $teacherId = null): array
{
    $query = CourseSchedule::query()->with(['days', 'session.formation', 'teacher']);
    
    // Filtrer par session si spécifié
    if ($sessionId) {
        $query->where('session_id', $sessionId);
    }
    
    // Filtrer par formation si spécifié
    if ($formationId) {
        $query->whereHas('session', function ($q) use ($formationId) {
            $q->where('formation_id', $formationId);
        });
    }
    
    // Filtrer par professeur si spécifié
    if ($teacherId) {
        $query->where('teacher_id', $teacherId);
    }
    
    // Récupérer tous les horaires qui pourraient être pertinents
    // Nous allons chercher les horaires qui chevauchent la période demandée
    $query->where(function($q) use ($startDate, $endDate) {
        // Horaires sans date de fin ou avec date de fin après la date de début demandée
        $q->whereNull('end_date')
          ->orWhere('end_date', '>=', $startDate->format('Y-m-d'));
    })
    ->where('start_date', '<=', $endDate->format('Y-m-d'));
    
    $schedules = $query->get();
    
    // Organiser les horaires par jour
    $result = [];
    
    // Pour chaque jour dans l'intervalle
    $currentDate = $startDate->copy();
    while ($currentDate->lte($endDate)) {
        $dayOfWeek = $currentDate->dayOfWeek ?: 7; // Convertir 0 (dimanche) en 7
        $formattedDate = $currentDate->format('Y-m-d');
        
        // Pour chaque horaire, vérifier s'il s'applique à ce jour
        $daySchedules = [];
        
        foreach ($schedules as $schedule) {
            // Vérifier si l'horaire inclut ce jour de la semaine
            $hasDayOfWeek = $schedule->days->contains('day_of_week', $dayOfWeek);
            
            if (!$hasDayOfWeek) {
                continue; // Passer au prochain horaire si ce jour n'est pas inclus
            }
            
            // Vérifier si la date actuelle est dans la plage de l'horaire
            $scheduleStartDate = Carbon::parse($schedule->start_date);
            $scheduleEndDate = $schedule->end_date ? Carbon::parse($schedule->end_date) : null;
            
            // Si la date actuelle est avant la date de début de l'horaire, passer
            if ($currentDate->lt($scheduleStartDate)) {
                continue;
            }
            
            // Si l'horaire a une date de fin et la date actuelle est après, passer
            if ($scheduleEndDate && $currentDate->gt($scheduleEndDate)) {
                continue;
            }
            
            // Vérifier la récurrence
            if ($schedule->recurrence === 'biweekly') {
                // Pour bi-hebdomadaire, vérifier si c'est une semaine paire depuis la date de début
                $weeksDiff = $scheduleStartDate->diffInWeeks($currentDate);
                if ($weeksDiff % 2 !== 0) {
                    continue;
                }
            } else if ($schedule->recurrence === 'monthly') {
                // Pour mensuel, vérifier si c'est le même jour du mois
                if ($scheduleStartDate->day !== $currentDate->day) {
                    continue;
                }
            }
            // Pour hebdomadaire (weekly), pas besoin de vérification supplémentaire
            
            // Si on arrive ici, l'horaire s'applique à ce jour
            // Créer une copie de l'horaire avec la date spécifique
            $scheduleForDay = $schedule->toArray();
            $scheduleForDay['specific_date'] = $formattedDate;
            $daySchedules[] = $scheduleForDay;
        }
        
        // Si nous avons des horaires pour ce jour, les ajouter au résultat
        if (!empty($daySchedules)) {
            if (!isset($result[$formattedDate])) {
                $result[$formattedDate] = [
                    'date' => $formattedDate,
                    'day_of_week' => $dayOfWeek,
                    'day_name' => (new CourseScheduleDay(['day_of_week' => $dayOfWeek]))->getDayNameAttribute(),
                    'schedules' => []
                ];
            }
            
            $result[$formattedDate]['schedules'] = array_merge(
                $result[$formattedDate]['schedules'], 
                $daySchedules
            );
        }
        
        // Passer au jour suivant
        $currentDate->addDay();
    }
    
    return $result;
}
}
