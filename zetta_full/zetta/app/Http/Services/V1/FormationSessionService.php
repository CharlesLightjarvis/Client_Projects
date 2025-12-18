<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\FormationSessionResource;
use App\Http\Resources\v1\UserResource;
use App\Models\Formation;
use App\Models\FormationSession;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FormationSessionService
{
    // public function getAllSessions()
    // {
    //     return FormationSessionResource::collection(FormationSession::with('formation', 'teacher')->get());
    // }

    public function getAllSessions()
    {
        return FormationSessionResource::collection(
            FormationSession::with('formation', 'teacher', 'students')->get()
        );
    }

    // public function getSessionById($id)
    // {
    //     return new FormationSessionResource(FormationSession::with('formation', 'teacher')->findOrFail($id));
    // }

    public function getSessionById($id)
    {
        return new FormationSessionResource(
            FormationSession::with('formation', 'teacher', 'students')->findOrFail($id)
        );
    }

    public function createSession($data)
    {
        try {
            DB::beginTransaction();

            // Vérifier si la formation existe
            $formation = Formation::find($data['formation_id']);
            if (!$formation) {
                return false;
            }

            // Vérifier si l'enseignant existe (si fourni)
            if (isset($data['teacher_id'])) {
                $teacher = User::find($data['teacher_id']);
                if (!$teacher || !$teacher->hasRole('teacher')) {
                    return false;
                }
            }

            FormationSession::create($data);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            return false;
        }
    }

    public function updateSession($id, $data)
    {
        try {
            DB::beginTransaction();

            $session = FormationSession::find($id);
            if (!$session) {
                return false;
            }

            // Vérifier la formation si l'ID est modifié
            if (isset($data['formation_id'])) {
                $formation = Formation::find($data['formation_id']);
                if (!$formation) {
                    return false;
                }
            }

            // Vérifier l'enseignant si l'ID est modifié
            if (isset($data['teacher_id'])) {
                $teacher = User::find($data['teacher_id']);
                if (!$teacher || !$teacher->hasRole('teacher')) {
                    return false;
                }
            }

            // Mettre à jour la session
            $session->update($data);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            return false;
        }
    }

    // public function deleteSession($id)
    // {
    //     $session = FormationSession::find($id);
    //     return $session ? $session->delete() : false;
    // }

    public function deleteSession($id)
    {
        try {
            $session = FormationSession::find($id);
            if (!$session) {
                return false;
            }

            // Supprimer toutes les inscriptions d'étudiants
            $session->students()->detach();

            return $session->delete();
        } catch (\Exception $e) {
            Log::error('Failed to delete session', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function enrollStudent($studentId, $sessionId)
    {
        try {
            DB::beginTransaction();

            // 1. D'abord trouver la session
            $session = FormationSession::find($sessionId);
            if (!$session) {
                throw new \Exception('Session not found');
            }

            // 2. Trouver l'étudiant
            $student = User::find($studentId);
            if (!$student) {
                throw new \Exception('Student not found');
            }

            // 3. Vérifier si l'étudiant a le rôle approprié
            if (!$student->hasRole('student')) {
                throw new \Exception('User must be a student to enroll');
            }

            // 4. Vérifier s'il y a des places disponibles
            if ($session->enrolled_students >= $session->capacity) {
                throw new \Exception('Session is full');
            }

            // 5. Vérifier si l'étudiant n'est pas déjà inscrit
            if ($session->students()->where('users.id', $studentId)->exists()) {
                throw new \Exception('Student already enrolled');
            }

            // 6. Récupérer la formation associée à la session
            $formation = $session->formation;
            if (!$formation) {
                throw new \Exception('Formation not found for this session');
            }

            // 7. Inscrire l'étudiant à la formation s'il n'est pas déjà inscrit
            if (!$formation->students()->where('users.id', $studentId)->exists()) {
                $formation->students()->attach($studentId);
            }

            // 8. Inscrire l'étudiant à la session
            $session->students()->attach($studentId);
            $session->increment('enrolled_students');

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to enroll student', [
                'student_id' => $studentId,
                'session_id' => $sessionId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    public function unenrollStudent($studentId, $sessionId)
    {
        try {
            DB::beginTransaction();

            // 1. Trouver la session
            $session = FormationSession::find($sessionId);
            if (!$session) {
                throw new \Exception('Session not found');
            }

            // 2. Vérifier si l'étudiant est inscrit à cette session
            if (!$session->students()->where('users.id', $studentId)->exists()) {
                throw new \Exception('Student not enrolled in this session');
            }

            // 3. Désinscrire l'étudiant de la session
            $session->students()->detach($studentId);
            $session->decrement('enrolled_students');

            // 4. Récupérer la formation associée
            $formation = $session->formation;
            if (!$formation) {
                throw new \Exception('Formation not found for this session');
            }

            // 5. Vérifier si l'étudiant est inscrit à d'autres sessions de cette formation
            $otherSessionsCount = $formation->sessions()
                ->whereHas('students', function ($query) use ($studentId) {
                    $query->where('users.id', $studentId);
                })
                ->count();

            // 6. Si l'étudiant n'est inscrit à aucune autre session, le désinscrire de la formation
            if ($otherSessionsCount === 0) {
                $formation->students()->detach($studentId);
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to unenroll student', [
                'student_id' => $studentId,
                'session_id' => $sessionId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    public function getAvailableSessions($formationId)
    {
        return FormationSession::where('formation_id', $formationId)
            ->where('start_date', '>=', now()->startOfDay())
            ->whereRaw('enrolled_students < capacity')
            ->orderBy('start_date')
            ->get(); // Changé first() en get() pour retourner une collection
    }

    public function getSessionStudents($sessionId)
    {
        $session = FormationSession::findOrFail($sessionId);
        return UserResource::collection(
            $session->students()->get()
        );
    }

    // public function checkAvailability($sessionId)
    // {
    //     $session = FormationSession::find($sessionId);
    //     return $session ? $session->hasAvailableSpots() : false;
    // }
}
