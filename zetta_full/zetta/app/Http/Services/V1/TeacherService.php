<?php

namespace App\Http\Services\V1;

use App\Http\Resources\v1\FormationSessionResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TeacherService
{
    public function getTeacherSessions()
    {
        /** @var User $teacher */
        $teacher = Auth::user();

        $sessions = $teacher->teachingSessions()
            ->with([
                'formation',
                'students' => function ($query) {
                    $query->select('users.id', 'users.fullName', 'users.email', 'users.imageUrl');
                }
            ])
            ->orderBy('start_date', 'desc')
            ->get();

        return FormationSessionResource::collection($sessions);
    }
}
