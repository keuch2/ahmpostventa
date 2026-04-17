#!/bin/bash
# Deploy script for ahmpostventa → vicar.com.py
# Usage: ./deploy.sh
# Runs from local machine — SSHes into production and deploys latest stable branch

set -e

SERVER_USER=root
SERVER_HOST=168.181.184.99
SERVER_PORT=5519
DEPLOY_PATH="/home/vicar/ahmpostventa"
PHP=/opt/php8-4/bin/php-cli
COMPOSER=/usr/local/bin/composer
BRANCH=main

echo "==> Pushing latest code to GitHub..."
git push origin "$BRANCH"

echo "==> Deploying to production server..."
sshpass -p '92RmpLy5HRX&Ze' ssh -o StrictHostKeyChecking=accept-new -p"$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" bash << EOF
set -e

cd "$DEPLOY_PATH"

echo "--- Pulling latest code..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "--- Backend: composer install..."
cd app/backend
COMPOSER_ALLOW_SUPERUSER=1 $PHP -d disable_functions='' $COMPOSER install --no-dev --optimize-autoloader --no-interaction

echo "--- Backend: running migrations..."
$PHP -d disable_functions='' artisan migrate --force

echo "--- Setting permissions..."
chown -R vicar:vicar /home/vicar/ahmpostventa
chmod -R 755 storage bootstrap/cache

echo "--- Frontend: syncing dist to mygarage..."
cp -r /home/vicar/ahmpostventa/app/frontend/dist/. /home/vicar/public_html/mygarage/

echo "==> Deploy complete!"
EOF

echo "==> Done. Check https://www.vicar.com.py/mygarage"
