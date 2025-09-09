import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('admin-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: { id: string; title: string; message: string; type: string; timestamp: string; read: boolean; action?: { label: string; href: string } }) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
          } catch {
      // Silent error handling for production
    }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('admin-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Get notification settings
  const getNotificationSettings = () => {
    const savedSettings = localStorage.getItem('admin-notification-settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
          } catch {
      // Silent error handling for production
    }
    }
    return {
      allNotifications: true,
      newUsers: true,
      newMagazines: true,
      newCategories: true,
      settingsChanges: true,
      systemAlerts: false,
      soundEnabled: true
    };
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const settings = getNotificationSettings();
    
    // Check if all notifications are disabled
    if (!settings.allNotifications) {
      return; // Don't add any notifications if all are disabled
    }
    
    // Check if this type of notification should be shown
    const shouldShow = (() => {
      switch (notification.title) {
        case 'User Created Successfully':
        case 'New User Registration':
          return settings.newUsers;
        case 'Magazine Created Successfully':
        case 'New Magazine Added':
          return settings.newMagazines;
        case 'Category Added':
        case 'Category Updated':
        case 'Category Deleted':
          return settings.newCategories;
        case 'Settings Updated':
          return settings.settingsChanges;
        case 'Dashboard Error':
        case 'Login Failed':
        case 'Delete Failed':
          return settings.systemAlerts;
        default:
          return true; // Show other notifications by default
      }
    })();

    if (!shouldShow) {
      return; // Don't add notification if user has disabled this type
    }

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only last 50 notifications

    // Play sound if enabled
    if (settings.soundEnabled) {
      // Create a simple notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore errors if audio fails to play
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 