import React from 'react';
import { Bell, Mail, Clock, Award, Volume2 } from 'lucide-react';

const NotificationPreferences = ({ settings, onChange }) => {
    const handleToggle = (key) => {
        onChange(key, !settings?.[key]);
    };

    const handleTimeChange = (key, value) => {
        onChange(key, value);
    };

    const notificationTypes = [
        {
            key: 'pushEnabled',
            label: 'Push Notifications',
            description: 'Receive instant notifications on your device',
            icon: <Bell className="h-5 w-5" />,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            key: 'emailSummary',
            label: 'Daily Email Summary',
            description: 'Get a daily recap of your progress via email',
            icon: <Mail className="h-5 w-5" />,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            key: 'achievementAlerts',
            label: 'Achievement Alerts',
            description: 'Celebrate your milestones and achievements',
            icon: <Award className="h-5 w-5" />,
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
    ];

    const reminderTimes = [
        { value: '07:00', label: '7:00 AM - Early Morning' },
        { value: '09:00', label: '9:00 AM - Morning' },
        { value: '12:00', label: '12:00 PM - Noon' },
        { value: '15:00', label: '3:00 PM - Afternoon' },
        { value: '18:00', label: '6:00 PM - Evening' },
        { value: '21:00', label: '9:00 PM - Night' },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Notification Preferences
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Control how and when you receive updates about your activities
                </p>
            </div>

            {/* Notification Toggle Cards */}
            <div className="space-y-4 mb-6">
                {notificationTypes?.map((notif) => {
                    const isEnabled = settings?.[notif?.key];

                    return (
                        <div
                            key={notif?.key}
                            className={`rounded-lg p-5 border transition-all ${
                                isEnabled
                                    ? `${notif?.bgColor} border-current ${notif?.color}`
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${
                                            isEnabled
                                                ? `${notif?.bgColor} ${notif?.color}`
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}
                                    >
                                        {notif?.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            {notif?.label}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {notif?.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={() => handleToggle(notif?.key)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Additional Settings for Enabled Notifications */}
                            {isEnabled && notif?.key === 'pushEnabled' && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Volume2 className="h-4 w-4" />
                                        <span>Sound and vibration enabled</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Reminder Time Selection */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg text-white">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Daily Reminder Time
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Choose when to receive your daily activity reminder
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reminderTimes?.map((time) => {
                        const isSelected = settings?.reminderTime === time?.value;

                        return (
                            <button
                                key={time?.value}
                                onClick={() => handleTimeChange('reminderTime', time?.value)}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${
                                    isSelected
                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30' :'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {time?.label}
                                    </span>
                                    {isSelected && (
                                        <div className="h-5 w-5 bg-purple-600 rounded-full flex items-center justify-center">
                                            <div className="h-2 w-2 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Notification Preview */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    📱 Notification Preview
                </h3>
                <div className="space-y-3">
                    {settings?.pushEnabled && (
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600">
                            <div className="flex items-start gap-3">
                                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                                        Daily Activity Reminder
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        You're doing great! Complete 3 more activities to reach your goal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {settings?.achievementAlerts && (
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600">
                            <div className="flex items-start gap-3">
                                <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                                        Achievement Unlocked! 🎉
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        You've maintained a 7-day streak! Keep it up!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPreferences;