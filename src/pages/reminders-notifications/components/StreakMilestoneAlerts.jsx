import React, { useState } from 'react';
import { Flame, Trophy, Target, Award, Share2, Edit3 } from 'lucide-react';

const StreakMilestoneAlerts = ({ globalEnabled }) => {
    const [milestones, setMilestones] = useState([
        {
            id: '3day',
            days: 3,
            enabled: true,
            message: "You\'re on fire! 3-day streak unlocked! 🔥",
            shareEnabled: true,
            customMessage: '',
        },
        {
            id: '7day',
            days: 7,
            enabled: true,
            message: 'Incredible! One week of consistency! Keep going! 🌟',
            shareEnabled: true,
            customMessage: '',
        },
        {
            id: '14day',
            days: 14,
            enabled: true,
            message: 'Two weeks strong! You\'re unstoppable! 💪',
            shareEnabled: true,
            customMessage: '',
        },
        {
            id: '30day',
            days: 30,
            enabled: true,
            message: '30-day streak! You\'ve built a powerful habit! 🏆',
            shareEnabled: true,
            customMessage: '',
        },
        {
            id: '100day',
            days: 100,
            enabled: true,
            message: '100 days! You\'re a habit master! Legend status achieved! 👑',
            shareEnabled: true,
            customMessage: '',
        },
    ]);

    const [editingId, setEditingId] = useState(null);

    const handleToggle = (id, field) => {
        setMilestones((prev) =>
            prev?.map((m) => (m?.id === id ? { ...m, [field]: !m?.[field] } : m))
        );
    };

    const handleMessageUpdate = (id, value) => {
        setMilestones((prev) =>
            prev?.map((m) => (m?.id === id ? { ...m, customMessage: value } : m))
        );
    };

    const saveCustomMessage = (id) => {
        const milestone = milestones?.find((m) => m?.id === id);
        if (milestone?.customMessage?.trim()) {
            setMilestones((prev) =>
                prev?.map((m) =>
                    m?.id === id ? { ...m, message: m?.customMessage, customMessage: '' } : m
                )
            );
        }
        setEditingId(null);
    };

    const getMilestoneColor = (days) => {
        if (days <= 3) return { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' };
        if (days <= 7) return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
        if (days <= 14) return { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
        if (days <= 30) return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' };
        return { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' };
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                        <Flame className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Streak Milestone Alerts
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Celebrate your consistency with custom achievement messages
                        </p>
                    </div>
                </div>
                {!globalEnabled && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                            ⚠️ Global notifications are disabled. Enable them to receive streak alerts.
                        </p>
                    </div>
                )}
            </div>
            <div className="space-y-4">
                {milestones?.map((milestone) => {
                    const colors = getMilestoneColor(milestone?.days);
                    const isEditing = editingId === milestone?.id;

                    return (
                        <div
                            key={milestone?.id}
                            className={`rounded-xl border-2 transition-all ${
                                milestone?.enabled && globalEnabled
                                    ? `${colors?.bg} ${colors?.border}`
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-3 rounded-xl ${
                                                milestone?.enabled && globalEnabled
                                                    ? colors?.bg
                                                    : 'bg-gray-200 dark:bg-gray-700'
                                            }`}
                                        >
                                            {milestone?.days === 100 ? (
                                                <Award className={`h-6 w-6 ${milestone?.enabled && globalEnabled ? colors?.text : 'text-gray-500'}`} />
                                            ) : (
                                                <Trophy className={`h-6 w-6 ${milestone?.enabled && globalEnabled ? colors?.text : 'text-gray-500'}`} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {milestone?.days}-Day Streak
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Milestone achievement alert
                                            </p>
                                        </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => handleToggle(milestone?.id, 'enabled')}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                            milestone?.enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                        disabled={!globalEnabled}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                                milestone?.enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Message Display/Edit */}
                                <div className="mb-4">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <textarea
                                                value={milestone?.customMessage || milestone?.message}
                                                onChange={(e) => handleMessageUpdate(milestone?.id, e?.target?.value)}
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                rows="3"
                                                placeholder="Enter your custom celebration message..."
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveCustomMessage(milestone?.id)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                                                >
                                                    Save Message
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between gap-4">
                                            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium flex-1">
                                                {milestone?.message}
                                            </p>
                                            <button
                                                onClick={() => setEditingId(milestone?.id)}
                                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                                                disabled={!milestone?.enabled || !globalEnabled}
                                            >
                                                <Edit3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Options */}
                                {milestone?.enabled && globalEnabled && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Share2 className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Enable social sharing
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleToggle(milestone?.id, 'shareEnabled')}
                                                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                                    milestone?.shareEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        milestone?.shareEnabled ? 'translate-x-5' : 'translate-x-1'
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
            {/* Preview Section */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Notification Preview
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-600 rounded-lg">
                            <Flame className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white mb-1">
                                Streak Milestone! 🎉
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {milestones?.[0]?.message}
                            </p>
                            <div className="mt-2 flex gap-2">
                                <button className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                    View Progress
                                </button>
                                <button className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreakMilestoneAlerts;