# Create project folders
mkdir -p markdown-viewer/server
mkdir -p markdown-viewer/client
cd markdown-viewer

# Initialize the server
cd server
npm init -y
npm install express mongoose cors nanoid multer dotenv morgan
npm install --save-dev nodemon

# Return to root
cd ..