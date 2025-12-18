<?php

namespace App\Http\Requests\lessons;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|nullable|string',
            'module_id' => 'sometimes|nullable|uuid|exists:modules,id',
            'link' => 'sometimes|nullable|url',
            'order' => 'sometimes|nullable|integer|min:1',

            // Attachments - multiple files (uploaded)
            'attachments' => 'sometimes|nullable|array',
            'attachments.*' => [
                'file',
                'max:512000', // 500 MB max per file
                'mimes:' . implode(',', [
                    // Videos
                    'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm',
                    // Documents
                    'pdf',
                    // Microsoft Office
                    'doc', 'docx',           // Word
                    'xls', 'xlsx',           // Excel
                    'ppt', 'pptx',           // PowerPoint
                    // Archives
                    'zip', 'rar', '7z', 'tar', 'gz',
                    // Images
                    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
                ]),
            ],

            // External links (YouTube, Google Drive, etc.)
            'external_links' => 'sometimes|nullable|array',
            'external_links.*.url' => 'required|url',
            'external_links.*.name' => 'required|string|max:255',
            'external_links.*.type' => 'nullable|string|in:youtube,google_drive,tiktok,vimeo,dropbox,onedrive,other',

            // Delete specific attachments by IDs
            'delete_attachments' => 'sometimes|nullable|array',
            'delete_attachments.*' => 'uuid|exists:attachments,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'attachments.*.file' => 'Chaque fichier doit être valide.',
            'attachments.*.max' => 'Chaque fichier ne doit pas dépasser 500 MB.',
            'attachments.*.mimes' => 'Format de fichier non supporté. Formats acceptés : vidéos (mp4, avi, mov, etc.), documents (pdf), Office (word, excel, powerpoint), archives (zip, rar, etc.), images.',
            'external_links.*.url.required' => 'L\'URL du lien externe est requise.',
            'external_links.*.url.url' => 'L\'URL doit être valide.',
            'external_links.*.name.required' => 'Le nom du lien externe est requis.',
            'external_links.*.type.in' => 'Type de lien non supporté. Types acceptés : youtube, google_drive, tiktok, vimeo, dropbox, onedrive, other.',
            'delete_attachments.*.uuid' => 'L\'ID de l\'attachment doit être un UUID valide.',
            'delete_attachments.*.exists' => 'L\'attachment spécifié n\'existe pas.',
        ];
    }
}
