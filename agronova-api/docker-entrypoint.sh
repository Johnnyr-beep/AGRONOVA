#!/bin/bash
set -e

echo "=========================================="
echo " AGRONOVA API — Iniciando en Railway"
echo "=========================================="

cd /var/www

# Crear .env desde las variables de entorno de Railway
echo "[SETUP] Generando .env desde variables de Railway..."
cat > .env << ENVFILE
APP_NAME=${APP_NAME:-AGRONOVA}
APP_ENV=${APP_ENV:-production}
APP_KEY=${APP_KEY:-}
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost}

LOG_CHANNEL=stderr
LOG_LEVEL=error

DB_CONNECTION=pgsql
DATABASE_URL=${DATABASE_URL:-}
DB_HOST=${PGHOST:-${DB_HOST:-127.0.0.1}}
DB_PORT=${PGPORT:-${DB_PORT:-5432}}
DB_DATABASE=${PGDATABASE:-${DB_DATABASE:-railway}}
DB_USERNAME=${PGUSER:-${DB_USERNAME:-postgres}}
DB_PASSWORD=${PGPASSWORD:-${DB_PASSWORD:-}}

SESSION_DRIVER=${SESSION_DRIVER:-cookie}
SESSION_LIFETIME=120
SESSION_ENCRYPT=false

CACHE_STORE=${CACHE_STORE:-array}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-sync}

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
ENVFILE

echo "[.env] Creado. Contenido DB:"
grep "DB_" .env | grep -v PASSWORD || true

# Generar APP_KEY si no esta definida
if [ -z "${APP_KEY}" ]; then
    echo "[1/4] Generando APP_KEY..."
    php artisan key:generate --force
else
    echo "[1/4] APP_KEY ya esta configurada."
fi

# Limpiar cache viejo y reoptimizar
echo "[2/4] Optimizando..."
php artisan config:clear
php artisan config:cache || true
php artisan route:cache || true

# Migraciones
echo "[3/4] Ejecutando migraciones..."
php artisan migrate --force

# Seeder
echo "[4/4] Creando usuario administrador..."
php artisan db:seed --class=SuperAdminSeeder --force

echo "=========================================="
echo " Servidor iniciando en puerto ${PORT:-8000}"
echo "=========================================="

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
