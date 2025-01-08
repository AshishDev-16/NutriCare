const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTaskStatus,
  getTasksByPriority
} = require('../controllers/task.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, authorize('manager'), createTask);

router
  .route('/:id')
  .get(protect, getTask);

router
  .route('/:id/status')
  .put(protect, updateTaskStatus);

router
  .route('/priority/:priority')
  .get(protect, getTasksByPriority);

module.exports = router; 