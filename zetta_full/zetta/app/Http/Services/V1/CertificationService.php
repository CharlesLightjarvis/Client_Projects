<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\CertificationResource;
use App\Models\Certification;
use App\Models\Formation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class CertificationService
{
    public function getAllCertifications()
    {
        return CertificationResource::collection(
            Certification::with('formations', 'chapters')->get()
        );
    }

    public function getCertificationById($id)
    {
        return new CertificationResource(Certification::with('formations')->findOrFail($id));
    }

    public function createCertification($data)
    {
        try {
            DB::beginTransaction();

            // Gestion de l'image
            if (isset($data['image']) && $data['image']->isValid()) {
                $imagePath = $data['image']->store('certifications', 'public');
                $data['image'] = $imagePath;
            }

            // Vérification du slug unique
            $slug = Str::slug($data['name']);
            $certification = Certification::where('slug', $slug)->exists();
            if ($certification) {
                return false;
            }

            // Vérification si la formation existe
            // $formation = Formation::find($data['formation_id']);
            // if (!$formation) {
            //     return false;
            // }

            // Ajout du slug aux données
            $data['slug'] = $slug;

            // S'assurer que les tableaux sont bien initialisés même s'ils sont vides
            $arrayFields = ['benefits', 'skills', 'best_for', 'prerequisites'];
            foreach ($arrayFields as $field) {
                if (!isset($data[$field])) {
                    $data[$field] = [];
                }
            }

            // Création de la certification
            $certification = Certification::create($data);

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

    public function updateCertification($id, $data)
    {
        try {
            DB::beginTransaction();

            $certification = Certification::find($id);
            if (!$certification) {
                return false;
            }

            // Gestion de l'image
            if (isset($data['image']) && $data['image']->isValid()) {
                // Supprimer l'ancienne image si elle existe
                if ($certification->image) {
                    Storage::disk('public')->delete($certification->image);
                }
                $imagePath = $data['image']->store('certifications', 'public');
                $data['image'] = $imagePath;
            }

            // Si le nom est modifié, vérifier que le nouveau slug n'existe pas déjà
            if (isset($data['name'])) {
                $newSlug = Str::slug($data['name']);
                if ($newSlug !== $certification->slug) {
                    $slugExists = Certification::where('slug', $newSlug)
                        ->where('id', '!=', $id)
                        ->exists();
                    if ($slugExists) {
                        return false;
                    }
                    $data['slug'] = $newSlug;
                }
            }

            // Gérer les champs de type tableau
            $arrayFields = ['benefits', 'skills', 'best_for', 'prerequisites'];
            foreach ($arrayFields as $field) {
                if (isset($data[$field])) {
                    if (!is_array($data[$field])) {
                        $data[$field] = [];
                    }
                } else {
                    $data[$field] = $certification->$field ?? [];
                }
            }

            $certification->update($data);

            // === AJOUT MANY TO MANY FORMATIONS ===
            if (isset($data['formation_ids']) && is_array($data['formation_ids'])) {
                $certification->formations()->sync($data['formation_ids']);
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

    public function deleteCertification($id)
    {
        try {
            $certification = Certification::find($id);
            if (!$certification) {
                return false;
            }

            // Supprimer l'image si elle existe
            if ($certification->image) {
                Storage::disk('public')->delete($certification->image);
            }

            // Détacher les formations liées (many-to-many)
            $certification->formations()->detach();

            $certification->delete();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
