#!/bin/bash

set -e

echo "🚀 Déploiement en cours..."

cd /var/www/zetta_api

echo "📥 Sauvegarde du fichier .env..."
cp .env /tmp/.env_backup

echo "📥 Mise à jour du dépôt depuis GitHub...."
git fetch --all
git reset --hard origin/main
git clean -fd

echo "♻️ Restauration du fichier .env..."
mv /tmp/.env_backup .env

echo "📦 Installation des dépendances PHP..."
composer install --optimize-autoloader
composer require fakerphp/faker 

echo "📦 Installation des dépendances npm..."
command -v npm >/dev/null 2>&1 && npm install && npm run build || echo "⚠️ npm non installé, étape ignorée."

echo "⚙️  Configuration de l'environnement..."
php artisan migrate --force

echo "🧹 Nettoyage du cache..."
php artisan cache:clear
php artisan config:clear   
php artisan route:clear
php artisan view:clear

echo "⚡ Optimisation de l'application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔄 Redémarrage de PHP-FPM et Nginx..."
systemctl restart php8.3-fpm
systemctl restart nginx

echo "✅ Déploiement terminé avec succès ! 🎉"
# ll