<?php

namespace App\Services;

use App\Models\Formation;
use Illuminate\Support\Facades\DB;

class FormationService
{
    /**
     * Get all formations.
     */
    public function getAllFormations()
    {
        return Formation::orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new formation.
     */
    public function createFormation(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Formation::create($data);
        });
    }

    /**
     * Update an existing formation.
     */
    public function updateFormation(Formation $formation, array $data)
    {
        return DB::transaction(function () use ($formation, $data) {
            $formation->update($data);

            return $formation->fresh();
        });
    }
}