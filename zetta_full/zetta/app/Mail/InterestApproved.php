<?php

namespace App\Mail;

use App\Models\FormationInterest;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InterestApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $interest;
    public $user;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct(FormationInterest $interest, User $user, string $password)
    {
        $this->interest = $interest;
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre inscription à la formation a été approuvée',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.interests.approved',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
