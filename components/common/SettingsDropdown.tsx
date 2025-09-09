import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/authContext';
import { useNotifications } from '../../lib/notificationContext';

const SettingsDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simplified notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    allNotifications: true,
    newUsers: true,
    newMagazines: true,
    newCategories: true,
    settingsChanges: true,
    systemAlerts: false,
    soundEnabled: true
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin-notification-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setNotificationSettings(prev => ({ ...prev, ...parsed }));
          } catch {
      // Silent error handling for production
    }
    }
  }, []);

  const handleAllNotificationsToggle = (value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      allNotifications: value,
      newUsers: value,
      newMagazines: value,
      newCategories: value,
      settingsChanges: value,
      systemAlerts: value
    }));
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('admin-notification-settings', JSON.stringify(notificationSettings));

      // Add notification for settings change
      addNotification({
        title: 'Settings Updated',
        message: 'Notification preferences have been saved successfully.',
        type: 'success'
      });

    } catch {
      addNotification({
        title: 'Settings Error',
        message: 'Failed to save settings. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    addNotification({
      title: 'Logging Out',
      message: 'You have been logged out successfully.',
      type: 'info'
    });
    logout();
  };

  const notificationOptions = [
    {
      key: 'newUsers',
      label: 'New Users',
      icon: '👤'
    },
    {
      key: 'newMagazines',
      label: 'New Magazines',
      icon: '📚'
    },
    {
      key: 'newCategories',
      label: 'New Categories',
      icon: '🏷️'
    },
    {
      key: 'settingsChanges',
      label: 'Settings Changes',
      icon: '⚙️'
    },
    {
      key: 'systemAlerts',
      label: 'System Alerts',
      icon: '⚠️'
    },
    {
      key: 'soundEnabled',
      label: 'Sound',
      icon: '🔊'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold">{user?.name || 'Admin'}</h3>
                <p className="text-blue-100 text-xs">Settings</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Notifications Section */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v7.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 17.25v-7.5a6 6 0 00-6-6z" />
                </svg>
                Notifications
              </h4>
              
              <div className="space-y-2">
                {/* All Notifications Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">🔔</span>
                    <span className="text-sm font-medium text-slate-900">All Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.allNotifications}
                      onChange={(e) => handleAllNotificationsToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Individual Notification Options */}
                {notificationOptions.map((option) => (
                  <div key={option.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{option.icon}</span>
                      <span className="text-sm text-slate-700">{option.label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[option.key as keyof typeof notificationSettings]}
                        onChange={(e) => handleSettingChange(option.key, e.target.checked)}
                        disabled={!notificationSettings.allNotifications}
                        className="sr-only peer"
                      />
                      <div className={`w-7 h-4 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 ${!notificationSettings.allNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown; 