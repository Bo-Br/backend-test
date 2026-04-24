#!/bin/bash

set -e

APP_DIR="/var/www/backend-test"
SERVICE_NAME="lusi"
CURRENT_USER=$(whoami)
NODE_VERSION="20"

echo "[0/6] Updating apt..."
sudo apt-get update -y

echo "[1/6] Removing conflicting Node installs..."
sudo apt-get remove -y nodejs npm || true

echo "[2/6] Installing Node.js ${NODE_VERSION} (NodeSource)..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "[3/6] Verifying installation..."
node -v
npm -v

echo "[4/6] Checking app directory..."
if [ ! -d "$APP_DIR" ]; then
    echo "ERROR: $APP_DIR does not exist"
    exit 1
fi

echo "[5/6] Fixing permissions..."
cd $APP_DIR
sudo chown -R $CURRENT_USER:$CURRENT_USER .
chmod -R 755 .

echo "[6/6] Installing & building..."
npm install
npm run build

echo "[7/6] Creating systemd service..."

sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null <<EOF
[Unit]
Description=LUSI RPG Dashboard
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
User=$CURRENT_USER

[Install]
WantedBy=multi-user.target
EOF

echo "[8/6] Enabling and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable ${SERVICE_NAME}
sudo systemctl restart ${SERVICE_NAME}

echo "Done."
echo "Server IP:"
hostname -I