#!/bin/bash
# Deploy script for ahmpostventa → vicar.com.py
# Usage: ./deploy.sh
# Runs from local machine — SSHes into production and deploys latest stable branch

set -e

SERVER_USER=root
SERVER_HOST=168.181.184.99
SERVER_PORT=5519
DEPLOY_PATH=""  # Set this after first deploy (e.g. /var/www/vicar/ahmpostventa)
REPO_URL=https://github.com/keuch2/ahmpostventa.git
BRANCH=stable

echo "==> Pushing latest code to GitHub..."
git push origin "$BRANCH"

echo "==> Deploying to production server..."
ssh -p"$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" bash << EOF
set -e

if [ -z "$DEPLOY_PATH" ]; then
  echo "ERROR: Set DEPLOY_PATH in deploy.sh before running."
  exit 1
fi

cd "$DEPLOY_PATH"

echo "--- Pulling latest code..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "--- Backend: composer install..."
cd app/backend
composer install --no-dev --optimize-autoloader

echo "--- Backend: running migrations..."
php artisan migrate --force

echo "--- Backend: clearing caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "--- Frontend: npm install & build..."
cd ../frontend
npm install --legacy-peer-deps
npm run build

echo "--- Setting permissions..."
cd ../backend
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

echo "==> Deploy complete!"
EOF

echo "==> Done. Check https://www.vicar.com.py/mygarage"
