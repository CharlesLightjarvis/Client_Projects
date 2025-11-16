<?php

namespace App\Services;

use App\Models\Module;
use App\Models\Lesson;
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
     * Create a single module with its lessons in one transaction.
     *
     * @param array $data Module data with nested lessons
     * @return Module
     */
    public function createModule(array $data): Module
    {
        return DB::transaction(function () use ($data) {
            // Extract lessons data
            $lessonsData = $data['lessons'] ?? [];
            unset($data['lessons']);

            // Create the module
            $module = Module::create($data);

            // Create lessons if provided
            if (!empty($lessonsData)) {
                foreach ($lessonsData as $lessonData) {
                    $lessonData['module_id'] = $module->id;
                    Lesson::create($lessonData);
                }
            }

            // Load module with its lessons for response
            return $module->load('lessons');
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