class NotificationService {
    constructor() {
        // Initialize separate notification queues for manager and pantry_staff
        this.notifications = {
            manager: [],
            pantry_staff: []
        };
        this.io = null;
    }

    setIo(io) {
        console.log('Setting up Socket.IO instance in NotificationService');
        this.io = io;
    }

    addNotification(userType, notification) {
        console.log('Adding notification:', {
            userType,
            notification
        });

        if (!['manager', 'pantry_staff'].includes(userType)) {
            console.error('Invalid user type:', userType);
            throw new Error('Invalid user type');
        }

        const newNotification = {
            id: Date.now().toString(),
            message: notification.message,
            read: false,
            timestamp: new Date(),
            userType
        };

        // Add to appropriate queue
        this.notifications[userType].unshift(newNotification);

        console.log(`Notification added to ${userType} queue. Current count:`, this.notifications[userType].length);

        // Emit to all users of this type
        if (this.io) {
            console.log(`Emitting notification to ${userType} room`);
            this.io.to(userType).emit('notification', newNotification);
        } else {
            console.warn('Socket.IO instance not set, notification will not be emitted');
        }

        return newNotification;
    }

    getNotifications(userType) {
        console.log('Getting notifications for:', userType);
        
        if (!['manager', 'pantry_staff'].includes(userType)) {
            console.error('Invalid user type:', userType);
            throw new Error('Invalid user type');
        }

        const notifications = this.notifications[userType] || [];
        console.log(`Found ${notifications.length} notifications for ${userType}`);
        return notifications;
    }

    markAsRead(userType, notificationId) {
        console.log('Marking notification as read:', {
            userType,
            notificationId
        });

        if (!['manager', 'pantry_staff'].includes(userType)) {
            console.error('Invalid user type:', userType);
            throw new Error('Invalid user type');
        }

        const notification = this.notifications[userType].find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            // Emit updated notification
            if (this.io) {
                console.log('Emitting notification update');
                this.io.to(userType).emit('notificationUpdate', notification);
            }
            return true;
        }
        console.log('Notification not found');
        return false;
    }

    markAllAsRead(userType) {
        console.log('Marking all notifications as read for:', userType);

        if (!['manager', 'pantry_staff'].includes(userType)) {
            console.error('Invalid user type:', userType);
            throw new Error('Invalid user type');
        }

        this.notifications[userType].forEach(notification => {
            notification.read = true;
        });

        // Emit updated notifications
        if (this.io) {
            console.log('Emitting updated notifications list');
            this.io.to(userType).emit('notifications', this.notifications[userType]);
        }
        return true;
    }

    deleteNotification(userType, notificationId) {
        console.log('Deleting notification:', {
            userType,
            notificationId
        });

        if (!['manager', 'pantry_staff'].includes(userType)) {
            console.error('Invalid user type:', userType);
            throw new Error('Invalid user type');
        }

        const index = this.notifications[userType].findIndex(n => n.id === notificationId);
        if (index !== -1) {
            this.notifications[userType].splice(index, 1);
            // Emit updated notifications list
            if (this.io) {
                console.log('Emitting updated notifications list');
                this.io.to(userType).emit('notifications', this.notifications[userType]);
            }
            return true;
        }
        console.log('Notification not found');
        return false;
    }

    // Helper method to send notification to specific user type
    sendNotification(userType, message) {
        console.log('Sending notification:', {
            userType,
            message
        });
        return this.addNotification(userType, { message });
    }
}

module.exports = new NotificationService();