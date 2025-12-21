import React, { useState } from 'react';
import { Sun, CloudSun, Moon, Target, Clock, Sparkles, TrendingUp } from 'lucide-react';

const DailyGoalReminders = ({ globalEnabled }) => {
    const [reminders, setReminders] = useState({
        morningMotivation: {
            enabled: true,
            time: '07:00',
            message: 'Good morning! Start your day with purpose. What will you achieve today? ☀️',
            adaptive: true,
        },
        middayCheckIn: {
            enabled: true,
            time: '12:00',
            message: "Halfway through the day! You\'re making progress. Keep going! 💪",
            adaptive: false,
        },
        eveningReflection: {
            enabled: true,
            time: '20:00',
            message: "Time to reflect on today\'s wins. Every step counts! 🌟",
            adaptive: true,
        },
    });

    const [activityPatterns, setActivityPatterns] = useState({
        adaptiveTiming: true,
        weatherBased: false,
        energyLevelTracking: true,
    });

    const handleToggle = (key, field) => {
        setReminders((prev) => ({
            ...prev,
            [key]: {
                ...prev?.[key],
                [field]: !prev?.[key]?.[field],
            },
        }));
    };

    const handleTimeChange = (key, value) => {
        setReminders((prev) => ({
            ...prev,
            [key]: {
                ...prev?.[key],
                time: value,
            },
        }));
    };

    const handleMessageChange = (key, value) => {
        setReminders((prev) => ({
            ...prev,
            [key]: {
                ...prev?.[key],
                message: value,
            },
        }));
    };

    const handlePatternToggle = (key) => {
        setActivityPatterns((prev) => ({
            ...prev,
            [key]: !prev?.[key],
        }));
    };

    const timeSlots = [
        { key: 'morningMotivation', label: 'Morning Motivation', icon: <Sun className="h-5 w-5" />, color: 'orange' },
        { key: 'middayCheckIn', label: 'Midday Check-In', icon: <CloudSun className="h-5 w-5" />, color: 'yellow' },
        { key: 'eveningReflection', label: 'Evening Reflection', icon: <Moon className="h-5 w-5" />, color: 'purple' },
    ];

    const getColorClasses = (color) => {
        const colors = {
            orange: {
                bg: 'bg-orange-50 dark:bg-orange-900/20',
                text: 'text-orange-600 dark:text-orange-400',
                border: 'border-orange-200 dark:border-orange-800',
                gradient: 'from-orange-500 to-red-600',
            },
            yellow: {
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                text: 'text-yellow-600 dark:text-yellow-400',
                border: 'border-yellow-200 dark:border-yellow-800',
                gradient: 'from-yellow-500 to-orange-600',
            },
            purple: {
                bg: 'bg-purple-50 dark:bg-purple-900/20',
                text: 'text-purple-600 dark:text-purple-400',
                border: 'border-purple-200 dark:border-purple-800',
                gradient: 'from-purple-500 to-indigo-600',
            },
        };
        return colors?.[color];
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                        <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Daily Goal Reminders
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Flexible scheduling with adaptive timing based on your activity patterns
                        </p>
                    </div>
                </div>
                {!globalEnabled && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                            ⚠️ Global notifications are disabled. Enable them to receive daily reminders.
                        </p>
                    </div>
                )}
            </div>
            {/* Time Slot Configuration */}
            <div className="space-y-4 mb-6">
                {timeSlots?.map((slot) => {
                    const reminder = reminders?.[slot?.key];
                    const colors = getColorClasses(slot?.color);

                    return (
                        <div
                            key={slot?.key}
                            className={`rounded-xl border-2 transition-all ${
                                reminder?.enabled && globalEnabled
                                    ? `${colors?.bg} ${colors?.border}`
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-3 rounded-xl bg-gradient-to-br ${colors?.gradient}`}
                                        >
                                            <span className="text-white">{slot?.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {slot?.label}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Scheduled for {reminder?.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => handleToggle(slot?.key, 'enabled')}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                            reminder?.enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                        disabled={!globalEnabled}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                                reminder?.enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Time Picker */}
                                {reminder?.enabled && globalEnabled && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Reminder Time
                                        </label>
                                        <input
                                            type="time"
                                            value={reminder?.time}
                                            onChange={(e) => handleTimeChange(slot?.key, e?.target?.value)}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                )}

                                {/* Message Customization */}
                                {reminder?.enabled && globalEnabled && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Reminder Message
                                        </label>
                                        <textarea
                                            value={reminder?.message}
                                            onChange={(e) => handleMessageChange(slot?.key, e?.target?.value)}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            rows="3"
                                        />
                                    </div>
                                )}

                                {/* Adaptive Timing */}
                                {reminder?.enabled && globalEnabled && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Adaptive timing based on activity patterns
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleToggle(slot?.key, 'adaptive')}
                                                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                                    reminder?.adaptive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        reminder?.adaptive ? 'translate-x-5' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Advanced Activity Patterns */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Advanced Activity Patterns
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            AI-driven insights for optimal reminder timing
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Adaptive Timing
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Adjust reminder times based on your activity history
                            </p>
                        </div>
                        <button
                            onClick={() => handlePatternToggle('adaptiveTiming')}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                activityPatterns?.adaptiveTiming ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            disabled={!globalEnabled}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    activityPatterns?.adaptiveTiming ? 'translate-x-5' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Weather-Based Suggestions
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Suggest outdoor activities on nice weather days
                            </p>
                        </div>
                        <button
                            onClick={() => handlePatternToggle('weatherBased')}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                activityPatterns?.weatherBased ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            disabled={!globalEnabled}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    activityPatterns?.weatherBased ? 'translate-x-5' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Energy Level Tracking
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Recommend activities matching your energy levels
                            </p>
                        </div>
                        <button
                            onClick={() => handlePatternToggle('energyLevelTracking')}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                activityPatterns?.energyLevelTracking ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            disabled={!globalEnabled}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    activityPatterns?.energyLevelTracking ? 'translate-x-5' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyGoalReminders;