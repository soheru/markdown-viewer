#!/bin/bash

# Deployment script for kickshare.fun Markdown Viewer
# This script automates the deployment process for the Markdown Viewer application

echo "======================================================="
echo "  Deploying Markdown Viewer to kickshare.fun"
echo "======================================================="

# Set variables
DOMAIN="${DOMAIN:-kickshare.fun}"
APP_DIR="/var/www/$DOMAIN"
GIT_REPO="https://github.com/soheru/markdown-viewer.git"  # Replace with your actual repository
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
ENV_FILE="$APP_DIR/server/.env"

# 1. Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# 2. Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# 3. Install dependencies if not already installed
echo "Installing dependencies..."
apt install -y nginx certbot python3-certbot-nginx git nodejs npm mongodb

# 4. Clone or update repository
if [ -d "$APP_DIR" ]; then
    echo "Updating existing repository..."
    cd $APP_DIR
    git pull
else
    echo "Cloning repository..."
    git clone $GIT_REPO $APP_DIR
    cd $APP_DIR
fi

# 5. Configure environment
echo "Configuring environment variables..."
cat > $ENV_FILE << EOL
MONGODB_URI=mongodb://localhost:27017/markdown-app
PORT=5000
NODE_ENV=production
DOMAIN=$DOMAIN
EOL

# 6. Install dependencies and build client
echo "Installing dependencies and building client..."
cd $APP_DIR/client
npm install
npm run build

# 7. Install server dependencies
echo "Installing server dependencies..."
cd $APP_DIR/server
npm install

# 8. Configure Nginx
echo "Configuring Nginx..."
cat > $NGINX_CONF << EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# 9. Enable site and restart Nginx
echo "Enabling site and restarting Nginx..."
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
systemctl restart nginx

# 10. Set up SSL with Certbot
echo "Setting up SSL with Let's Encrypt..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m your-email@example.com

# 11. Set up systemd service for Node.js application
echo "Setting up systemd service..."
cat > /etc/systemd/system/markdown-viewer.service << EOL
[Unit]
Description=Markdown Viewer Node.js Application
After=network.target mongodb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR/server
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

# 12. Start and enable the service
echo "Starting and enabling the service..."
systemctl daemon-reload
systemctl start markdown-viewer
systemctl enable markdown-viewer

echo "======================================================="
echo "  Deployment complete! Your application is now live at:"
echo "  https://$DOMAIN"
echo "======================================================="
