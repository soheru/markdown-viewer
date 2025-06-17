# Quick Start Guide for kickshare.fun

This guide provides instructions for deploying and using the Markdown Viewer application on the kickshare.fun domain.

## Deployment Options

You have several options for deploying the application:

1. **Docker Deployment** (Recommended for production)
   - Use the provided `docker-compose.yml` file
   - Easy setup with containers for MongoDB, Node.js server, and Nginx

2. **Traditional Server Deployment**
   - Use the `deploy.sh` script for Linux servers
   - Use the `deploy.ps1` script for Windows servers
   - Follow the Nginx or IIS configuration guides

3. **Development Mode**
   - Run the client and server separately for development and testing

## Docker Deployment Steps

1. Ensure Docker and Docker Compose are installed on your server
2. Clone the repository to your server
3. Set up SSL certificates:
   ```
   mkdir -p nginx/ssl
   # Copy your SSL certificates to the nginx/ssl directory
   cp /path/to/your/fullchain.pem nginx/ssl/
   cp /path/to/your/privkey.pem nginx/ssl/
   ```
4. Start the application:
   ```
   docker-compose up -d
   ```
5. The application will be available at https://kickshare.fun

## Traditional Server Deployment

### Linux Servers

1. Upload the application files to your server
2. Make the deployment script executable:
   ```
   chmod +x deploy.sh
   ```
3. Run the deployment script:
   ```
   sudo ./deploy.sh
   ```
4. The script will:
   - Install required dependencies
   - Configure Nginx
   - Set up SSL certificates
   - Start the application with PM2

### Windows Servers

1. Upload the application files to your server
2. Open PowerShell as Administrator
3. Run the deployment script:
   ```
   .\deploy.ps1
   ```
4. Configure IIS following the instructions in `iis-configuration.md`

## Development Mode

1. Start the MongoDB server
2. Configure the `.env` file in the server directory
3. Start the server:
   ```
   cd server
   npm install
   npm run dev
   ```
4. Start the client:
   ```
   cd client
   npm install
   npm start
   ```
5. The application will be available at http://localhost:3000

## Domain Configuration

1. Register the domain kickshare.fun if not already registered
2. Point the domain to your server's IP address:
   - Create an A record: `kickshare.fun → your_server_ip`
   - Create an A record: `www.kickshare.fun → your_server_ip`
3. Allow time for DNS propagation (usually 24-48 hours)

## SSL Certificates

1. For production, use Let's Encrypt for free SSL certificates:
   ```
   certbot --nginx -d kickshare.fun -d www.kickshare.fun
   ```
2. For Docker deployment, you'll need to manually copy the certificates to the nginx/ssl directory

## Usage

1. Visit https://kickshare.fun in your browser
2. Create markdown documents using the editor
3. Save and share documents with others using the generated links
4. Access saved documents at https://kickshare.fun/view/{document_id}

## Maintenance

- Regularly update dependencies:
  ```
  npm audit fix
  ```
- Keep the server updated with security patches
- Renew SSL certificates before they expire:
  ```
  certbot renew
  ```

## Support

For issues or questions, please refer to the project repository or contact the administrator.
