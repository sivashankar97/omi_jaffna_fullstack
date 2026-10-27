#!/usr/bin/env bash
# SSH tunnel: Mac localhost:5433 → VPS Postgres (127.0.0.1:5432).
# Keep this terminal open while developing. Both teammates use the same VPS DB.
#
# Usage:
#   npm run db:tunnel -- user@VPS_IP
# Then in another terminal: copy api/.env.shared.example → api/.env and npm run dev
set -euo pipefail

TARGET="${1:-}"
LOCAL_PORT="${2:-5433}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: npm run db:tunnel -- user@VPS_IP [localPort]"
  exit 1
fi

echo "Tunnel: 127.0.0.1:${LOCAL_PORT} → ${TARGET}:127.0.0.1:5432"
echo "Point DATABASE_URL at localhost:${LOCAL_PORT} (see api/.env.shared.example)"
echo "Ctrl+C stops the tunnel."
exec ssh -N -L "${LOCAL_PORT}:127.0.0.1:5432" "$TARGET"
