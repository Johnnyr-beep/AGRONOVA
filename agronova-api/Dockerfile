FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    nginx \
    supervisor

# Limpiar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP (PostgreSQL + SQLite para fallback)
RUN docker-php-ext-install pdo pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd

# Obtener Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www

# Copiar código
COPY . .

# Crear .env minimo para que artisan funcione durante el build
RUN cp .env.example .env 2>/dev/null || echo "APP_NAME=AGRONOVA\nAPP_ENV=production\nAPP_KEY=\nDB_CONNECTION=pgsql\nLOG_CHANNEL=stderr" > .env

# Instalar dependencias (sin dev, optimizado)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permisos de storage y cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Puerto que Railway asigna dinámicamente
EXPOSE 8000

# Script de arranque
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
