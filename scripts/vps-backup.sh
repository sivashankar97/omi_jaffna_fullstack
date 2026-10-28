#!/usr/bin/env bash
# Runs ON the VPS (cron, 00:00 Sri Lanka time): dumps the database (content, users and media files)
# and uploads it to Google Drive with rclone. Old backups beyond BACKUP_KEEP_DAYS are deleted from Drive.
# One-time setup: rclone remote named "gdrive" (see notes/Project overview.md).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${BACKUP_REMOTE:-gdrive:OMI Jaffna backups}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-30}"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
file="$tmp/omi-db-$(TZ=Asia/Colombo date +%F).sql.gz"

cd "$ROOT/deploy/vps"
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --clean --if-exists' | gzip -9 > "$file"
gzip -t "$file"

rclone copy "$file" "$REMOTE"
rclone delete "$REMOTE" --min-age "${KEEP_DAYS}d" --include 'omi-db-*.sql.gz'

echo "$(date -u +%FT%TZ) backup ok: $(basename "$file") $(du -h "$file" | cut -f1)"
