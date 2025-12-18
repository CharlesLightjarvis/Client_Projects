<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\FormationResource;
use App\Http\Resources\v1\UserResource;
use App\Models\Category;
use App\Models\Certification;
use App\Models\Formation;
use App\Models\Module;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class FormationService
{
    public function getAllFormations()
    {
        return FormationResource::collection(Formation::with('certifications', 'modules.lessons', 'sessions.teacher')->get());
    }

    public function getFormationById($id)
    {
        return new FormationResource(Formation::with('certifications', 'modules.lessons', 'sessions.teacher')->findOrFail($id));
    }

    public function getFormationBySlug($slug)
    {
        return new FormationResource(Formation::with('certifications', 'modules.lessons', 'sessions.teacher')->where('slug', $slug)->firstOrFail());
    }

    public function createFormation($data)
    {
        try {
            DB::beginTransaction();

            // Gestion de l'image
            if (isset($data['image']) && $data['image']->isValid()) {
                $imagePath = $data['image']->store('formations', 'public');
                $data['image'] = $imagePath;
            }

            $slug = Str::slug($data['name']);
            $formation = Formation::where('slug', $slug)->exists();
            if ($formation) {
                return false;
            }
            $data['slug'] = $slug;

            $category = Category::find($data['category_id']);
            if (!$category) {
                return false;
            }

            // Traiter les prerequisites et objectives
            $data['prerequisites'] = isset($data['prerequisites']) ? array_filter($data['prerequisites']) : null;
            $data['objectives'] = isset($data['objectives']) ? array_filter($data['objectives']) : null;

            $formation = Formation::create($data);

            // Attacher les modules si fournis
            if (isset($data['module_ids']) && is_array($data['module_ids'])) {
                $modules = Module::whereIn('id', $data['module_ids'])->get();
                if ($modules->count() > 0) {
                    $formation->modules()->attach($modules);
                }
            }

            // Attacher les certifications si fournis
            if (isset($data['certification_ids']) && is_array($data['certification_ids'])) {
                $certifications = Certification::whereIn('id', $data['certification_ids'])->get();
                if ($certifications->count() > 0) {
                    $formation->certifications()->attach($certifications);
                }
            }

            // Créer les sessions si fournies
            if (isset($data['sessions']) && is_array($data['sessions'])) {
                foreach ($data['sessions'] as $sessionData) {
                    $sessionData['formation_id'] = $formation->id;
                    $formation->sessions()->create($sessionData);
                }
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            return false;
        }
    }

    public function updateFormation($id, $data)
    {
        try {
            Log::info('--- [updateFormation] Début ---');
            Log::info('ID reçu : ' . $id);
            Log::info('Données reçues : ' . json_encode($data));
            DB::beginTransaction();

            // Récupérer la formation par ID
            $formation = Formation::findOrFail($id);
            if (!$formation) {
                return false;
            }

            // Gestion de l'image
            if (isset($data['image']) && $data['image']->isValid()) {
                // Supprimer l'ancienne image si elle existe
                if ($formation->image) {
                    Storage::disk('public')->delete($formation->image);
                }
                $imagePath = $data['image']->store('formations', 'public');
                $data['image'] = $imagePath;
            }

            // Gestion du slug uniquement si le nom a changé
            if (isset($data['name']) && $data['name'] !== $formation->name) {
                $slug = Str::slug($data['name']);
                $existingFormation = Formation::where('slug', $slug)
                    ->where('id', '!=', $formation->id)
                    ->exists();
                if ($existingFormation) {
                    return false;
                }
                $data['slug'] = $slug;
            }

            // Filtrer les tableaux vides
            if (isset($data['prerequisites'])) {
                $data['prerequisites'] = array_filter($data['prerequisites'], fn($value) => $value !== '');
                if (empty($data['prerequisites'])) {
                    $data['prerequisites'] = null;
                }
            }

            if (isset($data['objectives'])) {
                $data['objectives'] = array_filter($data['objectives'], fn($value) => $value !== '');
                if (empty($data['objectives'])) {
                    $data['objectives'] = null;
                }
            }

            // Mise à jour des données de base
            $formation->update($data);

            // Synchronisation des relations many-to-many
            // TOUJOURS synchroniser les modules, même si le tableau est vide
            if (array_key_exists('module_ids', $data)) {
                $moduleIds = [];
                if (is_array($data['module_ids'])) {
                    $moduleIds = array_filter($data['module_ids'], fn($value) => $value !== '' && $value !== null);
                } else if (is_string($data['module_ids']) && $data['module_ids'] !== '') {
                    // Si c'est un JSON string, le décoder
                    $decoded = json_decode($data['module_ids'], true);
                    if (is_array($decoded)) {
                        $moduleIds = array_filter($decoded, fn($value) => $value !== '' && $value !== null);
                    }
                }
                $formation->modules()->sync($moduleIds);
                Log::info('Modules synchronisés : ' . json_encode($moduleIds));
            }

            // TOUJOURS synchroniser les certifications, même si le tableau est vide
            if (array_key_exists('certification_ids', $data)) {
                $certificationIds = [];
                if (is_array($data['certification_ids'])) {
                    $certificationIds = array_filter($data['certification_ids'], fn($value) => $value !== '' && $value !== null);
                } else if (is_string($data['certification_ids']) && $data['certification_ids'] !== '') {
                    // Si c'est un JSON string, le décoder
                    $decoded = json_decode($data['certification_ids'], true);
                    if (is_array($decoded)) {
                        $certificationIds = array_filter($decoded, fn($value) => $value !== '' && $value !== null);
                    }
                }
                $formation->certifications()->sync($certificationIds);
                Log::info('Certifications synchronisées : ' . json_encode($certificationIds));
            }

            // Gestion des sessions
            if (isset($data['sessions'])) {
                // Supprimer les anciennes sessions
                $formation->sessions()->delete();

                // Créer les nouvelles sessions
                foreach ($data['sessions'] as $sessionData) {
                    $formation->sessions()->create($sessionData);
                }
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            Log::error('Erreur updateFormation : ' . $e->getMessage());
            return false;
        }
    }

    public function deleteFormation($id)
    {
        $formation = Formation::find($id);
        if (!$formation) return false;

        // Détacher les certifications liées (many-to-many)
        $formation->certifications()->detach();

        return $formation->delete();
    }

    // public function enrollExistingStudent(string $formationId, string $studentId): bool
    // {
    //     try {
    //         DB::beginTransaction();

    //         // 1. Vérifier si l'étudiant existe et a le rôle étudiant
    //         $student = User::findOrFail($studentId);
    //         if (!$student->hasRole('student')) {
    //             throw new \Exception('User must be a student to enroll');
    //         }

    //         // 2. Vérifier si la formation existe
    //         $formation = Formation::findOrFail($formationId);

    //         // 3. Vérifier si l'étudiant n'est pas déjà inscrit à la formation
    //         if ($formation->students()->where('users.id', $studentId)->exists()) {
    //             throw new \Exception('Student already enrolled in this formation');
    //         }

    //         // 4. Inscrire à la formation
    //         $formation->students()->attach($studentId);

    //         // 5. Inscrire à la première session active disponible
    //         $session = $formation->sessions()
    //             ->where('status', 'active')
    //             ->orderBy('start_date')
    //             ->first();

    //         if (!$session) {
    //             // Si aucune session active n'est trouvée, on laisse l'étudiant inscrit à la formation uniquement
    //             Log::info('No active session found for formation', [
    //                 'formation_id' => $formationId,
    //                 'student_id' => $studentId
    //             ]);
    //         } else {
    //             // 6. Vérifier si l'étudiant n'est pas déjà inscrit à la session
    //             if (!$session->students()->where('users.id', $studentId)->exists()) {
    //                 $session->students()->attach($studentId);
    //                 $session->increment('enrolled_students');
    //             }
    //         }

    //         DB::commit();
    //         return true;
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Failed to enroll existing student', [
    //             'student_id' => $studentId,
    //             'formation_id' => $formationId,
    //             'error' => $e->getMessage()
    //         ]);
    //         return false;
    //     }
    // }

    // public function unenrollStudent(string $formationId, string $studentId): bool
    // {
    //     try {
    //         DB::beginTransaction();

    //         // 1. Vérifier si la formation existe
    //         $formation = Formation::findOrFail($formationId);

    //         // 2. Vérifier si l'étudiant est inscrit à la formation
    //         if (!$formation->students()->where('users.id', $studentId)->exists()) {
    //             throw new \Exception('Student not enrolled in this formation');
    //         }

    //         // 3. Trouver la session où l'étudiant est inscrit
    //         $session = $formation->sessions()
    //             ->whereHas('students', function ($query) use ($studentId) {
    //                 $query->where('users.id', $studentId);
    //             })
    //             ->first();

    //         // 4. Si l'étudiant est inscrit à une session, le désinscrire
    //         if ($session) {
    //             $session->students()->detach($studentId);
    //             $session->decrement('enrolled_students');
    //         }

    //         // 5. Désinscrire de la formation
    //         $formation->students()->detach($studentId);

    //         DB::commit();
    //         return true;
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Failed to unenroll student', [
    //             'student_id' => $studentId,
    //             'formation_id' => $formationId,
    //             'error' => $e->getMessage()
    //         ]);
    //         return false;
    //     }
    // }

    public function getEnrolledStudents($formationId)
    {
        $formation = Formation::findOrFail($formationId);
        $students = $formation->students()
            ->select('users.id', 'users.fullName', 'users.email', 'users.imageUrl')
            ->withPivot('created_at')
            ->orderBy('users.fullName')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'fullName' => $student->fullName,
                    'email' => $student->email,
                    'imageUrl' => $student->imageUrl,
                    'created_at' => $student->pivot->created_at->format('Y-m-d H:i')
                ];
            });

        return $students;
    }
}
