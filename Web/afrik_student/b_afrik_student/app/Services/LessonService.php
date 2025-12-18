<?php

namespace App\Services;

use App\Models\Lesson;
use App\Models\Attachment;
use App\Models\ModuleSessionInstructor;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class LessonService
{
    /**
     * Get all lessons.
     */
    public function getAllLessons()
    {
        return Lesson::with(['module', 'attachments'])
                ->orderBy('created_at', 'desc')
                ->get();
    }

    /**
     * Get all lessons that an instructor teaches via their module assignments.
     *
     * @param User $instructor
     * @param string|null $courseSessionId
     * @return \Illuminate\Support\Collection
     */
    public function getInstructorLessons(User $instructor, ?string $courseSessionId = null)
    {
        $query = ModuleSessionInstructor::where('instructor_id', $instructor->id)
            ->whereNull('ended_at') // Only active assignments
            ->with(['module.lessons.attachments', 'module.formation']);

        if ($courseSessionId) {
            $query->where('course_session_id', $courseSessionId);
        }

        $moduleAssignments = $query->get();

        // Flatten lessons from all modules with module and formation info
        return $moduleAssignments->flatMap(function ($assignment) {
            return $assignment->module->lessons->map(function ($lesson) use ($assignment) {
                // Clone the module without its lessons to avoid circular reference
                $moduleWithoutLessons = clone $assignment->module;
                $moduleWithoutLessons->unsetRelation('lessons');

                // Set the module relation on the lesson
                $lesson->setRelation('module', $moduleWithoutLessons);

                // Add attachment count
                $lesson->attachments_count = $lesson->attachments->count();

                return $lesson;
            });
        });
    }

    /**
     * Create a new lesson.
     */
    public function createLesson(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Extract attachments and external links from data
            $attachments = $data['attachments'] ?? [];
            $externalLinks = $data['external_links'] ?? [];
            unset($data['attachments'], $data['external_links']);

            // Create the lesson
            $lesson = Lesson::create($data);

            // Handle file attachments upload if present
            if (!empty($attachments) && \is_array($attachments)) {
                $this->handleAttachmentsUpload($lesson, $attachments);
            }

            // Handle external links if present
            if (!empty($externalLinks) && \is_array($externalLinks)) {
                $this->handleExternalLinks($lesson, $externalLinks);
            }

            return $lesson->load('attachments', 'module');
        });
    }

    /**
     * Update an existing lesson.
     */
    public function updateLesson(Lesson $lesson, array $data)
    {
        return DB::transaction(function () use ($lesson, $data) {
            // Extract attachments, external links and delete_attachments from data
            $attachments = $data['attachments'] ?? [];
            $externalLinks = $data['external_links'] ?? [];
            $deleteAttachments = $data['delete_attachments'] ?? [];
            unset($data['attachments'], $data['external_links'], $data['delete_attachments']);

            // Delete specified attachments FIRST
            if (!empty($deleteAttachments) && \is_array($deleteAttachments)) {
                $this->deleteSpecificAttachments($lesson, $deleteAttachments);
            }

            // Update lesson
            $lesson->update($data);

            // Handle file attachments upload if present
            if (!empty($attachments) && \is_array($attachments)) {
                $this->handleAttachmentsUpload($lesson, $attachments);
            }

            // Handle external links if present
            if (!empty($externalLinks) && \is_array($externalLinks)) {
                $this->handleExternalLinks($lesson, $externalLinks);
            }

            return $lesson->fresh(['attachments', 'module']);
        });
    }

    /**
     * Delete a lesson and its associated attachments.
     */
    public function deleteLesson(Lesson $lesson): void
    {
        DB::transaction(function () use ($lesson) {
            // Delete all attachments files and records
            foreach ($lesson->attachments as $attachment) {
                $this->deleteAttachmentFile($attachment->url);
                $attachment->delete();
            }

            // Delete the lesson
            $lesson->delete();
        });
    }

    /**
     * Handle multiple attachments upload for a lesson.
     */
    private function handleAttachmentsUpload(Lesson $lesson, array $files): void
    {
        foreach ($files as $file) {
            if ($file instanceof UploadedFile && $file->isValid()) {
                // Get file info
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $mimeType = $file->getMimeType();

                // Generate unique filename
                $filename = pathinfo($originalName, PATHINFO_FILENAME) . '_' . time() . '_' . uniqid() . '.' . $extension;

                // Store file in lessons/attachments directory
                $path = $file->storeAs('lessons/attachments', $filename, 'public');

                // Determine file type based on mime type
                $type = $this->determineFileType($mimeType, $extension);

                // Create attachment record
                $lesson->attachments()->create([
                    'name' => $originalName,
                    'url' => $path,
                    'type' => $type,
                ]);
            }
        }
    }

    /**
     * Determine file type based on mime type and extension.
     */
    private function determineFileType(string $mimeType, string $extension): string
    {
        // Video types
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        // Image types
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }

        // Document types
        if ($mimeType === 'application/pdf') {
            return 'pdf';
        }

        // Microsoft Office
        if (in_array($extension, ['doc', 'docx']) || str_contains($mimeType, 'word')) {
            return 'word';
        }

        if (in_array($extension, ['xls', 'xlsx']) || str_contains($mimeType, 'excel') || str_contains($mimeType, 'spreadsheet')) {
            return 'excel';
        }

        if (in_array($extension, ['ppt', 'pptx']) || str_contains($mimeType, 'powerpoint') || str_contains($mimeType, 'presentation')) {
            return 'powerpoint';
        }

        // Archives
        if (in_array($extension, ['zip', 'rar', '7z', 'tar', 'gz']) || str_contains($mimeType, 'zip') || str_contains($mimeType, 'compressed')) {
            return 'archive';
        }

        return 'other';
    }

    /**
     * Handle external links (YouTube, Google Drive, etc.).
     */
    private function handleExternalLinks(Lesson $lesson, array $links): void
    {
        foreach ($links as $link) {
            if (isset($link['url']) && isset($link['name'])) {
                // Determine type automatically if not provided
                $type = $link['type'] ?? $this->detectLinkType($link['url']);

                // Create attachment record with external URL
                $lesson->attachments()->create([
                    'name' => $link['name'],
                    'url' => $link['url'],
                    'type' => $type,
                ]);
            }
        }
    }

    /**
     * Auto-detect link type based on URL.
     */
    private function detectLinkType(string $url): string
    {
        $url = strtolower($url);

        if (str_contains($url, 'youtube.com') || str_contains($url, 'youtu.be')) {
            return 'youtube';
        }

        if (str_contains($url, 'drive.google.com')) {
            return 'google_drive';
        }

        if (str_contains($url, 'tiktok.com')) {
            return 'tiktok';
        }

        if (str_contains($url, 'vimeo.com')) {
            return 'vimeo';
        }

        if (str_contains($url, 'dropbox.com')) {
            return 'dropbox';
        }

        if (str_contains($url, 'onedrive.live.com') || str_contains($url, '1drv.ms')) {
            return 'onedrive';
        }

        return 'other';
    }

    /**
     * Delete specific attachments by their IDs.
     */
    private function deleteSpecificAttachments(Lesson $lesson, array $attachmentIds): void
    {
        // Get attachments that belong to this lesson
        $attachmentsToDelete = Attachment::whereIn('id', $attachmentIds)
            ->where('attachable_id', $lesson->id)
            ->where('attachable_type', Lesson::class)
            ->get();

        foreach ($attachmentsToDelete as $attachment) {
            // Delete file from storage if it's a local file
            $this->deleteAttachmentFile($attachment->url);

            // Delete attachment record from database
            $attachment->delete();
        }
    }

    /**
     * Delete an attachment file from storage.
     */
    private function deleteAttachmentFile(string $path): void
    {
        // Only delete if it's a local file path (not an external URL)
        if (!filter_var($path, FILTER_VALIDATE_URL)) {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }
}