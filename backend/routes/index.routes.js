const express = require('express');
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('API Request:', {
    method: req.method,
    path: req.path,
    headers: {
      authorization: req.headers.authorization ? 'Present' : 'Missing',
      'content-type': req.headers['content-type']
    }
  });
  next();
});

// Mount routes
router.use('/auth', require('./auth.routes'));
router.use('/patients', require('./patient.routes'));
router.use('/diet-charts', require('./dietChart.routes'));
router.use('/dashboard', require('./dashboard.routes'));

// Catch-all to log unmatched routes
router.use('*', (req, res) => {
  console.log('No route matched:', req.method, req.path);
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router; 