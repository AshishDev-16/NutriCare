const express = require('express');
const router = express.Router();
const {
  getMeals,
  getMeal,
  createMeal,
  updateMealStatus,
  assignMeal
} = require('../controllers/meal.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(protect, getMeals)
  .post(protect, authorize('manager'), createMeal);

router
  .route('/:id')
  .get(protect, getMeal)
  .put(protect, updateMealStatus);

router
  .route('/:id/assign')
  .put(protect, authorize('manager'), assignMeal);

module.exports = router; 