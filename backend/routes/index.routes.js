const express = require('express');
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('API Request:', {
    method: req.method,
    path: req.path,
    headers: req.headers.authorization ? 'Bearer token present' : 'No token'
  });
  next();
});

// Mount routes
router.use('/auth', require('./auth.routes'));
router.use('/patients', require('./patient.routes'));
router.use('/diet-charts', require('./dietChart.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/pantry', require('./pantry.routes'));
router.use('/tasks', require('./task.routes'));
router.use('/deliveries', require('./delivery.routes'));

// Catch-all for unmatched routes
router.use('*', (req, res) => {
  console.log('No route matched:', req.method, req.baseUrl);
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router; 