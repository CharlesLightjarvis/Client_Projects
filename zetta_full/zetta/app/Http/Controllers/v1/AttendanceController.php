<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Attendance\StoreAttendanceRequest;
use App\Http\Requests\v1\Attendance\UpdateAttendanceRequest;
use App\Http\Services\V1\AttendanceService;
use App\Trait\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    use ApiResponse;

    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    /**
     * Récupérer les présences d'une session pour une date donnée
     */
    public function getSessionAttendance(Request $request, string $sessionId)
    {
        // $request->validate([
        //     'date' => 'required|date|before_or_equal:today'
        // ]);
        $request->validate([
            'date' => 'required|date|before_or_equal:' . now()->addDay()->format('Y-m-d') // Ajoute un jour pour tenir compte du décalage
        ]);

        $attendances = $this->attendanceService->getSessionAttendance($sessionId, $request->date);
        return $this->successResponse(
            'Attendances retrieved successfully',
            'attendances',
            $attendances
        );
    }

    /**
     * Enregistrer les présences pour une session
     */
    public function recordAttendance(StoreAttendanceRequest $request)
    {
        $isRecorded = $this->attendanceService->recordAttendance($request->validated());

        if ($isRecorded) {
            return $this->successNoData('Attendances recorded successfully');
        }

        return $this->errorResponse('Failed to record attendances', 400);
    }

    /**
     * Récupérer l'historique des présences d'un étudiant pour une session
     */
    public function getStudentAttendance(string $sessionId, string $studentId)
    {
        $attendances = $this->attendanceService->getStudentAttendance($studentId, $sessionId);
        return $this->successResponse(
            'Student attendances retrieved successfully',
            'attendances',
            $attendances
        );
    }

    /**
     * Mettre à jour une présence
     */
    public function updateAttendance(UpdateAttendanceRequest $request, string $id)
    {
        $isUpdated = $this->attendanceService->updateAttendance($id, $request->validated());

        if ($isUpdated) {
            return $this->successNoData('Attendance updated successfully');
        }

        return $this->errorResponse('Failed to update attendance', 400);
    }

    /**
     * Supprimer une présence
     */
    public function deleteAttendance(string $id)
    {
        $isDeleted = $this->attendanceService->deleteAttendance($id);

        if ($isDeleted) {
            return $this->successNoData('Attendance deleted successfully');
        }

        return $this->errorResponse('Failed to delete attendance', 400);
    }

    public function getTeacherAttendances(Request $request)
    {
        // Récupérer l'ID du professeur connecté
        $teacherId = Auth::user()->id;
        
        // Récupérer les filtres de la requête
        $filters = $request->only([
            'date_from',
            'date_to',
            'status',
            'student_id',
            'session_id',
            'formation_id'
        ]);
        
        // Valider les filtres
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'status' => 'nullable|string|in:present,absent,late,excused',
            'student_id' => 'nullable|string|exists:users,id',
            'session_id' => 'nullable|string|exists:formation_sessions,id',
            'formation_id' => 'nullable|string|exists:formations,id'
        ]);
        
        $attendances = $this->attendanceService->getTeacherAttendances($teacherId, $filters);
        
        return $this->successResponse(
            'Teacher attendances retrieved successfully',
            'attendances',
            $attendances
        );
    }
}
