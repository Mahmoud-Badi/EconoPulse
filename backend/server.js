const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://econopulse.live'
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

// Rate limiting — prevent API abuse
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many requests, please slow down.' },
})
app.use('/api/', limiter);

// Cache-Control headers per route type
app.use((req, res, next) => {
  if (req.path === '/api/health') {
    res.set('Cache-Control', 'no-store');
  } else if (req.path.startsWith('/api/macro')) {
    res.set('Cache-Control', 'public, max-age=86400');
  } else if (req.path.startsWith('/api/crypto') || req.path.startsWith('/api/commodities')) {
    res.set('Cache-Control', 'public, max-age=300');
  } else {
    res.set('Cache-Control', 'public, max-age=60');
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/macro', require('./routes/macro'));
app.use('/api/crypto', require('./routes/crypto'));
app.use('/api/forex', require('./routes/forex'));
app.use('/api/commodities', require('./routes/commodities'));
app.use('/api/news', require('./routes/news'));
app.use('/api/sentiment', require('./routes/sentiment'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.VITEST !== 'true') {
  app.listen(PORT, () => {
    console.log(`EconoPulse server running on port ${PORT}`);
  });
}

module.exports = app;
