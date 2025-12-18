<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasUuids;

    protected $fillable = [
        'session_id',
        'student_id',
        'date',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(FormationSession::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Méthode pour accéder à la formation via la session
    public function formation()
    {
        return $this->session->formation;
    }
}
