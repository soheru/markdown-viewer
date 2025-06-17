# kickshare.fun - Markdown Viewer & Sharing Application

A full-stack web application for creating, viewing, and sharing markdown documents.

## Features

- Create markdown content through direct input or file upload
- Preview markdown as you type with full styling
- Support for tables, lists, code blocks, and other markdown features
- Generate short, shareable links
- Responsive design works on all devices
- MongoDB storage for persistence

## Installation

### Prerequisites

- Node.js (v16+)
- MongoDB account & connection string

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/soheru/markdown-viewer.git
   cd markdown-viewer
   ```

## Deployment Options

### One-Step Deployment (Recommended)

The simplest way to deploy this application is using our direct deployment script:

#### Linux/Unix:
```bash
# Deploy with default domain (kickshare.fun)
./deploy-direct.sh

# Deploy with custom domain
./deploy-direct.sh yourdomain.com
```

#### Windows:
```powershell
# Deploy with default domain (kickshare.fun)
.\deploy-direct.ps1

# Deploy with custom domain
.\deploy-direct.ps1 -Domain yourdomain.com
```

This script will:
1. Set up all required environment variables
2. Install and configure MongoDB if needed
3. Set up SSL certificates with Let's Encrypt (Linux)
4. Build and start all Docker containers
5. Make your application available at https://yourdomain.com

### Docker Deployment (Manual)

### PM2 Deployment (Production)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```
2. Deploy with PM2:
   ```bash
   cd server
   pm2 start ecosystem.config.js --env production
   ```

### Traditional Deployment

For Linux servers:
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

For Windows servers:
```powershell
.\deploy.ps1
```

For detailed deployment instructions, see the [quickstart.md](quickstart.md) guide.

## Environment Configuration

### Domain Configuration

This application is designed to be configurable through environment variables, with kickshare.fun as the default domain. You can deploy to a different domain by setting the `DOMAIN` environment variable:

```bash
# Linux/macOS
export DOMAIN=yourdomain.com
./deploy.sh

# Windows PowerShell
$env:DOMAIN = "yourdomain.com"
.\deploy.ps1

# Docker deployment
DOMAIN=yourdomain.com docker-compose up -d
```

### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DOMAIN | The domain name for the application | kickshare.fun |
| PORT | The port for the server | 5001 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/markdown-app |
| NODE_ENV | Environment (development/production) | development |
| CLIENT_URL | URL for client in development | http://localhost:3000 |

These variables can be set in `.env` files:
- `.env` - Default environment variables
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables

## Security

This application includes:
- Helmet.js for security headers
- Rate limiting to prevent abuse
- Data validation and sanitization
- HTTPS enforcement in production

## License

ISC

## Author

Your Name