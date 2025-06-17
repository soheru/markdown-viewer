# IIS Configuration for kickshare.fun

This guide explains how to configure IIS on Windows Server to host the Markdown Viewer application.

## Prerequisites

1. Windows Server with IIS installed
2. URL Rewrite module installed
3. Application Request Routing (ARR) installed
4. Node.js installed
5. PM2 installed globally (`npm install -g pm2`)

## Steps to Configure IIS

### 1. Create a New Website in IIS

1. Open IIS Manager
2. Right-click on "Sites" and select "Add Website"
3. Fill in the following information:
   - Site name: kickshare.fun
   - Physical path: D:\webapps\kickshare.fun\client\build
   - Binding: Type: https, IP address: All Unassigned, Port: 443, Host name: kickshare.fun
   - Click OK

### 2. Install SSL Certificate

1. In IIS Manager, select the website you just created
2. In the Features View, double-click "Server Certificates"
3. In the Actions pane, click "Import..."
4. Browse to your certificate file (.pfx), enter the password, and complete the import
5. Go back to your website, click "Bindings..." in the Actions pane
6. Edit the HTTPS binding and select the SSL certificate you just imported

### 3. Configure URL Rewrite for the API

1. In IIS Manager, select your website
2. Double-click on the URL Rewrite icon
3. In the Actions pane, click "Add Rule(s)..."
4. Select "Blank rule" under "Inbound rules"
5. Set the following:
   - Name: API Proxy
   - Pattern: ^api/(.*)
   - Conditions: None
   - Action: Type: Rewrite
   - Rewrite URL: http://localhost:5000/api/{R:1}
   - Click Apply

### 4. Configure URL Rewrite for Client-Side Routing

1. Add another blank rule
2. Set the following:
   - Name: SPA Fallback
   - Pattern: ^(?!api/)(.*)
   - Conditions: 
     - Add condition: {REQUEST_FILENAME} !-f
     - Add condition: {REQUEST_FILENAME} !-d
   - Action: Type: Rewrite
   - Rewrite URL: /index.html
   - Click Apply

### 5. Configure Application Initialization (Optional)

1. In IIS Manager, select your application pool
2. Right-click and select "Advanced Settings"
3. Set "Start Mode" to "AlwaysRunning"
4. Set "Idle Time-out" to 0
5. Click OK

### 6. Verify the Node.js Application is Running

1. Open PowerShell
2. Navigate to your server directory: `cd D:\webapps\kickshare.fun\server`
3. Check if the application is running with PM2: `pm2 status`
4. If not running, start it: `pm2 start server.js --name markdown-viewer`
5. Configure PM2 to start at system boot: `pm2 startup` (follow the instructions provided)
6. Save the PM2 process list: `pm2 save`

### 7. Testing

1. Open a browser and navigate to https://kickshare.fun
2. Test creating and viewing markdown documents
3. Test the API by accessing https://kickshare.fun/api/markdown/test

## Troubleshooting

### Application Not Loading

- Check the application pool is running
- Verify PM2 is running the Node.js application: `pm2 status`
- Check IIS logs: `C:\inetpub\logs\LogFiles`
- Check application logs: `D:\webapps\kickshare.fun\server\logs`

### API Requests Failing

- Test the API directly: `curl http://localhost:5000/api/markdown/test`
- Check URL Rewrite is properly configured
- Verify Application Request Routing is enabled
- Check the Node.js application logs

### Certificate Issues

- Verify the certificate is valid and trusted
- Check the certificate is correctly bound to the website
- Ensure the certificate includes both the root domain and www subdomain
