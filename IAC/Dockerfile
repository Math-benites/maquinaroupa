FROM node:24-alpine AS build

WORKDIR /app

ARG SUPABASE_URL
ARG SUPABASE_ANON

COPY package*.json ./
RUN npm ci

COPY . .
RUN VITE_SUPABASE_URL=$SUPABASE_URL VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY IAC/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080
