// ============================================================
// Node.js Backend — Express + MongoDB CRUD API
// Part of Modular Component Showcase (Review 3 Rubric)
// ============================================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/modular_showcase';

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'node-backend',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/reviews', require('./routes/reviews'));

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✓ Node.js Backend running on http://localhost:${PORT}`);
      console.log(`  Categories API: http://localhost:${PORT}/api/categories`);
      console.log(`  Reviews API:    http://localhost:${PORT}/api/reviews`);
    });
  })
  .catch((err) => {
    console.error('✗ MongoDB connection failed:', err.message);
    console.log('Starting server without MongoDB...');
    app.listen(PORT, () => {
      console.log(`✓ Node.js Backend running (no DB) on http://localhost:${PORT}`);
    });
  });
