<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasUuids;

    protected $fillable = [
        'student_id',
        'session_id',
        'amount',
        'remaining_amount',
        'payment_method',
        'status',
        'notes',
        'payment_date'
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2'
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Garder également la méthode session() si elle est utilisée ailleurs
    public function session(): BelongsTo
    {
        return $this->belongsTo(FormationSession::class, 'session_id');
    }

    // Méthode pour accéder à la formation via la session
    // public function formation()
    // {
    //     // Vérifier si la session existe avant d'accéder à sa propriété formation
    //     return $this->session ? $this->session->formation : null;
    // }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class, 'formation_id');
    }
}
