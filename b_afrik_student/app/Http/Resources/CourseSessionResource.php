<?php

namespace App\Http\Resources;

use App\Enums\EnrollmentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseSessionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'formation' => new FormationResource($this->whenLoaded('formation')),
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            'max_students' => $this->max_students,
            'enrolled_count' => $this->whenLoaded('enrollments', function() {
                return $this->enrollments->where('status', EnrollmentStatus::CONFIRMED)->count();
            }, 0),
            'available_spots' => $this->availableSpots(),
            'is_full' => $this->isFull(),
            'location' => $this->location,
            // 'enrollments' => EnrollmentResource::collection($this->whenLoaded('enrollments')),

            // Instructeurs actuellement actifs pour cette session
            'current_instructors' => $this->whenLoaded('currentInstructors', function () {
                return $this->currentInstructors->map(function ($assignment) {
                    return [
                        'id' => $assignment->id,
                        // 'module_id' => $assignment->module_id,
                        // 'instructor_id' => $assignment->instructor_id,
                        'started_at' => $assignment->started_at,
                        'module' => $assignment->relationLoaded('module')
                            ? new ModuleResource($assignment->module)
                            : null,
                        'instructor' => $assignment->relationLoaded('instructor')
                            ? new UserResource($assignment->instructor)
                            : null,
                    ];
                });
            }),

            // Historique complet des instructeurs (actuels + passés)
            // 'instructor_history' => $this->whenLoaded('instructorHistory', function () {
            //     return $this->instructorHistory->map(function ($assignment) {
            //         return [
            //             'id' => $assignment->id,
            //             // 'module_id' => $assignment->module_id,
            //             // 'instructor_id' => $assignment->instructor_id,
            //             'started_at' => $assignment->started_at,
            //             'ended_at' => $assignment->ended_at,
            //             'is_current' => $assignment->ended_at === null,
            //             'module' => $assignment->relationLoaded('module')
            //                 ? new ModuleResource($assignment->module)
            //                 : null,
            //             'instructor' => $assignment->relationLoaded('instructor')
            //                 ? new UserResource($assignment->instructor)
            //                 : null,
            //         ];
            //     });
            // }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
