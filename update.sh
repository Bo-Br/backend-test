#!/bin/bash
set -e

APP_DIR="/var/www/backend-test"
SERVICE_NAME="lusi"
CURRENT_USER=$(whoami)
NODE_VERSION="22"

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
