<?php

namespace App\Services;

use App\Enums\EnrollmentStatus;
use App\Models\Formation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class FormationService
{
    /**
     * Get all formations.
     */
    public function getAllFormations(): Collection
    {
        return Formation::with(['modules.lessons.attachments'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get a formation with all its relationships.
     */
    public function getFormation(Formation $formation): Formation
    {
        return $formation->load(['modules.lessons.attachments', 'courseSessions']);
    }

    /**
     * Create a new formation (simple - no nested modules).
     */
    public function createFormation(array $data): Formation
    {
        return DB::transaction(function () use ($data) {
            // Handle image upload if present
            if (isset($data['image_url']) && $data['image_url'] instanceof UploadedFile) {
                $data['image_url'] = $this->handleImageUpload($data['image_url']);
            }

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
            // Handle image upload if present
            if (isset($data['image_url']) && $data['image_url'] instanceof UploadedFile) {
                // Delete old image if exists
                if ($formation->image_url) {
                    $this->deleteImage($formation->image_url);
                }

                $data['image_url'] = $this->handleImageUpload($data['image_url']);
            }

            // Update formation basic info only
            $formation->update($data);

            return $formation->fresh(['modules.lessons.attachments']);
        });
    }

    /**
     * Handle image upload and return the stored path.
     */
    private function handleImageUpload(UploadedFile $image): string
    {
        // Get original file name and extension
        $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $image->getClientOriginalExtension();

        // Create a unique filename while preserving the original name
        $filename = $originalName . '_' . time() . '.' . $extension;

        // Store in public disk under formations/images directory
        $path = $image->storeAs('formations/images', $filename, 'public');

        return $path;
    }

    /**
     * Delete a formation and its associated image.
     */
    public function deleteFormation(Formation $formation): void
    {
        DB::transaction(function () use ($formation) {
            // Delete image if exists
            if ($formation->image_url) {
                $this->deleteImage($formation->image_url);
            }

            // Delete the formation
            $formation->delete();
        });
    }

    /**
     * Delete an image from storage.
     */
    private function deleteImage(string $path): void
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Get all formations where a student is enrolled (active enrollments only).
     */
    public function getStudentEnrolledFormations(string $studentId): Collection
    {
        return Formation::whereHas('courseSessions.enrollments', function ($query) use ($studentId) {
            $query->where('student_id', $studentId)
                  ->whereIn('status', [EnrollmentStatus::CONFIRMED]);
        })
        ->with(['modules.lessons.attachments'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->unique('id');
    }

}
