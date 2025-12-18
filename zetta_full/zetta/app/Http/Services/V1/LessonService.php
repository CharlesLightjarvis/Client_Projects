<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\LessonResource;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LessonService
{
    public function getAllLessons()
    {
        return LessonResource::collection(
            Lesson::with('module')->get()
        );
    }

    public function getLessonById($id)
    {
        return new LessonResource(Lesson::with('module')->findOrFail($id));
    }

    public function createLesson($data)
    {
        try {
            DB::beginTransaction();

            // Vérification du slug unique
            $slug = Str::slug($data['name']);
            $lesson = Lesson::where('slug', $slug)->exists();
            if ($lesson) {
                return false;
            }

            // Vérification si le module existe
            // $module = Module::find($data['module_id']);
            // if (!$module) {
            //     return false;
            // }

            // Ajout du slug aux données
            $data['slug'] = $slug;

            // Création de la leçon
            Lesson::create($data);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            return false;
        }
    }

    public function updateLesson($id, $data)
    {
        try {
            DB::beginTransaction();

            $lesson = Lesson::find($id);
            if (!$lesson) {
                return false;
            }

            // Si le nom est modifié, vérifier que le nouveau slug n'existe pas déjà
            if (isset($data['name'])) {
                $newSlug = Str::slug($data['name']);
                if ($newSlug !== $lesson->slug) {
                    $slugExists = Lesson::where('slug', $newSlug)
                        ->where('id', '!=', $id)
                        ->exists();
                    if ($slugExists) {
                        return false;
                    }
                    $data['slug'] = $newSlug;
                }
            }

            // Vérifier le module si l'ID est modifié
            if (isset($data['module_id'])) {
                $module = Module::find($data['module_id']);
                if (!$module) {
                    return false;
                }
            }

            $lesson->update($data);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            return false;
        }
    }

    public function deleteLesson($id)
    {
        try {
            $lesson = Lesson::find($id);
            return $lesson ? $lesson->delete() : false;
        } catch (\Exception $e) {
            return false;
        }
    }
}
