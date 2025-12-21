import React, { useState, useEffect } from 'react';
import { Bell, BellOff, TestTube, Moon, ChevronRight, Volume2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

import { settingsService } from '../../services/settingsService';
import Header from '../../components/Header';
import StreakMilestoneAlerts from './components/StreakMilestoneAlerts';
import DailyGoalReminders from './components/DailyGoalReminders';
import SmartMotivationalAlerts from './components/SmartMotivationalAlerts';

const RemindersNotifications = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [globalSettings, setGlobalSettings] = useState({
        notificationsEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        doNotDisturbEnabled: false,
        dndStart: '22:00',
        dndEnd: '07:00',
    });

    const [activeSection, setActiveSection] = useState('streak');

    useEffect(() => {
        if (user?.id) {
            loadSettings();
        }
    }, [user?.id]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const settings = await settingsService?.get(user?.id);
            
            if (settings?.notifications) {
                setGlobalSettings({
                    notificationsEnabled: settings?.notifications?.enabled ?? true,
                    soundEnabled: settings?.notifications?.sound ?? true,
                    vibrationEnabled: settings?.notifications?.vibration ?? true,
                    doNotDisturbEnabled: settings?.notifications?.doNotDisturb ?? false,
                    dndStart: settings?.notifications?.dndStart || '22:00',
                    dndEnd: settings?.notifications?.dndEnd || '07:00',
                });
            }
        } catch (err) {
            console.error('Error loading settings:', err);
            setError(err?.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleGlobalToggle = async (key) => {
        const newSettings = {
            ...globalSettings,
            [key]: !globalSettings?.[key],
        };
        setGlobalSettings(newSettings);

        try {
            // Update settings in database
            await settingsService?.update(user?.id, {
                notifications: {
                    enabled: newSettings?.notificationsEnabled,
                    sound: newSettings?.soundEnabled,
                    vibration: newSettings?.vibrationEnabled,
                    doNotDisturb: newSettings?.doNotDisturbEnabled,
                    dndStart: newSettings?.dndStart,
                    dndEnd: newSettings?.dndEnd,
                }
            });
        } catch (err) {
            console.error('Error updating settings:', err);
            setError(err?.message || 'Failed to update settings');
        }
    };

    const handleDNDTimeChange = async (key, value) => {
        const newSettings = {
            ...globalSettings,
            [key]: value,
        };
        setGlobalSettings(newSettings);

        try {
            // Update settings in database
            await settingsService?.update(user?.id, {
                notifications: {
                    enabled: newSettings?.notificationsEnabled,
                    sound: newSettings?.soundEnabled,
                    vibration: newSettings?.vibrationEnabled,
                    doNotDisturb: newSettings?.doNotDisturbEnabled,
                    dndStart: newSettings?.dndStart,
                    dndEnd: newSettings?.dndEnd,
                }
            });
        } catch (err) {
            console.error('Error updating DND time:', err);
            setError(err?.message || 'Failed to update DND time');
        }
    };

    const handleTestNotification = () => {
        // Simulate test notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Test Notification 🎉', {
                body: 'This is how your notifications will appear!',
                icon: '/favicon.ico',
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission()?.then((permission) => {
                if (permission === 'granted') {
                    new Notification('Test Notification 🎉', {
                        body: 'This is how your notifications will appear!',
                        icon: '/favicon.ico',
                    });
                }
            });
        }
    };

    const sections = [
        { id: 'streak', label: 'Streak Milestones', icon: '🔥' },
        { id: 'daily', label: 'Daily Goals', icon: '🎯' },
        { id: 'smart', label: 'Smart Alerts', icon: '🤖' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}
                
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                                <Bell className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Reminders & Notifications
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Stay motivated with personalized alerts and milestone celebrations
                                </p>
                            </div>
                        </div>

                        {/* Global Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Master Toggle */}
                            <button
                                onClick={() => handleGlobalToggle('notificationsEnabled')}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                                    globalSettings?.notificationsEnabled
                                        ? 'bg-green-600 hover:bg-green-700 text-white' :'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {globalSettings?.notificationsEnabled ? (
                                    <Bell className="h-5 w-5" />
                                ) : (
                                    <BellOff className="h-5 w-5" />
                                )}
                                <span>
                                    {globalSettings?.notificationsEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </button>

                            {/* Test Notification */}
                            <button
                                onClick={handleTestNotification}
                                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                            >
                                <TestTube className="h-5 w-5" />
                                <span className="hidden sm:inline">Test</span>
                            </button>

                            {/* Settings Dropdown Indicator */}
                            <button
                                onClick={() => handleGlobalToggle('doNotDisturbEnabled')}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                                    globalSettings?.doNotDisturbEnabled
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white' :'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <Moon className="h-5 w-5" />
                                <span className="hidden sm:inline">DND</span>
                            </button>
                        </div>
                    </div>

                    {/* Do Not Disturb Settings */}
                    {globalSettings?.doNotDisturbEnabled && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        DND Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={globalSettings?.dndStart}
                                        onChange={(e) => handleDNDTimeChange('dndStart', e?.target?.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        DND End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={globalSettings?.dndEnd}
                                        onChange={(e) => handleDNDTimeChange('dndEnd', e?.target?.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sound & Vibration Settings */}
                    {globalSettings?.notificationsEnabled && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => handleGlobalToggle('soundEnabled')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                        globalSettings?.soundEnabled
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    <Volume2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">Sound</span>
                                </button>
                                <button
                                    onClick={() => handleGlobalToggle('vibrationEnabled')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                        globalSettings?.vibrationEnabled
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    <span className="text-sm font-medium">📳 Vibration</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 mb-6">
                    <div className="flex flex-wrap gap-3">
                        {sections?.map((section) => (
                            <button
                                key={section?.id}
                                onClick={() => setActiveSection(section?.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                    activeSection === section?.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                <span className="text-xl">{section?.icon}</span>
                                <span>{section?.label}</span>
                                {activeSection === section?.id && <ChevronRight className="h-5 w-5" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {activeSection === 'streak' && (
                        <StreakMilestoneAlerts globalEnabled={globalSettings?.notificationsEnabled} />
                    )}
                    {activeSection === 'daily' && (
                        <DailyGoalReminders globalEnabled={globalSettings?.notificationsEnabled} />
                    )}
                    {activeSection === 'smart' && (
                        <SmartMotivationalAlerts globalEnabled={globalSettings?.notificationsEnabled} />
                    )}
                </div>

                {/* Device Preview Section */}
                <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">📱 Real-time Preview</h3>
                            <p className="text-blue-100">
                                See how notifications will appear on your devices
                            </p>
                        </div>
                        <button
                            onClick={handleTestNotification}
                            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                        >
                            Preview Notification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemindersNotifications;