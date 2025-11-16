<?php

namespace App\Services;

use App\Models\Formation;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class FormationService
{
    /**
     * Get all formations.
     */
    public function getAllFormations(): Collection
    {
        return Formation::with(['modules.lessons'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get a formation with all its relationships.
     */
    public function getFormation(Formation $formation): Formation
    {
        return $formation->load(['modules.lessons', 'courseSessions']);
    }

    /**
     * Create a new formation (simple - no nested modules).
     */
    public function createFormation(array $data): Formation
    {
        return DB::transaction(function () use ($data) {
            // Create the formation only
            return Formation::create($data);
        });
    }

    /**
     * Update an existing formation (simple - no nested modules).
     */
    public function updateFormation(Formation $formation, array $data): Formation
    {
        return DB::transaction(function () use ($formation, $data) {
            // Update formation basic info only
            $formation->update($data);

            return $formation->fresh(['modules.lessons']);
        });
    }

}