const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/patients', require('./patient.routes'));
router.use('/diet-charts', require('./dietChart.routes'));
router.use('/meals', require('./meal.routes'));
router.use('/pantries', require('./pantry.routes'));
router.use('/tasks', require('./task.routes'));
router.use('/deliveries', require('./delivery.routes'));

module.exports = router; 