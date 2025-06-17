#!/bin/bash

# Direct Deployment Script for Markdown Viewer
# This script provides a one-step deployment to any server

# Get domain from command line or use default
DOMAIN="${1:-kickshare.fun}"
echo "======================================================="
echo "  Deploying Markdown Viewer to $DOMAIN"
echo "======================================================="

# Set other variables
PORT=5000
MONGODB_DOCKER_NAME="markdown-mongodb"
APP_NAME="markdown-viewer"

# Make sure we're in the right directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Check requirements
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { 
    echo "Docker Compose is required but not installed. Trying to install it..."; 
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
}

# 2. Create .env file for Docker Compose
echo "Creating environment configuration..."
cat > .env << EOL
DOMAIN=$DOMAIN
PORT=$PORT
NODE_ENV=production
EOL

# 3. Create SSL directory
mkdir -p ./nginx/ssl

# 4. Check if MongoDB is already running
if docker ps -a | grep -q $MONGODB_DOCKER_NAME; then
    echo "MongoDB container already exists."
else
    echo "Setting up MongoDB container..."
    docker run --name $MONGODB_DOCKER_NAME -d -p 27017:27017 -v mongodb_data:/data/db mongo:latest
fi

# 5. Set up SSL certificates with certbot
if command -v certbot >/dev/null 2>&1; then
    echo "Setting up SSL certificates with certbot..."
    sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

    # Copy certificates to nginx ssl directory
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./nginx/ssl/
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./nginx/ssl/
    sudo chmod 644 ./nginx/ssl/*.pem
else
    echo "Certbot not found. Installing..."
    sudo apt update
    sudo apt install -y certbot
    
    # Run certbot to get certificates
    sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN
    
    # Copy certificates
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./nginx/ssl/
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./nginx/ssl/
    sudo chmod 644 ./nginx/ssl/*.pem
fi

# 6. Building application
echo "Building application..."
docker-compose build

# 7. Starting application
echo "Starting application..."
docker-compose up -d

# 8. Verify deployment
echo "Checking deployment status..."
if docker-compose ps | grep -q "Up"; then
    echo "======================================================="
    echo "  Deployment successful! Your application is now live at:"
    echo "  https://$DOMAIN"
    echo "======================================================="
    echo ""
    echo "To monitor logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
else
    echo "======================================================="
    echo "  Deployment encountered issues. Check logs with:"
    echo "  docker-compose logs"
    echo "======================================================="
fi
