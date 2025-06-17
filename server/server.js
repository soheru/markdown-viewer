const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Add security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", `https://${process.env.DOMAIN || 'kickshare.fun'}`]
    }
  }
}));

// Compress all responses
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// MongoDB Connection
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI ? 'URI is defined' : 'URI is undefined');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s
  family: 4 // Use IPv4, skip trying IPv6
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Set up MongoDB connection error handler
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error after initial connection:', err);
});

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

// Check MongoDB connection state
const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database connection not established',
      readyState: mongoose.connection.readyState
    });
  }
  next();
};

// Apply connection check middleware to API routes
app.use('/api', checkMongoConnection);

// Markdown Document Schema
const markdownSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: 'Untitled Document'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MarkdownDocument = mongoose.model('md_files', markdownSchema);

// Generate a unique 5-character ID
const generateUniqueId = async () => {
  let shortId;
  let isUnique = false;

  while (!isUnique) {
    shortId = nanoid(5); // Generate 5-character ID
    const existingDoc = await MarkdownDocument.findOne({ shortId });
    if (!existingDoc) {
      isUnique = true;
    }
  }
  return shortId;
};

// API Routes
// Save markdown content (paste or upload)
app.post('/markdown', upload.single('file'), async (req, res) => {
  try {
    let content, title;

    // Handle uploaded file or pasted content
    if (req.file) {
      content = req.file.buffer.toString('utf-8');
      title = req.file.originalname || 'Uploaded Document';
    } else if (req.body.content) {
      content = req.body.content;
      title = req.body.title || 'Pasted Document';
    } else {
      return res.status(400).json({ error: 'No content provided' });
    }

    const shortId = await generateUniqueId();

    const markdownDoc = new MarkdownDocument({
      content,
      shortId,
      title
    });

    const savedDoc = await markdownDoc.save();

    if (!savedDoc) {
      throw new Error('Document failed to save');
    }

    res.status(201).json({
      message: 'Document saved successfully',
      shortId,
      url: process.env.NODE_ENV === 'production'
        ? `https://${process.env.DOMAIN || 'kickshare.fun'}/view/${shortId}`
        : `${process.env.CLIENT_URL || 'http://localhost:3000'}/view/${shortId}`
    });
  } catch (error) {
    console.error('Error saving markdown:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.message
      });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get markdown by ID
app.get('/markdown/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;
    const document = await MarkdownDocument.findOne({ shortId });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error retrieving markdown:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  // In development mode, let's help with client-side routing
  // This will make sure when users navigate directly to routes like /view/xyz
  // they'll be redirected to the React dev server
  app.get(['/view/*', '/view/:shortId'], (req, res) => {
    console.log('Redirecting view request to client:', req.originalUrl);
    res.redirect(`http://localhost:3000${req.originalUrl}`);
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});