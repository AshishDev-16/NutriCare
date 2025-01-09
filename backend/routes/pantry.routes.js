const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getPantryStaff,
  createPantryStaff,
  updatePantryStaff,
  deletePantryStaff
} = require('../controllers/pantry.controller');

router.use(protect);
router.use(authorize('manager'));

// Define routes
router.get('/staff', getPantryStaff);
router.post('/staff', createPantryStaff);
router.put('/staff/:id', updatePantryStaff);
router.delete('/staff/:id', deletePantryStaff);

module.exports = router; 