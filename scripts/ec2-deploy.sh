#!/usr/bin/env bash

set -euo pipefail


APP_DIR="${1:-/opt/incident-center}"
WEB_DIR="${2:-/var/www/incident-center}"


cd "$APP_DIR"


echo "Installing dependency"

npm ci


echo "Building application"

npm run build


echo "Deploy frontend"

sudo mkdir -p "$WEB_DIR"

sudo rm -rf "$WEB_DIR"/*

sudo cp -r apps/web/dist/* "$WEB_DIR"

sudo chmod -R 755 "$WEB_DIR"


echo "Starting backend"

if pm2 describe incident-api >/dev/null 2>&1; then

  pm2 restart incident-api

else

  pm2 start "npm run start:api" --name incident-api

fi


pm2 save


echo "Configure nginx"

sudo tee /etc/nginx/sites-available/incident-center > /dev/null << 'EOF'
server {

    listen 80;

    server_name _;


    root /var/www/incident-center;

    index index.html;


    location / {

        try_files $uri /index.html;

    }


    location /api {

        proxy_pass http://localhost:5001;

        proxy_http_version 1.1;

        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;

    }

}
EOF


sudo ln -sf \
/etc/nginx/sites-available/incident-center \
/etc/nginx/sites-enabled/incident-center


sudo rm -f /etc/nginx/sites-enabled/default


sudo nginx -t

sudo systemctl reload nginx


echo "Deployment completed"

pm2 status