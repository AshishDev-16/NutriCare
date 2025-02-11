"use client"

import React from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import useNotifications from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

export function NotificationPanel() {
    const { 
        notifications, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification 
    } = useNotifications();

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-2 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAllAsRead()}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id}
                                    className={cn(
                                        "flex items-start gap-2 p-2 hover:bg-muted/50",
                                        !notification.read && "bg-muted/30"
                                    )}
                                >
                                    <div className="flex-1">
                                        <p className={cn(
                                            "text-sm",
                                            !notification.read && "font-medium"
                                        )}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(notification.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        {!notification.read && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive"
                                            onClick={() => deleteNotification(notification.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}