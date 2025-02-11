const notificationService = require('../services/NotificationService');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = notificationService.getNotifications(req.user.role);
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const success = notificationService.markAsRead(req.user.role, notificationId);
    res.json({
      success: true,
      message: success ? 'Notification marked as read' : 'Notification not found'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    notificationService.markAllAsRead(req.user.role);
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const success = notificationService.deleteNotification(req.user.role, notificationId);
    res.json({
      success: true,
      message: success ? 'Notification deleted' : 'Notification not found'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
}; 