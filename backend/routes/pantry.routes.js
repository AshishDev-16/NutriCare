const express = require('express');
const router = express.Router();
const {
  getPantryStaff,
  createPantryStaff,
  updatePantryStaff,
  deletePantryStaff
} = require('../controllers/pantry.controller');

router.route('/staff').get(getPantryStaff).post(createPantryStaff);
router.route('/staff/:id').put(updatePantryStaff).delete(deletePantryStaff);

module.exports = router; 