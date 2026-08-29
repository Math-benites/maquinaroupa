#!/bin/sh
set -eu

template=/usr/share/nginx/html/runtime-config.js.template
output=/usr/share/nginx/html/runtime-config.js
index=/usr/share/nginx/html/index.html

if [ -z "${VITE_SUPABASE_URL:-}" ] || [ -z "${VITE_SUPABASE_ANON_KEY:-}" ]; then
  echo "warning: runtime Supabase configuration is missing" >&2
fi

envsubst '${VITE_SUPABASE_URL} ${VITE_SUPABASE_ANON_KEY}' < "$template" > "$output"
rm -f "$template"

# O index.html buildado (usado tambem no deploy estatico via Cloudflare
# Workers, que nao roda esse entrypoint) nao referencia runtime-config.js -
# senao la a tag apontaria pra um arquivo inexistente. So injeta a tag aqui,
# runtime, depois de <head> pra rodar antes do script type=module (deferred).
sed -i 's#<head>#<head><script src="/runtime-config.js"></script>#' "$index"
