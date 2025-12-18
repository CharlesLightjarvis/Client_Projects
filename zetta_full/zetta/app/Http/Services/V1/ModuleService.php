<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\ModuleResource;
use App\Models\Formation;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ModuleService
{
    public function getAllModules()
    {
        return ModuleResource::collection(
            Module::with('formations', 'lessons')->get()
        );
    }

    public function getModuleById($id)
    {
        return new ModuleResource(
            Module::with('formations', 'lessons')->findOrFail($id)
        );
    }

    public function createModule($data)
    {
        try {
            DB::beginTransaction();

            $slug = Str::slug($data['name']);
            if (Module::where('slug', $slug)->exists()) {
                return false;
            }

            $module = Module::create([
                'name' => $data['name'],
                'slug' => $slug,
                'description' => $data['description'] ?? null,
            ]);

            // Attacher les leçons existantes (update du module_id)
            if (!empty($data['existing_lesson_ids']) && is_array($data['existing_lesson_ids'])) {
                Lesson::whereIn('id', $data['existing_lesson_ids'])->update([
                    'module_id' => $module->id,
                ]);
            }

            // Créer les nouvelles leçons
            if (!empty($data['new_lessons']) && is_array($data['new_lessons'])) {
                foreach ($data['new_lessons'] as $lessonData) {
                    $module->lessons()->create([
                        'name' => $lessonData['name'],
                        'slug' => Str::slug($lessonData['name']),
                        'description' => $lessonData['description'] ?? null,
                        'duration' => $lessonData['duration'] ?? 0,
                    ]);
                }
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            Log::error("Erreur createModule: " . $e->getMessage());
            return false;
        }
    }


    public function updateModule($moduleId, $data)
    {
        try {
            DB::beginTransaction();

            $module = Module::findOrFail($moduleId);

            $slug = Str::slug($data['name']);
            if (Module::where('slug', $slug)->where('id', '!=', $moduleId)->exists()) {
                return false;
            }

            // Mettre à jour le module
            $module->update([
                'name' => $data['name'],
                'slug' => $slug,
                'description' => $data['description'] ?? null,
            ]);

            // Détacher toutes les anciennes leçons du module
            Lesson::where('module_id', $module->id)->update([
                'module_id' => null,
            ]);

            // Réattacher les leçons existantes (update du module_id)
            if (!empty($data['existing_lesson_ids']) && is_array($data['existing_lesson_ids'])) {
                Lesson::whereIn('id', $data['existing_lesson_ids'])->update([
                    'module_id' => $module->id,
                ]);
            }

            // Créer les nouvelles leçons
            if (!empty($data['new_lessons']) && is_array($data['new_lessons'])) {
                foreach ($data['new_lessons'] as $lessonData) {
                    $module->lessons()->create([
                        'name' => $lessonData['name'],
                        'slug' => Str::slug($lessonData['name']),
                        'description' => $lessonData['description'] ?? null,
                    ]);
                }
            }

            // Sync formations
            if (!empty($data['formation_ids']) && is_array($data['formation_ids'])) {
                $module->formations()->sync($data['formation_ids']);
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur updateModule: " . $e->getMessage());
            return false;
        }
    }


    public function deleteModule($id)
    {
        try {
            DB::beginTransaction();

            $module = Module::find($id);
            if (!$module) {
                return false;
            }

            // Les relations avec les formations seront automatiquement supprimées 
            // grâce à la configuration de la table pivot

            // Supprimer les leçons
            $module->lessons()->delete();

            // Supprimer le module
            $module->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            return false;
        }
    }
}
