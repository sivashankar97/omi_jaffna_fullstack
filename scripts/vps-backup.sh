#!/usr/bin/env bash
# Runs ON the VPS (cron, 00:00 Sri Lanka time): dumps the database (content, users and media files),
# encrypts it with AES-256 (gpg, passphrase file) and uploads it to Google Drive with rclone.
# Old backups beyond BACKUP_KEEP_DAYS are deleted from Drive.
# One-time setup: rclone remote named "gdrive" and the passphrase file (see notes/Project overview.md).
# Restore: gpg -d omi-db-DATE.sql.gz.gpg | gunzip | psql …
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${BACKUP_REMOTE:-gdrive:OMI Jaffna backups}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-30}"
PASS_FILE="${BACKUP_PASSPHRASE_FILE:-/root/.omi-backup-passphrase}"

# The dump holds private Father photos and documents: never upload it unencrypted.
if [[ ! -s "$PASS_FILE" ]]; then
  echo "$(date -u +%FT%TZ) backup FAILED: passphrase file $PASS_FILE missing or empty" >&2
  exit 1
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
file="$tmp/omi-db-$(TZ=Asia/Colombo date +%F).sql.gz"

cd "$ROOT/deploy/vps"
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --clean --if-exists' | gzip -9 > "$file"
gzip -t "$file"

gpg --batch --yes --quiet --pinentry-mode loopback --passphrase-file "$PASS_FILE" \
  --symmetric --cipher-algo AES256 --output "$file.gpg" "$file"
gpg --batch --quiet --pinentry-mode loopback --passphrase-file "$PASS_FILE" --decrypt "$file.gpg" | gzip -t

rclone copy "$file.gpg" "$REMOTE"
rclone delete "$REMOTE" --min-age "${KEEP_DAYS}d" --include 'omi-db-*.sql.gz' --include 'omi-db-*.sql.gz.gpg'

echo "$(date -u +%FT%TZ) backup ok: $(basename "$file.gpg") $(du -h "$file.gpg" | cut -f1) (encrypted)"
