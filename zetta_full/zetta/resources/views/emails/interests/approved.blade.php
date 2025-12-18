<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Inscription Approuvée</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
        }

        .content {
            padding: 20px;
        }

        .credentials {
            background-color: #f8f9fa;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Félicitations !</h1>
    </div>

    <div class="content">
        <p>Bonjour {{ $user->fullName }},</p>

        <p>Nous sommes ravis de vous informer que votre inscription à la formation "{{ $interest->formation->name }}" a été approuvée.</p>

        <p>Un compte a été créé pour vous avec les identifiants suivants :</p>

        <div class="credentials">
            <p><strong>Email :</strong> {{ $user->email }}</p>
            <p><strong>Mot de passe temporaire :</strong> {{ $password }}</p>
        </div>

        <p><strong>Important :</strong> Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe dès votre première connexion.</p>

        <a href="{{ config('app.url') }}/login" class="button">Se connecter à la plateforme</a>

        <p>Détails de la formation :</p>
        <ul>
            <li>Formation : {{ $interest->formation->name }}</li>
            <li>Durée : {{ $interest->formation->duration }}</li>
            <li>Niveau : {{ $interest->formation->level }}</li>
        </ul>

        <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter.</p>

        <div class="footer">
            <p>Cordialement,<br>L'équipe de formation</p>
        </div>
    </div>
</body>

</html>