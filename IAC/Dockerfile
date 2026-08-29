FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY IAC/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /app/dist /usr/share/nginx/html
COPY --chown=nginx:nginx IAC/docker/runtime-config.js.template /usr/share/nginx/html/runtime-config.js.template
COPY --chmod=755 IAC/docker/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh

# A imagem base ja roda como nginx (nao-root) por padrao, entao nem COPY
# --chown nem RUN chown conseguem mudar o dono do diretorio pre-existente
# (e root:root). Precisa de USER root temporario pra isso.
USER root
RUN chown nginx:nginx /usr/share/nginx/html
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1
