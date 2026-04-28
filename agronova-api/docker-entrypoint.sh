#!/bin/bash
set -e

echo "=========================================="
echo " AGRONOVA API — Iniciando en Railway"
echo "=========================================="

# Generar APP_KEY si no existe
if [ -z "$APP_KEY" ]; then
    echo "[1/4] Generando APP_KEY..."
    php artisan key:generate --force
else
    echo "[1/4] APP_KEY ya configurada."
fi

# Limpiar y optimizar cache de Laravel
echo "[2/4] Optimizando configuracion..."
php artisan config:cache
php artisan route:cache

# Ejecutar migraciones
echo "[3/4] Ejecutando migraciones..."
php artisan migrate --force

# Ejecutar seeder del admin
echo "[4/4] Creando usuario administrador..."
php artisan db:seed --class=SuperAdminSeeder --force

echo "=========================================="
echo " Todo listo. Iniciando servidor PHP..."
echo "=========================================="

# Arrancar el servidor en el puerto que Railway asigna
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
