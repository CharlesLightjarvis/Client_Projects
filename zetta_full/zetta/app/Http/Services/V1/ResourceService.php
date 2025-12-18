<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\LessonResourceResource;
use App\Http\Resources\v1\ResourceResource;
use App\Models\Lesson;
use App\Models\LessonResource;
use App\Models\Resource;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ResourceService
{
    public function getResourcesByLessonId($lessonId)
    {
        return ResourceResource::collection(
            Resource::where('lesson_id', $lessonId)->get()
        );
    }

    public function getResourceById($id)
    {
        return new ResourceResource(Resource::findOrFail($id));
    }

    public function createResource(array $data, UploadedFile $file)
    {
        try {
            DB::beginTransaction();

            // Vérifier si la leçon existe
            $lesson = Lesson::findOrFail($data['lesson_id']);

            // Stocker le fichier
            $path = $file->store('resources', 'public');

            // Créer la ressource
            $resource = Resource::create([
                'lesson_id' => $data['lesson_id'],
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'file_path' => $path,
                'type' => 'pdf',
                'size' => $file->getSize() / 1024, // Convertir en KB
            ]);

            DB::commit();
            return new ResourceResource($resource);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function updateResource($id, array $data, ?UploadedFile $file = null)
    {
        try {
            DB::beginTransaction();

            $resource = Resource::findOrFail($id);

            // Mettre à jour les champs textuels
            if (isset($data['title'])) {
                $resource->title = $data['title'];
            }

            if (array_key_exists('description', $data)) {
                $resource->description = $data['description'];
            }

            // Si un nouveau fichier est fourni, mettre à jour le fichier
            if ($file) {
                // Supprimer l'ancien fichier
                if (Storage::disk('public')->exists($resource->file_path)) {
                    Storage::disk('public')->delete($resource->file_path);
                }

                // Stocker le nouveau fichier
                $path = $file->store('resources', 'public');
                $resource->file_path = $path;
                $resource->size = $file->getSize() / 1024; // Convertir en KB
            }

            $resource->save();

            DB::commit();
            return new ResourceResource($resource);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function deleteResource($id)
    {
        try {
            DB::beginTransaction();

            $resource = Resource::findOrFail($id);

            // Supprimer le fichier
            if (Storage::disk('public')->exists($resource->file_path)) {
                Storage::disk('public')->delete($resource->file_path);
            }

            // Supprimer l'enregistrement
            $resource->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            return false;
        }
    }
}
