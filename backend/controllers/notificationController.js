const express = require('express');
const router = express.Router();
const notificationService = require('../services/NotificationService');

router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    const notifications = notificationService.getNotifications(userId);
    res.json(notifications);
});

router.post('/mark-as-read/:userId/:notificationId', (req, res) => {
    const { userId, notificationId } = req.params;
    notificationService.markAsRead(userId, notificationId);
    res.sendStatus(200);
});

module.exports = router;