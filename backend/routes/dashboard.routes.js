const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getDashboardStats } = require('../controllers/dashboard.controller');

router.use(protect);
router.use(authorize('manager'));

router.get('/', getDashboardStats);

module.exports = router; 