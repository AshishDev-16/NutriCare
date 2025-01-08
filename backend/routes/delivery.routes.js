const express = require('express');
const router = express.Router();
const {
  getDeliveries,
  getMyDeliveries,
  startDelivery,
  completeDelivery,
  getDeliveryStats
} = require('../controllers/delivery.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(protect, authorize('delivery_staff', 'manager'), getDeliveries);

router
  .route('/my-deliveries')
  .get(protect, authorize('delivery_staff'), getMyDeliveries);

router
  .route('/:id/start')
  .put(protect, authorize('delivery_staff'), startDelivery);

router
  .route('/:id/complete')
  .put(protect, authorize('delivery_staff'), completeDelivery);

router
  .route('/stats')
  .get(protect, authorize('manager'), getDeliveryStats);

module.exports = router; 