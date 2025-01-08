const express = require('express');
const router = express.Router();
const {
  getDietCharts,
  getDietChart,
  createDietChart,
  updateDietChart,
  deleteDietChart
} = require('../controllers/dietChart.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(protect, getDietCharts)
  .post(protect, authorize('manager'), createDietChart);

router
  .route('/:id')
  .get(protect, getDietChart)
  .put(protect, authorize('manager'), updateDietChart)
  .delete(protect, authorize('manager'), deleteDietChart);

module.exports = router; 