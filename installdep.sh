#!/bin/bash

set -e

SERVICE_PATH="/etc/systemd/system/leveling-up.service"
NGINX_AVAILABLE="/etc/nginx/sites-available/leveling-up"
NGINX_ENABLED="/etc/nginx/sites-enabled/leveling-up"
APP_DIR="/var/www/leveling-up"

echo "Creating systemd service..."

sudo bash -c "cat > $SERVICE_PATH" << 'EOF'
[Unit]
Description=Leveling-Up Node.js Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/leveling-up
ExecStart=/usr/bin/npx tsx server.ts
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo "Creating Nginx config..."

sudo bash -c "cat > $NGINX_AVAILABLE" << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "Setting permissions..."

sudo chown -R www-data:www-data $APP_DIR
sudo chmod 664 $APP_DIR/data.json || true

echo "Enabling services..."

sudo systemctl daemon-reload
sudo systemctl enable leveling-up
sudo systemctl start leveling-up

echo "Linking Nginx site..."

if [ ! -L "$NGINX_ENABLED" ]; then
    sudo ln -s $NGINX_AVAILABLE $NGINX_ENABLED
fi

echo "Testing Nginx config..."

sudo nginx -t

echo "Restarting Nginx..."

sudo systemctl restart nginx

echo "Done."