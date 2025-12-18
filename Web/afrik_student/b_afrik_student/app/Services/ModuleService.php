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
        return Module::with('lessons', 'formation')
                ->orderBy('created_at', 'desc')->get();
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
            return $module->load('lessons', 'formation');
        });
    }

    /**
     * Update an existing module with lessons management.
     */
    public function updateModule(Module $module, array $data)
    {
        return DB::transaction(function () use ($module, $data) {
            // Extract lessons data and delete_lessons
            $lessonsData = $data['lessons'] ?? [];
            $deleteLessons = $data['delete_lessons'] ?? [];
            unset($data['lessons'], $data['delete_lessons']);

            // Detach specified lessons (set module_id to null instead of deleting)
            if (!empty($deleteLessons)) {
                Lesson::whereIn('id', $deleteLessons)
                    ->where('module_id', $module->id)
                    ->update(['module_id' => null]);
            }

            // Update module basic fields
            $module->update($data);

            // Handle lessons (create new or update existing)
            if (!empty($lessonsData)) {
                foreach ($lessonsData as $lessonData) {
                    if (isset($lessonData['id'])) {
                        // Find the lesson by ID (no module_id filter)
                        $lesson = Lesson::find($lessonData['id']);
                        
                        if ($lesson) {
                            // Assign it to this module
                            $lessonData['module_id'] = $module->id;
                            $lesson->update($lessonData);
                        }
                    } else {
                        // Create new lesson
                        $lessonData['module_id'] = $module->id;
                        Lesson::create($lessonData);
                    }
                }
            }

            // Load module with its lessons for response
            return $module->fresh(['lessons', 'formation']);
        });
    }

   
}