const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
// TODO: Mount routes here (e.g., app.use('/api/auth', authRoutes))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Centralized error handling middleware will be added here

module.exports = app;
