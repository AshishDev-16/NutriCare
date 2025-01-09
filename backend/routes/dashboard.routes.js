const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  getDashboardStats, 
  getDeliveryTrends,
  getDeliverySchedule,
  getActivities,
  getMealStatus,
  getStaffMetrics 
} = require('../controllers/dashboard.controller');

router.get('/', protect, getDashboardStats);
router.get('/trends', protect, getDeliveryTrends);
router.get('/schedule', protect, getDeliverySchedule);
router.get('/activities', protect, getActivities);
router.get('/meal-status', protect, getMealStatus);
router.get('/staff-metrics', protect, getStaffMetrics);

module.exports = router; 