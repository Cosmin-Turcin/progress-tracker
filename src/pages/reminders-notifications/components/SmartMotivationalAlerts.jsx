import React, { useState } from 'react';
import { Brain, TrendingDown, Heart, Lightbulb, AlertCircle, Zap } from 'lucide-react';

const SmartMotivationalAlerts = ({ globalEnabled }) => {
    const [alertTypes, setAlertTypes] = useState({
        lowActivityPeriod: {
            enabled: true,
            threshold: 3,
            message: "We\'ve noticed you\'ve been less active lately. Small steps lead to big changes! 💪",
        },
        habitSlipDetection: {
            enabled: true,
            threshold: 2,
            message: "Don\'t worry about missing a day! Every champion has setbacks. Get back on track! 🎯",
        },
        recoverySupportMessages: {
            enabled: true,
            message: "You\'re stronger than you think! Let\'s rebuild that momentum together. 🌟",
        },
        positiveReinforcementBoosts: {
            enabled: true,
            frequency: 'daily',
            message: "You're doing amazing! Your consistency is inspiring. Keep shining! ✨",
        },
    });

    const [aiSettings, setAiSettings] = useState({
        contextualEncouragement: true,
        personalizedTiming: true,
        emotionalToneAdaptation: false,
        progressBasedMessaging: true,
    });

    const handleAlertToggle = (key) => {
        setAlertTypes((prev) => ({
            ...prev,
            [key]: {
                ...prev?.[key],
                enabled: !prev?.[key]?.enabled,
            },
        }));
    };

    const handleThresholdChange = (key, value) => {
        setAlertTypes((prev) => ({
            ...prev,
            [key]: {
                ...prev?.[key],
                threshold: parseInt(value),
            },
        }));
    };

    const handleMessageChange = (key, value) => {
        setAlertTypes((prev) => ({
            ...prev,
            [key]: {
                ...prev?.[key],
                message: value,
            },
        }));
    };

    const handleAISettingToggle = (key) => {
        setAiSettings((prev) => ({
            ...prev,
            [key]: !prev?.[key],
        }));
    };

    const alertConfigs = [
        {
            key: 'lowActivityPeriod',
            label: 'Low Activity Alerts',
            description: 'Get gentle reminders during periods of reduced activity',
            icon: <TrendingDown className="h-5 w-5" />,
            color: 'blue',
            hasThreshold: true,
            thresholdLabel: 'Alert after inactive days',
        },
        {
            key: 'habitSlipDetection',
            label: 'Habit Slip Detection',
            description: 'Early warnings when you might be falling off track',
            icon: <AlertCircle className="h-5 w-5" />,
            color: 'orange',
            hasThreshold: true,
            thresholdLabel: 'Alert after missed days',
        },
        {
            key: 'recoverySupportMessages',
            label: 'Recovery Support',
            description: 'Encouraging messages to help you bounce back',
            icon: <Heart className="h-5 w-5" />,
            color: 'red',
            hasThreshold: false,
        },
        {
            key: 'positiveReinforcementBoosts',
            label: 'Positive Reinforcement',
            description: 'Regular doses of motivation and encouragement',
            icon: <Zap className="h-5 w-5" />,
            color: 'yellow',
            hasThreshold: false,
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: {
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                text: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-200 dark:border-blue-800',
                gradient: 'from-blue-500 to-cyan-600',
            },
            orange: {
                bg: 'bg-orange-50 dark:bg-orange-900/20',
                text: 'text-orange-600 dark:text-orange-400',
                border: 'border-orange-200 dark:border-orange-800',
                gradient: 'from-orange-500 to-red-600',
            },
            red: {
                bg: 'bg-red-50 dark:bg-red-900/20',
                text: 'text-red-600 dark:text-red-400',
                border: 'border-red-200 dark:border-red-800',
                gradient: 'from-red-500 to-pink-600',
            },
            yellow: {
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                text: 'text-yellow-600 dark:text-yellow-400',
                border: 'border-yellow-200 dark:border-yellow-800',
                gradient: 'from-yellow-500 to-orange-600',
            },
        };
        return colors?.[color];
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Smart Motivational Alerts
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            AI-driven insights delivering contextual encouragement when you need it most
                        </p>
                    </div>
                </div>
                {!globalEnabled && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                            ⚠️ Global notifications are disabled. Enable them to receive smart alerts.
                        </p>
                    </div>
                )}
            </div>
            {/* Alert Type Configuration */}
            <div className="space-y-4 mb-6">
                {alertConfigs?.map((config) => {
                    const alert = alertTypes?.[config?.key];
                    const colors = getColorClasses(config?.color);

                    return (
                        <div
                            key={config?.key}
                            className={`rounded-xl border-2 transition-all ${
                                alert?.enabled && globalEnabled
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
                                            <span className="text-white">{config?.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {config?.label}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {config?.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => handleAlertToggle(config?.key)}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                            alert?.enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                        disabled={!globalEnabled}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                                alert?.enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Threshold Setting */}
                                {alert?.enabled && globalEnabled && config?.hasThreshold && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {config?.thresholdLabel}
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="1"
                                                max="7"
                                                value={alert?.threshold}
                                                onChange={(e) => handleThresholdChange(config?.key, e?.target?.value)}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <span className="text-lg font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-4 py-2 rounded-lg min-w-[60px] text-center">
                                                {alert?.threshold}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Message Customization */}
                                {alert?.enabled && globalEnabled && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Alert Message
                                        </label>
                                        <textarea
                                            value={alert?.message}
                                            onChange={(e) => handleMessageChange(config?.key, e?.target?.value)}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                            rows="3"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* AI Settings */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            AI Enhancement Settings
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Fine-tune how AI personalizes your motivational messages
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Contextual Encouragement
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Messages adapt to your current situation and progress
                            </p>
                        </div>
                        <button
                            onClick={() => handleAISettingToggle('contextualEncouragement')}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                aiSettings?.contextualEncouragement ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            disabled={!globalEnabled}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    aiSettings?.contextualEncouragement ? 'translate-x-5' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Personalized Timing
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Deliver messages when you're most receptive
                            </p>
                        </div>
                        <button
                            onClick={() => handleAISettingToggle('personalizedTiming')}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                aiSettings?.personalizedTiming ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            disabled={!globalEnabled}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    aiSettings?.personalizedTiming ? 'translate-x-5' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Emotional Tone Adaptation
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Match message tone to your emotional patterns
                            </p>
                        </div>
                        <button
                            onClick={() => handleAISettingToggle('emotionalToneAdaptation')}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                aiSettings?.emotionalToneAdaptation ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            disabled={!globalEnabled}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    aiSettings?.emotionalToneAdaptation ? 'translate-x-5' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Progress-Based Messaging
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Celebrate achievements and milestones automatically
                            </p>
                        </div>
                        <button
                            onClick={() => handleAISettingToggle('progressBasedMessaging')}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                aiSettings?.progressBasedMessaging ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            disabled={!globalEnabled}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    aiSettings?.progressBasedMessaging ? 'translate-x-5' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
            {/* Example Alerts Preview */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    💡 Smart Alert Examples
                </h3>
                <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Low Activity Detection
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            "Hey! We noticed you haven't logged activities in 3 days. No pressure - let's start with something small today! 🌱"
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Recovery Support
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            "Setbacks are part of the journey! You've shown amazing consistency before - you've got this! 💪"
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Positive Reinforcement
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            "Amazing work! You've been crushing your goals this week. Your dedication is inspiring! ⭐"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartMotivationalAlerts;