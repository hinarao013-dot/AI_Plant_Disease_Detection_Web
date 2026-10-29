const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: "AgriGuard AI Plant Disease Detection & Directory API is running" });
});

// Import routes
const plantCatalogRoutes = require('./routes/plantCatalogRoutes');
const scanHistoryRoutes = require('./routes/scanHistoryRoutes');

// Use routes
app.use('/api/plant-catalog', plantCatalogRoutes);
app.use('/api/scan-history', scanHistoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

module.exports = app;
