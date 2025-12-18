<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\AttendanceResource;
use App\Models\Attendance;
use App\Models\FormationSession;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AttendanceService
{
    // Récupérer les présences d'une session pour une date
    public function getSessionAttendance(string $sessionId, string $date)
    {
        return AttendanceResource::collection(
            Attendance::with(['student', 'session.formation'])
                ->where('session_id', $sessionId)
                ->where('date', $date)
                ->get()
        );
    }

    // Enregistrer les présences d'une session pour une date
    public function recordAttendance(array $data)
    {
        try {
            Log::info('Starting recordAttendance', [
                'session_id' => $data['session_id'],
                'date' => $data['date'],
                'attendances_count' => count($data['attendances'])
            ]);

            DB::beginTransaction();

            $session = FormationSession::findOrFail($data['session_id']);
            Log::info('Session found', ['session' => $session->id]);

            $date = $data['date'];

            // Supprimer les anciennes présences pour cette session/date
            $deletedCount = Attendance::where('session_id', $session->id)
                ->where('date', $date)
                ->delete();
            Log::info('Deleted old attendances', ['count' => $deletedCount]);

            // Enregistrer les nouvelles présences
            $created = [];
            foreach ($data['attendances'] as $attendance) {
                try {
                    $newAttendance = Attendance::create([
                        'session_id' => $session->id,
                        'student_id' => $attendance['student_id'],
                        'date' => $date,
                        'status' => $attendance['status'],
                        'notes' => $attendance['notes'] ?? null,
                    ]);

                    Log::info('Created attendance', [
                        'student_id' => $attendance['student_id'],
                        'status' => $attendance['status']
                    ]);

                    $created[] = $newAttendance->id;
                } catch (\Exception $e) {
                    Log::error('Failed to create attendance', [
                        'student_id' => $attendance['student_id'],
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    throw $e;
                }
            }

            Log::info('All attendances created successfully', [
                'total_created' => count($created),
                'attendance_ids' => $created
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('recordAttendance failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);
            return false;
        }
    }

    // Consulter l'historique des présences d'un étudiant
    public function getStudentAttendance(string $studentId, string $sessionId)
    {
        return AttendanceResource::collection(
            Attendance::with(['student', 'session'])
                ->where('student_id', $studentId)
                ->where('session_id', $sessionId)
                ->orderBy('date', 'desc')
                ->get()
        );
    }

    // Mettre à jour une présence
    public function updateAttendance(string $id, array $data)
    {
        try {
            DB::beginTransaction();

            $attendance = Attendance::findOrFail($id);

            Log::info('Updating attendance', [
                'id' => $id,
                'old_status' => $attendance->status,
                'new_status' => $data['status'] ?? $attendance->status
            ]);

            $attendance->update([
                'status' => $data['status'] ?? $attendance->status,
                'notes' => $data['notes'] ?? $attendance->notes,
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('updateAttendance failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);
            return false;
        }
    }

    // Supprimer une présence
    public function deleteAttendance(string $id)
    {
        try {
            DB::beginTransaction();

            $attendance = Attendance::findOrFail($id);
            Log::info('Deleting attendance', ['id' => $id]);

            $attendance->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('deleteAttendance failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'id' => $id
            ]);
            return false;
        }
    }

    public function getTeacherAttendances(string $teacherId, array $filters = [])
    {
        $query = Attendance::with(['student', 'session.formation'])
            ->whereHas('session', function ($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            });

        // Appliquer les filtres si fournis
        if (isset($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }

        if (isset($filters['session_id'])) {
            $query->where('session_id', $filters['session_id']);
        }

        if (isset($filters['formation_id'])) {
            $query->whereHas('session.formation', function ($query) use ($filters) {
                $query->where('id', $filters['formation_id']);
            });
        }

        return AttendanceResource::collection(
            $query->orderBy('date', 'desc')
                ->get()
        );
    }
}
