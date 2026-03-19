const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`EconoPulse server running on port ${PORT}`);
});

module.exports = app;
