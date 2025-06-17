# PowerShell Deployment Script for kickshare.fun Markdown Viewer
# This script helps deploy the application to Windows servers

Write-Host "======================================================="
Write-Host "  Deploying Markdown Viewer to kickshare.fun"
Write-Host "======================================================="

# Set variables
$DOMAIN = if ($env:DOMAIN) { $env:DOMAIN } else { "kickshare.fun" }
$APP_DIR = "D:\webapps\$DOMAIN"
$GIT_REPO = "https://github.com/yourusername/markdown-viewer.git"  # Replace with your actual repository
$BACKUP_DIR = "D:\backups\$DOMAIN"
$PM2_NAME = "markdown-viewer"

# 1. Create directories if they don't exist
if (-not (Test-Path $APP_DIR)) {
    Write-Host "Creating application directory..."
    New-Item -ItemType Directory -Path $APP_DIR -Force
}

if (-not (Test-Path $BACKUP_DIR)) {
    Write-Host "Creating backup directory..."
    New-Item -ItemType Directory -Path $BACKUP_DIR -Force
}

# 2. Backup existing application if it exists
if (Test-Path "$APP_DIR\client") {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$BACKUP_DIR\backup_$timestamp.zip"
    Write-Host "Backing up existing application to $backupFile..."
    Compress-Archive -Path $APP_DIR -DestinationPath $backupFile -Force
}

# 3. Clone or update repository
if (Test-Path "$APP_DIR\.git") {
    Write-Host "Updating existing repository..."
    Set-Location $APP_DIR
    git pull
} else {
    Write-Host "Cloning repository..."
    git clone $GIT_REPO $APP_DIR
    Set-Location $APP_DIR
}

# 4. Configure environment
Write-Host "Configuring environment variables..."
$envContent = @"
MONGODB_URI=mongodb://localhost:27017/markdown-app
PORT=5000
NODE_ENV=production
DOMAIN=$DOMAIN
"@
Set-Content -Path "$APP_DIR\server\.env" -Value $envContent

# 5. Install dependencies and build client
Write-Host "Installing dependencies and building client..."
Set-Location "$APP_DIR\client"
npm install
npm run build

# 6. Install server dependencies
Write-Host "Installing server dependencies..."
Set-Location "$APP_DIR\server"
npm install

# 7. Configure for production
Write-Host "Updating client API configuration for production..."
$apiJsPath = "$APP_DIR\client\src\api\api.js"
$apiJsContent = Get-Content -Path $apiJsPath -Raw
$apiJsContent = $apiJsContent -replace "baseURL: process.env.REACT_APP_API_URL \|\| 'http://localhost:5001/api'", "baseURL: process.env.REACT_APP_API_URL || 'https://kickshare.fun/api'"
Set-Content -Path $apiJsPath -Value $apiJsContent

# 8. Check if PM2 is installed, install if not
if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    Write-Host "Installing PM2 globally..."
    npm install -g pm2
}

# 9. Start or restart the application with PM2
Write-Host "Starting application with PM2..."
Set-Location "$APP_DIR\server"
pm2 describe $PM2_NAME > $null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Restarting existing PM2 process..."
    pm2 restart $PM2_NAME
} else {
    Write-Host "Creating new PM2 process..."
    pm2 start server.js --name $PM2_NAME
    pm2 save
}

Write-Host "======================================================="
Write-Host "  Deployment complete! Your application is now live at:"
Write-Host "  https://$DOMAIN"
Write-Host "======================================================="
Write-Host ""
Write-Host "Make sure your IIS or web server is configured to:"
Write-Host "1. Point the domain to this server"
Write-Host "2. Forward requests to localhost:5000"
Write-Host "3. Set up SSL certificates for the domain"
