#!/bin/zsh
set -e
cd /Users/anu/Projects/omi-jaffna-cms
source .env
export PGPASSWORD="$POSTGRES_PASSWORD"
exec /opt/homebrew/opt/postgresql@16/bin/psql -h localhost -U omi_admin -d omi_jaffna
