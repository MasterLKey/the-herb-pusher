#!/usr/bin/env bash
# Production start script — sources secrets from /etc/herb-pusher-secrets.env
set -euo pipefail

SECRETS_FILE="/etc/herb-pusher-secrets.env"

if [ ! -f "$SECRETS_FILE" ]; then
  echo "ERROR: $SECRETS_FILE not found. Copy start.sh.secrets.example to $SECRETS_FILE and fill in values."
  exit 1
fi

# shellcheck source=/dev/null
source "$SECRETS_FILE"

# Non-secret config (also in secrets file but can be overridden here)
export POSTGRES_DB="${POSTGRES_DB:-herb_pusher}"
export POSTGRES_USER="${POSTGRES_USER:-herb_pusher_user}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://theherbpusher.com}"
export MEILISEARCH_HOST="${MEILISEARCH_HOST:-http://search:7700}"
export R2_BUCKET="${R2_BUCKET:-theherbpusher-media}"
export R2_ENDPOINT="${R2_ENDPOINT:-https://ef4c58ff9550a94aec11e81607fe7572.r2.cloudflarestorage.com}"

cd /opt/the_herb_pusher
git pull
docker compose -f docker-compose.prod.yml up -d --build
