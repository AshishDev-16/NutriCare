import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
    id: string;
    message: string;
    read: boolean;
    timestamp: Date;
    userType: 'manager' | 'pantry_staff';
}

const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        
        if (!token || !role) {
            console.log('No auth data found:', {
                hasToken: !!token,
                hasRole: !!role
            });
            return;
        }

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            
            console.log('Setting up socket connection:', {
                baseUrl,
                role,
                hasToken: !!token
            });

            // Create socket connection with token
            const newSocket = io(baseUrl, {
                auth: { token },
                transports: ['websocket'],
                upgrade: false
            });

            // Socket event handlers
            newSocket.on('connect', () => {
                console.log('Socket connected successfully');
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error.message);
            });

            newSocket.on('error', (error) => {
                console.error('Socket error:', error);
            });

            newSocket.on('notification', (notification: Notification) => {
                console.log('Received notification:', notification);
                if (notification.userType === role) {
                    setNotifications(prev => [notification, ...prev]);
                }
            });

            setSocket(newSocket);

            // Cleanup on unmount
            return () => {
                if (newSocket.connected) {
                    console.log('Disconnecting socket');
                    newSocket.disconnect();
                }
            };
        } catch (error) {
            console.error('Error setting up notifications:', error);
        }
    }, []); // Run only once on mount

    const markAsRead = (notificationId: string) => {
        if (!socket) return;
        socket.emit('markAsRead', { notificationId });
    };

    const markAllAsRead = () => {
        if (!socket) return;
        socket.emit('markAllAsRead');
    };

    const deleteNotification = (notificationId: string) => {
        if (!socket) return;
        socket.emit('deleteNotification', { notificationId });
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    return {
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    };
};

export default useNotifications;