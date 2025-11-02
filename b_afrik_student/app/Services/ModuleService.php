<?php

namespace App\Services;

use App\Models\Module;
use Illuminate\Support\Facades\DB;

class ModuleService
{
    /**
     * Get all modules.
     */
    public function getAllModules()
    {
        return Module::orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new module.
     */
    public function createModule(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Module::create($data);
        });
    }

    /**
     * Update an existing module.
     */
    public function updateModule(Module $module, array $data)
    {
        return DB::transaction(function () use ($module, $data) {
            $module->update($data);

            return $module->fresh();
        });
    }
}