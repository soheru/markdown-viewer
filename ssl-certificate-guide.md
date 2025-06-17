# SSL Certificate Installation Guide

This guide explains how to install SSL certificates for your Markdown Viewer application when you encounter port conflicts.

## Common Issues

When running certbot or other SSL certificate tools, you may encounter this error:

```
Could not bind TCP port 80 because it is already in use by another process on this system (such as a web server).
```

This happens because the standard HTTP challenge for Let's Encrypt requires temporary access to port 80 to verify domain ownership.

## Solutions

### 1. Use an Alternative Port (Recommended)

In the `deploy-direct.sh` script, we've updated the certbot command to use port 78 instead of port 80:

```bash
sudo certbot certonly --standalone --http-01-port 78 -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN
```

### 2. Use the Webroot Method

The webroot method doesn't require stopping your web server or using a separate port:

1. Create a directory for the ACME challenge:
   ```bash
   mkdir -p /var/www/certbot
   ```

2. Add this location block to your Nginx configuration:
   ```nginx
   location /.well-known/acme-challenge/ {
       root /var/www/certbot;
   }
   ```

3. Run certbot with the webroot plugin:
   ```bash
   sudo certbot certonly --webroot -w /var/www/certbot -d yourdomain.com --agree-tos -m admin@yourdomain.com
   ```

### 3. Use DNS Challenge

If HTTP validation is problematic, use DNS validation instead:

```bash
sudo certbot certonly --manual --preferred-challenges dns -d yourdomain.com --agree-tos -m admin@yourdomain.com
```

This will prompt you to create a TXT record in your DNS settings to prove domain ownership.

### 4. Temporarily Stop Services

If possible, temporarily stop services using port 80:

```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d yourdomain.com --agree-tos -m admin@yourdomain.com
sudo systemctl start nginx
```

## Manual Certificate Installation

If you've obtained certificates using any method, place them in the right locations:

1. Copy fullchain.pem and privkey.pem to your nginx/ssl directory:
   ```bash
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/
   sudo chmod 644 ./nginx/ssl/*.pem
   ```

2. Restart Nginx to apply the new certificates:
   ```bash
   docker-compose restart nginx
   ```

## For Windows Users

For Windows users, consider:

1. Using [Win-ACME](https://www.win-acme.com/) client
2. Using DNS validation instead of HTTP validation
3. Using a self-signed certificate for testing
4. Using a certificate from a trusted certificate authority

## Testing Your SSL Configuration

After installing certificates, test your SSL configuration:

```bash
curl -vI https://yourdomain.com
```

Or use an online SSL checker like [SSL Labs](https://www.ssllabs.com/ssltest/).
