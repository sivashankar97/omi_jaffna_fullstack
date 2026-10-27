#!/usr/bin/env bash
# Deploy current project to Hostinger VPS from your Mac.
# Usage:
#   npm run vps:deploy -- root@203.0.113.10
#   npm run vps:deploy -- ubuntu@203.0.113.10:/home/ubuntu/omi-jaffna-cms
set -euo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: npm run vps:deploy -- user@VPS_IP"
  echo "   or: npm run vps:deploy -- user@VPS_IP:/path/to/omi-jaffna-cms"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_HOST="${TARGET%%:*}"
REMOTE_DIR="${TARGET#*:}"
if [[ "$REMOTE_DIR" == "$TARGET" ]]; then
  REMOTE_DIR="~/omi-jaffna-cms"
fi

echo "==> Syncing repo → $REMOTE_HOST:$REMOTE_DIR"
# Exclude local secrets and heavy/dev-only paths
rsync -az --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '**/node_modules' \
  --exclude 'site/.next' \
  --exclude 'api/uploads' \
  --exclude 'api/.env' \
  --exclude 'LOCAL-LOGIN.txt' \
  --exclude 'deploy/vps/.env' \
  --exclude '.DS_Store' \
  "$ROOT/" "$REMOTE_HOST:$REMOTE_DIR/"

echo "==> Ensuring deploy/vps/.env exists on server"
ssh "$REMOTE_HOST" "mkdir -p $REMOTE_DIR/deploy/vps && if [ ! -f $REMOTE_DIR/deploy/vps/.env ]; then cp $REMOTE_DIR/deploy/vps/.env.example $REMOTE_DIR/deploy/vps/.env; echo 'CREATED deploy/vps/.env — edit secrets then re-run deploy'; exit 2; fi"

echo "==> Building & restarting stack on VPS"
ssh "$REMOTE_HOST" "cd $REMOTE_DIR && bash scripts/vps-up.sh"

echo ""
echo "Deploy finished."
echo "  Open http://$(echo "$REMOTE_HOST" | sed 's/.*@//')"
echo "  CMS  http://$(echo "$REMOTE_HOST" | sed 's/.*@//')/admin"
echo ""
echo "Local shared DB (both Macs):"
echo "  npm run db:tunnel -- $REMOTE_HOST"
echo "  then use api/.env.shared (see api/.env.shared.example)"
