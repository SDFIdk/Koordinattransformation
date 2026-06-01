# rootless nginx serving the vite spa. runtime config placeholders in
# index.html are filled by envsubst at container start; the bundle has
# no env-specific strings

# --- BUILDER ---

FROM node:24-alpine AS builder

WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build


# --- RUNTIME ---

FROM nginxinc/nginx-unprivileged:1.27-alpine

USER root

RUN apk add --no-cache gettext tzdata \
 && cp /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime \
 && echo "Europe/Copenhagen" > /etc/timezone \
 && apk del tzdata

# baked spa; entrypoint script copies it to the writable emptyDir at runtime
COPY --chown=101:101 --from=builder /src/dist /srv/static-source

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/SecHeaders.conf /etc/nginx/SecHeaders.conf

COPY docker/40-envsubst-config.sh /docker-entrypoint.d/40-envsubst-config.sh
RUN chmod +x /docker-entrypoint.d/40-envsubst-config.sh

USER 101

EXPOSE 8080
