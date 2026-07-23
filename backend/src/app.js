const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Error handling middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;
