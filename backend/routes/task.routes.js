const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getTasks,
  createTask,
} = require('../controllers/task.controller');

router.use(protect);
router.use(authorize('manager'));

router
  .route('/')
  .get(getTasks)
  .post(createTask);

module.exports = router; 