#!/usr/bin/env bash
set -euo pipefail


APP_DIR="${1:-/opt/incident-center}"
WEB_DIR="${2:-/var/www/incident-center}"
APP_USER="${3:-ubuntu}"
NODE_MAJOR="22"

echo "updating packages"
sudo apt-get update -y

echo "Installing dependencies"

sudo apt-get install -y \
      curl \
      nginx \
      rsync \
      unzip \
      ca-certificates

echo "Installing node.js ..."

if ! command -v node > /dev/null 2>&1 || ! node -v | grep -q "^v${NODE_MAJOR}"; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | sudo -E bash -
  sudo apt install -y nodejs
fi

echo "Installing pm2"

if ! command -v pm2 >/dev/null 2>&1; then
    sudo npm install -g pm2
fi

echo "Creating directory"

sudo mkdir -p "$APP_DIR"
sudo mkdir -p "$WEB_DIR"
sudo chown -R "$APP_USER:$APP_USER" "$APP_DIR"
sudo chmod -R 755 "$WEB_DIR"

echo "Enabling nginx"

sudo systemctl enable nginx
sudo systemctl start nginx

echo "Bootstrap completed"

node -v
npm -v
pm2 -v
nginx -v