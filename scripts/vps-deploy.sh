#!/usr/bin/env bash
# Deploy current project to Hostinger VPS from your Mac.
# (GitHub push auto-deploy is off — this is the normal publish path.)
#
# Usage:
#   npm run vps:deploy -- omi-vps
#   npm run vps:deploy -- root@179.197.250.19
#   npm run vps:deploy -- root@179.197.250.19:/root/omi-jaffna-cms
set -euo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: npm run vps:deploy -- omi-vps"
  echo "   or: npm run vps:deploy -- user@VPS_IP[/path]"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_HOST="${TARGET%%:*}"
REMOTE_DIR="${TARGET#*:}"
if [[ "$REMOTE_DIR" == "$TARGET" ]]; then
  # SSH Host "omi-vps" and root@IP both land in /root/omi-jaffna-cms on this VPS
  REMOTE_DIR="/root/omi-jaffna-cms"
fi

RSYNC_RSH="ssh"
# Prefer the project key when targeting omi-vps or the known IP (SSH config may already set this)
if [[ "$REMOTE_HOST" == "omi-vps" ]] || [[ "$REMOTE_HOST" == *"179.197.250.19" ]]; then
  if [[ -f "${HOME}/.ssh/omi_vps" ]]; then
    RSYNC_RSH="ssh -i ${HOME}/.ssh/omi_vps -o IdentitiesOnly=yes"
  fi
fi

echo "==> Syncing repo → $REMOTE_HOST:$REMOTE_DIR"
# Keep in sync with .github/workflows/deploy-vps.yml excludes
rsync -az --delete \
  -e "$RSYNC_RSH" \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '**/node_modules' \
  --exclude 'site/.next' \
  --exclude 'api/uploads' \
  --exclude 'api/.env' \
  --exclude 'LOCAL-LOGIN.txt' \
  --exclude 'VPS-LOGIN.txt' \
  --exclude 'deploy/vps/.env' \
  --exclude 'notes/.obsidian' \
  --exclude '.DS_Store' \
  "$ROOT/" "$REMOTE_HOST:$REMOTE_DIR/"

echo "==> Ensuring deploy/vps/.env exists on server"
$RSYNC_RSH "$REMOTE_HOST" "mkdir -p $REMOTE_DIR/deploy/vps && if [ ! -f $REMOTE_DIR/deploy/vps/.env ]; then cp $REMOTE_DIR/deploy/vps/.env.example $REMOTE_DIR/deploy/vps/.env; echo 'CREATED deploy/vps/.env — edit secrets then re-run deploy'; exit 2; fi"

echo "==> Building & restarting stack on VPS"
$RSYNC_RSH "$REMOTE_HOST" "cd $REMOTE_DIR && bash scripts/vps-up.sh"

DISPLAY_HOST="$REMOTE_HOST"
if [[ "$DISPLAY_HOST" == "omi-vps" ]]; then
  DISPLAY_HOST="179.197.250.19"
else
  DISPLAY_HOST="$(echo "$REMOTE_HOST" | sed 's/.*@//')"
fi

echo ""
echo "Deploy finished."
echo "  Open http://${DISPLAY_HOST}"
echo "  CMS  http://${DISPLAY_HOST}/admin"
echo ""
echo "Local shared DB (both Macs):"
echo "  npm run db:tunnel -- omi-vps"
echo "  then use api/.env against localhost:5433 (see api/.env.shared.example)"
