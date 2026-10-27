#!/usr/bin/env bash
# Build and start the stack on the VPS (run on the server inside the repo).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/deploy/vps"

if [[ ! -f .env ]]; then
  echo "Missing deploy/vps/.env — copy from .env.example and fill secrets."
  exit 1
fi

# shellcheck disable=SC1091
set -a
source .env
set +a

echo "==> Building images (first time is slow)"
docker compose build

echo "==> Starting db + api + site + nginx"
docker compose up -d

echo "==> Waiting for API health"
for i in $(seq 1 40); do
  if curl -fsS "http://127.0.0.1/api/health" >/dev/null 2>&1; then
    echo "API healthy"
    break
  fi
  sleep 3
  if [[ "$i" -eq 40 ]]; then
    echo "API did not become healthy — check: docker compose -f $ROOT/deploy/vps/docker-compose.yml logs api"
    exit 1
  fi
done

echo "==> Running DB migrations + admin seed (idempotent)"
docker compose exec -T api node scripts/migrate.js
docker compose exec -T api node scripts/seed.js || true

echo ""
echo "Live:"
echo "  Site/CMS:  http://$(curl -fsS ifconfig.me 2>/dev/null || echo YOUR_VPS_IP)"
echo "  CMS path:  /admin"
echo "  Health:    /api/health"
