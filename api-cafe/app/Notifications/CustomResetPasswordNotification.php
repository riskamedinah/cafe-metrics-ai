<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        // URL frontend React dengan parameter token & email
        $resetUrl = url('/reset-password?token=' . $this->token . '&email=' . $notifiable->email);

        return (new MailMessage)
            ->subject('Reset Password - ' . config('app.name'))
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Kami menerima permintaan reset password untuk akun Anda.')
            ->action('Reset Password Sekarang', $resetUrl)
            ->line('Link ini berlaku selama 60 menit.')
            ->line('Jika Anda tidak meminta reset password, abaikan email ini.');
    }
}