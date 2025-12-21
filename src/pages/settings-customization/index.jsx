import React, { useState, useEffect } from 'react';



import ActivityPointsConfig from './components/ActivityPointsConfig';
import DailyGoalsManager from './components/DailyGoalsManager';
import NotificationPreferences from './components/NotificationPreferences';
import SystemPreferences from './components/SystemPreferences';
import { useAuth } from '../../contexts/AuthContext';
import { settingsService } from '../../services/settingsService';
import Header from '../../components/Header';

const SettingsCustomization = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('activity-points');
    const [searchQuery, setSearchQuery] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({
        activityPoints: {
            fitness: { base: 10, multiplier: 1.5 },
            mindset: { base: 8, multiplier: 1.3 },
            nutrition: { base: 5, multiplier: 1.2 },
            work: { base: 15, multiplier: 1.4 },
            social: { base: 7, multiplier: 1.1 },
        },
        dailyGoals: {
            totalPoints: 100,
            activityFrequency: 5,
            streakTarget: 7,
        },
        notifications: {
            pushEnabled: true,
            emailSummary: true,
            reminderTime: '09:00',
            achievementAlerts: true,
        },
        systemPreferences: {
            theme: 'light',
            language: 'en',
            autoExport: false,
            privacyMode: false,
        },
    });

    const tabs = [
        { id: 'activity-points', label: 'Activity Points', icon: '🎯' },
        { id: 'daily-goals', label: 'Daily Goals', icon: '🎖️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'system', label: 'System', icon: '⚙️' },
    ];

    useEffect(() => {
        if (user?.id) {
            loadSettings();
        }
    }, [user]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await settingsService?.get(user?.id);
            
            setSettings({
                activityPoints: data?.activityPoints || settings?.activityPoints,
                dailyGoals: data?.dailyGoals || settings?.dailyGoals,
                notifications: data?.notifications || settings?.notifications,
                systemPreferences: data?.systemPreferences || settings?.systemPreferences,
            });
        } catch (err) {
            console.error('Error loading settings:', err);
            setError(err?.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev?.[category],
                [key]: value,
            },
        }));
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        try {
            setError('');
            await settingsService?.update(user?.id, settings);
            setHasUnsavedChanges(false);
            alert('Settings saved successfully!');
        } catch (err) {
            console.error('Error saving settings:', err);
            setError(err?.message || 'Failed to save settings');
            alert('Failed to save settings. Please try again.');
        }
    };

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
            try {
                setError('');
                const defaultSettings = await settingsService?.reset(user?.id);
                setSettings({
                    activityPoints: defaultSettings?.activityPoints,
                    dailyGoals: defaultSettings?.dailyGoals,
                    notifications: defaultSettings?.notifications,
                    systemPreferences: defaultSettings?.systemPreferences,
                });
                setHasUnsavedChanges(false);
                alert('Settings reset to defaults successfully!');
            } catch (err) {
                console.error('Error resetting settings:', err);
                setError(err?.message || 'Failed to reset settings');
                alert('Failed to reset settings. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
                loadSettings();
                setHasUnsavedChanges(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3">
                        <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
                            {tabs?.map((tab) => (
                                <button
                                    key={tab?.id}
                                    onClick={() => setActiveTab(tab?.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeTab === tab?.id
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="text-xl">{tab?.icon}</span>
                                    <span className="font-medium">{tab?.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Quick Info Card */}
                        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                💡 Pro Tip
                            </h3>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Customize point values to match your personal goals and priorities. Higher multipliers reward consistency!
                            </p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            {activeTab === 'activity-points' && (
                                <ActivityPointsConfig
                                    settings={settings?.activityPoints}
                                    onChange={(key, value) => handleSettingChange('activityPoints', key, value)}
                                />
                            )}
                            {activeTab === 'daily-goals' && (
                                <DailyGoalsManager
                                    settings={settings?.dailyGoals}
                                    onChange={(key, value) => handleSettingChange('dailyGoals', key, value)}
                                />
                            )}
                            {activeTab === 'notifications' && (
                                <NotificationPreferences
                                    settings={settings?.notifications}
                                    onChange={(key, value) => handleSettingChange('notifications', key, value)}
                                />
                            )}
                            {activeTab === 'system' && (
                                <SystemPreferences
                                    settings={settings?.systemPreferences}
                                    onChange={(key, value) => handleSettingChange('systemPreferences', key, value)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsCustomization;