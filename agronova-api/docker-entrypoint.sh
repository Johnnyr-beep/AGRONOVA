#!/bin/bash
set -e

echo "=========================================="
echo " AGRONOVA API — Iniciando en Railway"
echo "=========================================="

cd /var/www

# Crear .env si no existe (Railway inyecta las vars directamente como env vars)
if [ ! -f ".env" ]; then
    echo "[SETUP] Creando .env desde variables de entorno..."
    cat > .env << EOF
APP_NAME=${APP_NAME:-AGRONOVA}
APP_ENV=${APP_ENV:-production}
APP_KEY=${APP_KEY:-}
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost}

LOG_CHANNEL=stderr
LOG_LEVEL=error

DB_CONNECTION=${DB_CONNECTION:-pgsql}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE:-railway}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-}

DATABASE_URL=${DATABASE_URL:-}

SESSION_DRIVER=${SESSION_DRIVER:-cookie}
SESSION_LIFETIME=120
SESSION_ENCRYPT=false

CACHE_STORE=${CACHE_STORE:-array}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-sync}

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
EOF
fi

# Generar APP_KEY si no esta definida
if [ -z "${APP_KEY}" ] || grep -q "^APP_KEY=$" .env; then
    echo "[1/4] Generando APP_KEY..."
    php artisan key:generate --force
else
    echo "[1/4] APP_KEY ya configurada."
fi

# Optimizar
echo "[2/4] Cacheando configuracion..."
php artisan config:cache || true
php artisan route:cache || true

# Migraciones
echo "[3/4] Ejecutando migraciones..."
php artisan migrate --force

# Seeder
echo "[4/4] Creando usuario administrador..."
php artisan db:seed --class=SuperAdminSeeder --force

echo "=========================================="
echo " Iniciando servidor en puerto ${PORT:-8000}"
echo "=========================================="

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
