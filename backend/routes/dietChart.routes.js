const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getDietCharts,
  createDietChart,
  updateDietChart,
  deleteDietChart
} = require('../controllers/dietChart.controller');

router.use(protect);
router.use(authorize('manager'));

router
  .route('/')
  .get(getDietCharts)
  .post(createDietChart);

router
  .route('/:id')
  .put(updateDietChart)
  .delete(deleteDietChart);

module.exports = router; 