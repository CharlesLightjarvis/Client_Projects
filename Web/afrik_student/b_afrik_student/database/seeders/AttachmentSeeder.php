<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Lesson;
use App\Models\Attachment;

class AttachmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all lessons
        $lessons = Lesson::all();

        if ($lessons->isEmpty()) {
            $this->command->warn('No lessons found. Please seed lessons first.');
            return;
        }

        $this->command->info('Creating attachments for lessons...');

        foreach ($lessons as $index => $lesson) {
            // Vary attachments per lesson
            switch ($index % 5) {
                case 0:
                    // Lesson with video file and YouTube link
                    $this->createAttachments($lesson, [
                        [
                            'name' => 'Video cours - Introduction.mp4',
                            'url' => 'lessons/attachments/introduction_video_' . time() . '.mp4',
                            'type' => 'video',
                        ],
                        [
                            'name' => 'Tutoriel YouTube - ' . $lesson->title,
                            'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                            'type' => 'youtube',
                        ],
                    ]);
                    break;

                case 1:
                    // Lesson with PDF and Google Drive link
                    $this->createAttachments($lesson, [
                        [
                            'name' => 'Support de cours.pdf',
                            'url' => 'lessons/attachments/support_cours_' . time() . '.pdf',
                            'type' => 'pdf',
                        ],
                        [
                            'name' => 'Exercices supplémentaires (Google Drive)',
                            'url' => 'https://drive.google.com/file/d/1abc123xyz/view',
                            'type' => 'google_drive',
                        ],
                    ]);
                    break;

                case 2:
                    // Lesson with PowerPoint, Excel and Dropbox link
                    $this->createAttachments($lesson, [
                        [
                            'name' => 'Présentation du cours.pptx',
                            'url' => 'lessons/attachments/presentation_' . time() . '.pptx',
                            'type' => 'powerpoint',
                        ],
                        [
                            'name' => 'Tableau de données.xlsx',
                            'url' => 'lessons/attachments/donnees_' . time() . '.xlsx',
                            'type' => 'excel',
                        ],
                        [
                            'name' => 'Ressources complémentaires (Dropbox)',
                            'url' => 'https://www.dropbox.com/s/abc123/resources.zip',
                            'type' => 'dropbox',
                        ],
                    ]);
                    break;

                case 3:
                    // Lesson with ZIP archive and Vimeo link
                    $this->createAttachments($lesson, [
                        [
                            'name' => 'Code source du projet.zip',
                            'url' => 'lessons/attachments/code_source_' . time() . '.zip',
                            'type' => 'archive',
                        ],
                        [
                            'name' => 'Démonstration vidéo (Vimeo)',
                            'url' => 'https://vimeo.com/123456789',
                            'type' => 'vimeo',
                        ],
                    ]);
                    break;

                case 4:
                    // Lesson with Word doc, images and TikTok link
                    $this->createAttachments($lesson, [
                        [
                            'name' => 'Résumé de cours.docx',
                            'url' => 'lessons/attachments/resume_' . time() . '.docx',
                            'type' => 'word',
                        ],
                        [
                            'name' => 'Diagramme explicatif.png',
                            'url' => 'lessons/attachments/diagramme_' . time() . '.png',
                            'type' => 'image',
                        ],
                        [
                            'name' => 'Tutoriel rapide (TikTok)',
                            'url' => 'https://www.tiktok.com/@user/video/1234567890123456789',
                            'type' => 'tiktok',
                        ],
                        [
                            'name' => 'Autre ressource (OneDrive)',
                            'url' => 'https://onedrive.live.com/?id=abc123',
                            'type' => 'onedrive',
                        ],
                    ]);
                    break;
            }
        }

        $this->command->info('Attachments created successfully!');
    }

    /**
     * Create attachments for a lesson.
     */
    private function createAttachments(Lesson $lesson, array $attachments): void
    {
        foreach ($attachments as $attachment) {
            $lesson->attachments()->create($attachment);
        }

        $externalCount = collect($attachments)->filter(fn($a) => filter_var($a['url'], FILTER_VALIDATE_URL))->count();
        $localCount = count($attachments) - $externalCount;

        $this->command->info("  - Lesson '{$lesson->title}': {$localCount} fichier(s) local, {$externalCount} lien(s) externe(s)");
    }
}
