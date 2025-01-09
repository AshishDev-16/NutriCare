const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  getDeliveries,
  updateDeliveryStatus,
  getDeliveryStats 
} = require('../controllers/delivery.controller');

// Get all deliveries
router.get('/', protect, getDeliveries);

// Update delivery status
router.put('/:id/status', protect, updateDeliveryStatus);

// Get delivery statistics
router.get('/stats', protect, getDeliveryStats);

module.exports = router; 