#!/bin/bash

# Script to obtain SSL certificate using certbot with alternative methods
# Usage: ./get-cert.sh yourdomain.com

# Get domain from command line or use default
DOMAIN="${1:-kickshare.fun}"
echo "======================================================="
echo "  Obtaining SSL Certificate for $DOMAIN"
echo "======================================================="

# Create SSL directory if it doesn't exist
mkdir -p ./nginx/ssl

# Function to copy certificates to nginx ssl directory
copy_certificates() {
    echo "Copying certificates to nginx ssl directory..."
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./nginx/ssl/
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./nginx/ssl/
    sudo chmod 644 ./nginx/ssl/*.pem
    echo "SSL certificates installed successfully!"
}

# Check if certbot is installed
if ! command -v certbot >/dev/null 2>&1; then
    echo "Certbot not found. Installing..."
    sudo apt update
    sudo apt install -y certbot
fi

# Create temporary webroot directory
mkdir -p ./certbot-webroot

echo "Attempting to obtain certificate using standalone mode on port 78..."
if sudo certbot certonly --standalone --http-01-port 78 -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN; then
    copy_certificates
    exit 0
fi

echo "Standalone method failed. Trying webroot method..."
echo "Please ensure your web server is configured to serve files from ./certbot-webroot"
echo "For nginx, add this location block to your server configuration:"
echo "location /.well-known/acme-challenge/ {"
echo "    root /path/to/certbot-webroot;"
echo "}"
echo "Then press Enter to continue..."
read -p "Press Enter to continue..."

if sudo certbot certonly --webroot -w ./certbot-webroot -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN; then
    copy_certificates
    exit 0
fi

echo "Webroot method failed. Trying manual DNS challenge..."
echo "This will require you to add TXT records to your DNS configuration."
echo "Follow the instructions provided by certbot."
echo "Then press Enter to continue..."
read -p "Press Enter to continue..."

if sudo certbot certonly --manual --preferred-challenges dns -d $DOMAIN -d www.$DOMAIN --agree-tos -m admin@$DOMAIN; then
    copy_certificates
    exit 0
fi

echo "All certificate obtaining methods failed. Please check your domain configuration and try again."
exit 1
