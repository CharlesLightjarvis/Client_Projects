<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Pré-inscription Reçue</title>
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
        <h1>Pré-inscription Reçue</h1>
    </div>

    <div class="content">
        <p>Bonjour {{ $interest->fullName }},</p>

        <p>Nous vous confirmons la bonne réception de votre demande de pré-inscription à la formation "{{ $interest->formation->name }}".</p>

        <p>Notre équipe va étudier votre demande dans les plus brefs délais. Nous vous contacterons prochainement pour vous informer des prochaines étapes.</p>

        <p>Détails de votre demande :</p>
        <ul>
            <li>Formation : {{ $interest->formation->name }}</li>
            <li>Durée : {{ $interest->formation->duration }}</li>
            <li>Niveau : {{ $interest->formation->level }}</li>
        </ul>

        <p>Si vous avez des questions ou besoin d'informations complémentaires, n'hésitez pas à nous contacter.</p>

        <div class="footer">
            <p>Cordialement,<br>L'équipe de formation</p>
        </div>
    </div>
</body>

</html>