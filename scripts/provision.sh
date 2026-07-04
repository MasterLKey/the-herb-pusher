#!/usr/bin/env bash
# The Herb Pusher — LXC provisioning script
# Run once on a fresh Ubuntu 24.04 container
set -euo pipefail

PROJECT="the_herb_pusher"
REPO="https://github.com/MasterLKey/the-herb-pusher.git"
INSTALL_DIR="/opt/${PROJECT}"
SERVICE_NAME="herb-pusher"
ENV_FILE="/etc/${SERVICE_NAME}.env"

echo "==> Updating system..."
apt-get update -y
apt-get upgrade -y

echo "==> Installing Docker..."
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

echo "==> Installing Infisical CLI..."
curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash
apt-get install -y infisical

echo "==> Installing Git..."
apt-get install -y git

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

export POSTGRES_PASSWORD=$(infisical secrets get POSTGRES_PASSWORD --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export PAYLOAD_SECRET=$(infisical secrets get PAYLOAD_SECRET --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export MEILISEARCH_MASTER_KEY=$(infisical secrets get MEILISEARCH_MASTER_KEY --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export MEILISEARCH_API_KEY=$(infisical secrets get MEILISEARCH_API_KEY --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export R2_ACCESS_KEY_ID=$(infisical secrets get R2_ACCESS_KEY_ID --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export R2_SECRET_ACCESS_KEY=$(infisical secrets get R2_SECRET_ACCESS_KEY --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')
export MAILERLITE_API_KEY=$(infisical secrets get MAILERLITE_API_KEY --projectId="$INFISICAL_PROJECT_ID" --plain --silent 2>/dev/null | tr -d '[:space:]')

cd /opt/the_herb_pusher
git pull
docker compose up -d --build
STARTEOF
chmod +x "${INSTALL_DIR}/start.sh"

echo "==> Writing systemd service..."
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
ExecStop=docker compose -f ${INSTALL_DIR}/docker-compose.yml down
WorkingDirectory=${INSTALL_DIR}

[Install]
WantedBy=multi-user.target
SERVICEEOF

systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"

echo ""
echo "==> Provisioning complete."
echo ""
echo "  Next steps:"
echo "  1. Edit ${ENV_FILE} — add your Infisical service token and project ID."
echo "  2. Edit ${INSTALL_DIR}/.env — add non-secret config (R2 bucket, site URL, etc.)."
echo "  3. Run: bash ${INSTALL_DIR}/start.sh"
echo "  4. Set up a Cloudflare Tunnel to expose port 3000 publicly."
echo ""
