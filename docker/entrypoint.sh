#!/bin/sh
set -e

echo "==> Running database migrations..."
php artisan migrate --force

echo "==> Caching config, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Linking storage..."
php artisan storage:link --force 2>/dev/null || true

echo "==> Starting services via supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
