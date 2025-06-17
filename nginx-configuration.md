# Nginx Configuration for kickshare.fun

This guide explains how to configure Nginx on Linux servers to host the Markdown Viewer application.

## Prerequisites

1. A Linux server (Ubuntu/Debian recommended)
2. Nginx installed
3. Node.js and npm installed
4. MongoDB installed and running
5. Domain (kickshare.fun) pointing to your server's IP address

## Nginx Configuration

### 1. Create a Nginx Server Block

Create a new file at `/etc/nginx/sites-available/kickshare.fun`:

```nginx
server {
    listen 80;
    server_name kickshare.fun www.kickshare.fun;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name kickshare.fun www.kickshare.fun;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/kickshare.fun/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kickshare.fun/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy API requests to Node.js server
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve static files
    root /var/www/kickshare.fun/client/build;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Add cache headers for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Logging
    access_log /var/log/nginx/kickshare.fun-access.log;
    error_log /var/log/nginx/kickshare.fun-error.log;
}
```

### 2. Enable the Nginx Configuration

```bash
sudo ln -s /etc/nginx/sites-available/kickshare.fun /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Set Up SSL with Let's Encrypt

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d kickshare.fun -d www.kickshare.fun
```

## PM2 Configuration (Process Manager for Node.js)

### 1. Install PM2

```bash
sudo npm install -g pm2
```

### 2. Create a PM2 Ecosystem File

Create a file at `/var/www/kickshare.fun/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'markdown-viewer',
    script: '/var/www/kickshare.fun/server/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGODB_URI: 'mongodb://localhost:27017/markdown-app',
      DOMAIN: 'kickshare.fun'
    }
  }]
};
```

### 3. Start the Application with PM2

```bash
cd /var/www/kickshare.fun
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Monitoring and Maintenance

### 1. Check Application Status

```bash
pm2 status
pm2 logs markdown-viewer
```

### 2. Restart the Application

```bash
pm2 restart markdown-viewer
```

### 3. Update Application

```bash
cd /var/www/kickshare.fun
git pull
cd client
npm install
npm run build
cd ../server
npm install
pm2 restart markdown-viewer
```

## Security Considerations

1. Set up a firewall (UFW)
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

2. Enable automatic security updates
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

3. Secure MongoDB
```bash
# Edit MongoDB configuration
sudo nano /etc/mongod.conf

# Add security section
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

## Troubleshooting

### Nginx Issues
- Check Nginx configuration: `sudo nginx -t`
- Check Nginx logs: `sudo tail -f /var/log/nginx/kickshare.fun-error.log`
- Verify Nginx is running: `sudo systemctl status nginx`

### Node.js Application Issues
- Check PM2 logs: `pm2 logs markdown-viewer`
- Verify the application is running: `pm2 status`
- Test the API directly: `curl http://localhost:5000/api/markdown/test`

### SSL Issues
- Verify certificates: `sudo certbot certificates`
- Renew certificates: `sudo certbot renew --dry-run`
