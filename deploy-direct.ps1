# Direct Deployment Script for Markdown Viewer (PowerShell version)
# This script provides a one-step deployment

param(
    [string]$Domain = "kickshare.fun"
)

Write-Host "======================================================="
Write-Host "  Deploying Markdown Viewer to $Domain"
Write-Host "======================================================="

# Set other variables
$Port = 5000
$MongoDBDockerName = "markdown-mongodb"
$AppName = "markdown-viewer"

# Make sure we're in the right directory
$ScriptDir = $PSScriptRoot
Set-Location $ScriptDir

# 1. Check requirements
try {
    docker --version | Out-Null
} catch {
    Write-Host "Docker is required but not installed. Aborting."
    exit 1
}

try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "Docker Compose is required but not installed. Please install it."
    exit 1
}

# 2. Create .env file for Docker Compose
Write-Host "Creating environment configuration..."
@"
DOMAIN=$Domain
PORT=$Port
NODE_ENV=production
"@ | Out-File -FilePath .env -Encoding utf8

# 3. Create SSL directory
if (-not (Test-Path -Path .\nginx\ssl)) {
    New-Item -Path .\nginx\ssl -ItemType Directory -Force
}

# 4. Check if MongoDB is already running
$mongoExists = docker ps -a | Select-String -Pattern $MongoDBDockerName
if ($mongoExists) {
    Write-Host "MongoDB container already exists."
} else {
    Write-Host "Setting up MongoDB container..."
    docker run --name $MongoDBDockerName -d -p 27017:27017 -v mongodb_data:/data/db mongo:latest
}

# 5. For Windows, we'll need to handle SSL certificates differently
# Certificate options for Windows:
Write-Host "SSL Certificate Options for Windows:"
Write-Host "1. If you have an existing certificate:"
Write-Host "   - Place the certificate files in .\nginx\ssl\ directory"
Write-Host "   - Name them fullchain.pem and privkey.pem"
Write-Host ""
Write-Host "2. For Let's Encrypt certificates with Windows:"
Write-Host "   - Install Win-ACME client from https://www.win-acme.com/"
Write-Host "   - Run: wacs.exe --target manual --host $Domain --webroot .\nginx\webroot"
Write-Host "   - Convert the certificate to PEM format and place in .\nginx\ssl\"
Write-Host ""
Write-Host "3. For testing with self-signed certificates:"
Write-Host "   - Run: openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout .\nginx\ssl\privkey.pem -out .\nginx\ssl\fullchain.pem"
Write-Host ""
Write-Host "NOTE: If you're having port conflicts when obtaining certificates:"
Write-Host "- Temporarily stop services using port 80/443"
Write-Host "- Use DNS validation instead of HTTP validation"
Write-Host "- Use alternative ports (e.g., port 78) if your certificate tool supports it"
Write-Host ""
Write-Host "Press Enter to continue with deployment..."
$null = Read-Host

# 6. Building application
Write-Host "Building application..."
docker-compose build

# 7. Starting application
Write-Host "Starting application..."
docker-compose up -d

# 8. Verify deployment
Write-Host "Checking deployment status..."
$containersUp = docker-compose ps | Select-String -Pattern "Up"
if ($containersUp) {
    Write-Host "======================================================="
    Write-Host "  Deployment successful! Your application is now live at:"
    Write-Host "  https://$Domain"
    Write-Host "======================================================="
    Write-Host ""
    Write-Host "To monitor logs: docker-compose logs -f"
    Write-Host "To stop: docker-compose down"
} else {
    Write-Host "======================================================="
    Write-Host "  Deployment encountered issues. Check logs with:"
    Write-Host "  docker-compose logs"
    Write-Host "======================================================="
}
