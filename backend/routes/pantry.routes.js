const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getPantryStaff,
  createPantryStaff,
  updatePantryStaff,
  deletePantryStaff,
  getTasks,
  updateTaskStatus,
  createTestTask
} = require('../controllers/pantry.controller');

// Existing staff management routes
router.route('/staff').get(getPantryStaff).post(createPantryStaff);
router.route('/staff/:id').put(updatePantryStaff).delete(deletePantryStaff);

// New task management routes
router.get('/tasks', protect, getTasks);
router.patch('/tasks/:id/status', protect, updateTaskStatus);
router.post('/tasks/test', protect, createTestTask);

module.exports = router; 