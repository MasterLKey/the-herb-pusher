#!/usr/bin/env bash
# The Herb Pusher — LXC provisioning script
# Run once on a fresh Ubuntu 24.04 container
set -euo pipefail

PROJECT="the_herb_pusher"
REPO="https://github.com/MasterLKey/the-herb-pusher.git"
INSTALL_DIR="/opt/${PROJECT}"
SERVICE_NAME="herb-pusher"
ENV_FILE="/etc/${SERVICE_NAME}.env"

# Cloudflare credentials — passed as env vars at call time, not stored in this file.
# Usage: CF_ACCOUNT_ID=xxx CF_API_TOKEN=yyy bash provision.sh
CF_ACCOUNT_ID="${CF_ACCOUNT_ID:?CF_ACCOUNT_ID env var must be set}"
CF_API_TOKEN="${CF_API_TOKEN:?CF_API_TOKEN env var must be set}"
CF_DOMAIN="${CF_DOMAIN:-theherbpusher.com}"
TUNNEL_NAME="${TUNNEL_NAME:-herb-pusher}"

echo "==> Updating system..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git jq python3

echo "==> Installing Docker..."
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

echo "==> Installing Infisical CLI..."
curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash
apt-get install -y infisical

echo "==> Installing cloudflared..."
curl -L --output /tmp/cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i /tmp/cloudflared.deb
rm /tmp/cloudflared.deb

echo "==> Cloning repository..."
git clone "${REPO}" "${INSTALL_DIR}"

echo "==> Writing environment file (${ENV_FILE})..."
cat > "${ENV_FILE}" << 'ENVEOF'
INFISICAL_TOKEN=REPLACE_WITH_SERVICE_TOKEN
INFISICAL_PROJECT_ID=REPLACE_WITH_PROJECT_ID
ENVEOF
chmod 600 "${ENV_FILE}"
echo "  >> Edit ${ENV_FILE} with the real Infisical service token and project ID."

echo "==> Writing start.sh..."
cat > "${INSTALL_DIR}/start.sh" << 'STARTEOF'
#!/usr/bin/env bash
set -euo pipefail
source /etc/herb-pusher.env

export POSTGRES_DB=herb_pusher
export POSTGRES_USER=herb_pusher_user
export NEXT_PUBLIC_SITE_URL=https://theherbpusher.com
export MEILISEARCH_HOST=http://search:7700
export R2_BUCKET=theherbpusher-media
export R2_ENDPOINT=https://ef4c58ff9550a94aec11e81607fe7572.r2.cloudflarestorage.com

