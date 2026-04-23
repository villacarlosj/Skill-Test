# ─── Stage 1: Build (needs both PHP and Node) ────────────────────────────────
FROM php:8.3-cli-bookworm AS builder

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev libzip-dev libicu-dev libonig-dev libxml2-dev \
        unzip git curl \
    && docker-php-ext-install pdo pdo_pgsql zip intl mbstring bcmath xml \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Composer binary
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# ── PHP deps ──────────────────────────────────────────────────────────────────
COPY composer.json composer.lock ./
RUN COMPOSER_MEMORY_LIMIT=-1 composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --ignore-platform-reqs

# ── Copy full source ──────────────────────────────────────────────────────────
COPY . .

# Optimize autoloader NOW that app source exists
RUN COMPOSER_MEMORY_LIMIT=-1 composer dump-autoload \
    --optimize \
    --no-dev \
    --ignore-platform-reqs


# ── Bootstrap for artisan ─────────────────────────────────────────────────────
# Use a throw-away key so artisan can boot — Render's real APP_KEY is used at runtime
RUN cp .env.example .env \
    && php artisan key:generate --force

# Generate Wayfinder TypeScript route files (reads PHP routes, no DB needed)
# Fall back gracefully if the command name differs in this wayfinder version
RUN php artisan wayfinder:generate || php artisan route:cache --no-ansi || true

# ── Frontend build ────────────────────────────────────────────────────────────
RUN npm ci && npm run build

# Remove the throw-away .env so it doesn't shadow Render's env vars at runtime
RUN rm -f .env

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS runtime

# Runtime packages
RUN apk add --no-cache \
        nginx supervisor \
        postgresql-dev icu-dev libzip-dev oniguruma-dev libxml2-dev \
        curl \
    && docker-php-ext-install \
        pdo pdo_pgsql pgsql zip intl mbstring bcmath opcache \
    && rm -rf /var/cache/apk/*

WORKDIR /var/www/html

# Copy app (excludes node_modules — not needed at runtime)
COPY --from=builder /app/app             ./app
COPY --from=builder /app/bootstrap       ./bootstrap
COPY --from=builder /app/config          ./config
COPY --from=builder /app/database        ./database
COPY --from=builder /app/public          ./public
COPY --from=builder /app/resources       ./resources
COPY --from=builder /app/routes          ./routes
COPY --from=builder /app/storage         ./storage
COPY --from=builder /app/vendor          ./vendor
COPY --from=builder /app/artisan         ./artisan
COPY --from=builder /app/composer.json   ./composer.json

# Runtime config files
COPY docker/nginx.conf       /etc/nginx/http.d/default.conf
COPY docker/php-fpm.conf     /usr/local/etc/php-fpm.d/www.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/opcache.ini      /usr/local/etc/php/conf.d/opcache.ini
COPY docker/entrypoint.sh    /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Ensure all required storage subdirs exist (including app/public for storage:link)
RUN mkdir -p \
        storage/app/public \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/testing \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
