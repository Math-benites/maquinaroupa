#!/bin/sh
set -eu

template=/usr/share/nginx/html/runtime-config.js.template
output=/usr/share/nginx/html/runtime-config.js

if [ -z "${VITE_SUPABASE_URL:-}" ] || [ -z "${VITE_SUPABASE_ANON_KEY:-}" ]; then
  echo "warning: runtime Supabase configuration is missing" >&2
fi

envsubst '${VITE_SUPABASE_URL} ${VITE_SUPABASE_ANON_KEY}' < "$template" > "$output"
rm -f "$template"

# A tag <script src="/runtime-config.js"> e injetada na RESPOSTA HTTP pelo
# sub_filter do nginx.conf, nao aqui - assim o index.html em disco nunca
# muda em runtime (o SlimToolkit compara o bundle antes/depois do build e
# acusava erro quando esse arquivo era editado apos o probe).
