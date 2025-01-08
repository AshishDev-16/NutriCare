const express = require('express');
const router = express.Router();
const {
  getPantries,
  getPantry,
  createPantry,
  updatePantry,
  addStaffToPantry,
  removeStaffFromPantry
} = require('../controllers/pantry.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(protect, getPantries)
  .post(protect, authorize('manager'), createPantry);

router
  .route('/:id')
  .get(protect, getPantry)
  .put(protect, authorize('manager'), updatePantry);

router
  .route('/:id/staff')
  .put(protect, authorize('manager'), addStaffToPantry);

router
  .route('/:id/staff/:staffId')
  .delete(protect, authorize('manager'), removeStaffFromPantry);

module.exports = router; 