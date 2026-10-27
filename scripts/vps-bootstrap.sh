#!/usr/bin/env bash
# First-time setup ON the Hostinger VPS (Ubuntu).
# Usage (from your Mac):
#   scp scripts/vps-bootstrap.sh user@VPS_IP:~/
#   ssh user@VPS_IP 'bash ~/vps-bootstrap.sh'
set -euo pipefail

if [[ "$(id -u)" -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo"
fi

echo "==> Installing Docker + Compose plugin"
$SUDO apt-get update -y
$SUDO apt-get install -y ca-certificates curl git ufw
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | $SUDO sh
  $SUDO usermod -aG docker "$USER" || true
fi
$SUDO systemctl enable --now docker

echo "==> Firewall: allow SSH + HTTP (add 443 later for HTTPS)"
$SUDO ufw allow OpenSSH
$SUDO ufw allow 80/tcp
$SUDO ufw --force enable || true

APP_DIR="${APP_DIR:-$HOME/omi-jaffna-cms}"
echo "==> App directory: $APP_DIR"
if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "Clone your repo into $APP_DIR first, e.g.:"
  echo "  git clone YOUR_GIT_URL $APP_DIR"
  exit 1
fi

cd "$APP_DIR"
mkdir -p deploy/vps
if [[ ! -f deploy/vps/.env ]]; then
  cp deploy/vps/.env.example deploy/vps/.env
  echo ""
  echo "EDIT deploy/vps/.env now:"
  echo "  - POSTGRES_PASSWORD, JWT_SECRET, ADMIN_*"
  echo "  - FRONTEND_ORIGIN=http://YOUR_PUBLIC_IP"
  echo "Then run:  cd $APP_DIR && npm run vps:up   (or bash scripts/vps-up.sh)"
  exit 0
fi

bash scripts/vps-up.sh
echo "Bootstrap done. Open http://YOUR_PUBLIC_IP"
