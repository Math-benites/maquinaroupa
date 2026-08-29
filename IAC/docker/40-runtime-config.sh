#!/bin/sh
set -eu

template=/usr/share/nginx/html/runtime-config.js.template
output=/usr/share/nginx/html/runtime-config.js

if [ -z "${VITE_SUPABASE_URL:-}" ] || [ -z "${VITE_SUPABASE_ANON_KEY:-}" ]; then
  echo "warning: runtime Supabase configuration is missing" >&2
fi

envsubst '${VITE_SUPABASE_URL} ${VITE_SUPABASE_ANON_KEY}' < "$template" > "$output"
rm -f "$template"
