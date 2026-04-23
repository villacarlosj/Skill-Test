# ─── Stage 1: Build (needs both PHP and Node) ────────────────────────────────
# We need PHP to run `artisan wayfinder:generate` which produces the
# TypeScript route files that Vite needs before it can compile the frontend.
FROM php:8.3-cli-bookworm AS builder

# System deps for PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        libicu-dev \
        unzip \
        git \
        curl \
    && docker-php-ext-install pdo pdo_pgsql zip intl \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# ── PHP dependencies ──────────────────────────────────────────────────────────
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# ── Copy source ───────────────────────────────────────────────────────────────
COPY . .

# Generate a temporary APP_KEY so artisan can boot without a real .env.
# Wayfinder only reads routes — no DB connection needed.
RUN cp .env.example .env \
    && php artisan key:generate --force \
    && php artisan wayfinder:generate

# ── Node / frontend ───────────────────────────────────────────────────────────
RUN npm ci && npm run build

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS runtime

# Runtime system packages
RUN apk add --no-cache \
        nginx \
        supervisor \
        postgresql-dev \
        icu-dev \
        libzip-dev \
        oniguruma-dev \
        curl \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pgsql \
        zip \
        intl \
        mbstring \
        opcache \
    && rm -rf /var/cache/apk/*

WORKDIR /var/www/html

# Copy built application from stage 1
COPY --from=builder /app /var/www/html

# Overlay runtime-specific config files
COPY docker/nginx.conf      /etc/nginx/http.d/default.conf
COPY docker/php-fpm.conf    /usr/local/etc/php-fpm.d/www.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/opcache.ini     /usr/local/etc/php/conf.d/opcache.ini
COPY docker/entrypoint.sh   /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Writable directories
RUN mkdir -p \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/testing \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Render forwards external traffic to this port
EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