export POSTGRES_PASSWORD=$(infisical secrets get POSTGRES_PASSWORD \
  --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export PAYLOAD_SECRET=$(infisical secrets get PAYLOAD_SECRET \
  --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export MEILISEARCH_MASTER_KEY=$(infisical secrets get MEILISEARCH_MASTER_KEY \
  --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export MEILISEARCH_API_KEY=$(infisical secrets get MEILISEARCH_API_KEY \
  --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export R2_ACCESS_KEY_ID=$(infisical secrets get R2_ACCESS_KEY_ID \
  --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export R2_SECRET_ACCESS_KEY=$(infisical secrets get R2_SECRET_ACCESS_KEY \
  --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export MAILERLITE_API_KEY=$(infisical secrets get MAILERLITE_API_KEY \
  --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export MAILERLITE_GROUP_ID=$(infisical secrets get MAILERLITE_GROUP_ID \
  --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')

cd /opt/the_herb_pusher
git pull
docker compose -f docker-compose.prod.yml up -d --build
STARTEOF
chmod +x "${INSTALL_DIR}/start.sh"

echo "==> Writing systemd service (herb-pusher)..."
cat > "/etc/systemd/system/${SERVICE_NAME}.service" << SERVICEEOF
[Unit]
Description=The Herb Pusher
After=network-online.target docker.service
Wants=network-online.target
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
EnvironmentFile=${ENV_FILE}
ExecStart=${INSTALL_DIR}/start.sh
ExecStop=docker compose -f ${INSTALL_DIR}/docker-compose.prod.yml down
WorkingDirectory=${INSTALL_DIR}

[Install]
WantedBy=multi-user.target
SERVICEEOF

systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"

# ---------------------------------------------------------------------------
# Cloudflare Tunnel — create via API (no browser auth needed)
# ---------------------------------------------------------------------------
echo "==> Creating Cloudflare Tunnel via API..."

TUNNEL_RESPONSE=$(curl -s -X POST \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/cfd_tunnel" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data "{\"name\":\"${TUNNEL_NAME}\",\"config_src\":\"cloudflare\"}")

TUNNEL_SUCCESS=$(echo "$TUNNEL_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))")

if [ "$TUNNEL_SUCCESS" != "True" ]; then
  echo "  !! Tunnel creation failed. Response: ${TUNNEL_RESPONSE}"
  echo "  >> Skipping tunnel setup — configure manually via Cloudflare dashboard."
else
  TUNNEL_ID=$(echo "$TUNNEL_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['id'])")
  TUNNEL_TOKEN=$(echo "$TUNNEL_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['token'])")

  echo "  >> Tunnel created: ${TUNNEL_ID}"

  # Configure tunnel ingress via API
  echo "==> Configuring tunnel ingress..."
  curl -s -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/cfd_tunnel/${TUNNEL_ID}/configurations" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{
      \"config\": {
        \"ingress\": [
          {\"hostname\":\"${CF_DOMAIN}\",\"service\":\"http://localhost:3000\"},
          {\"service\":\"http_status:404\"}
        ]
      }
    }" > /dev/null

  # Create DNS CNAME pointing to tunnel
  echo "==> Creating DNS record..."
  ZONE_RESPONSE=$(curl -s \
    "https://api.cloudflare.com/client/v4/zones?name=${CF_DOMAIN}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}")
  ZONE_ID=$(echo "$ZONE_RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['result'][0]['id']) if d.get('result') else print('')")

  if [ -n "$ZONE_ID" ]; then
    curl -s -X POST \
      "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
      -H "Authorization: Bearer ${CF_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "{
        \"type\":\"CNAME\",
        \"name\":\"${CF_DOMAIN}\",
        \"content\":\"${TUNNEL_ID}.cfargotunnel.com\",
        \"proxied\":true,
        \"ttl\":1
      }" > /dev/null
    echo "  >> DNS CNAME created: ${CF_DOMAIN} -> ${TUNNEL_ID}.cfargotunnel.com"
  else
    echo "  !! Could not resolve zone ID for ${CF_DOMAIN} — add DNS manually."
  fi

  # Write tunnel token to env file for the service
  echo "CLOUDFLARE_TUNNEL_TOKEN=${TUNNEL_TOKEN}" >> "${ENV_FILE}"

  # Install cloudflared as a systemd service using token (no login needed)
  echo "==> Installing cloudflared as a service..."
  cloudflared service install --token "${TUNNEL_TOKEN}"
  systemctl enable cloudflared
  systemctl start cloudflared
  echo "  >> cloudflared running. Tunnel ID: ${TUNNEL_ID}"
fi

echo ""
echo "==> Provisioning complete."
echo ""
echo "  Next steps:"
echo "  1. Edit ${ENV_FILE} — add your Infisical service token and project ID."
echo "  2. Run: bash ${INSTALL_DIR}/start.sh"
echo ""
echo "  Infisical secrets to add (production environment):"
echo "    POSTGRES_PASSWORD      — strong random password"
echo "    PAYLOAD_SECRET         — strong random string (32+ chars)"
echo "    MEILISEARCH_MASTER_KEY — strong random string"
echo "    MEILISEARCH_API_KEY    — same value as MEILISEARCH_MASTER_KEY"
echo "    R2_ACCESS_KEY_ID       — 72788a308a22395fede46bc192291bcd"
echo "    R2_SECRET_ACCESS_KEY   — (from Cloudflare R2 API token)"
echo "    MAILERLITE_API_KEY     — (optional)"
echo "    MAILERLITE_GROUP_ID    — (optional)"
echo ""
