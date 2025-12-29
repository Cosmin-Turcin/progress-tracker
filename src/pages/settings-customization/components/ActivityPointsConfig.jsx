import React, { useState } from 'react';



const ActivityPointsConfig = ({ settings, onChange }) => {
    const activityTypes = [
        { id: 'fitness', label: 'Fitness', icon: '🏃', description: 'Physical activities and workouts', color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' },
        { id: 'mindset', label: 'Mindset', icon: '🧘', description: 'Mindfulness, learning, and relaxation', color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' },
        { id: 'nutrition', label: 'Nutrition', icon: '🥗', description: 'Healthy eating and hydration', color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' },
        { id: 'work', label: 'Work', icon: '💼', description: 'Professional tasks and projects', color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' },
        { id: 'social', label: 'Social', icon: '👥', description: 'Social interactions and networking', color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' },
        { id: 'others', label: 'Others', icon: '✨', description: 'Miscellaneous activities', color: 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800' },
    ];

    const difficultyLevels = [
        { level: 'light', label: 'Easy', multiplier: 0.7, color: 'text-green-600 dark:text-green-400' },
        { level: 'normal', label: 'Medium', multiplier: 1.0, color: 'text-blue-600 dark:text-blue-400' },
        { level: 'intense', label: 'Hard', multiplier: 1.5, color: 'text-red-600 dark:text-red-400' },
    ];

    const calculatePoints = (base, multiplier, diffMultiplier) => {
        return Math.round(base * multiplier * diffMultiplier);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Activity Points Configuration
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Standardized point values for all activities based on category and intensity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activityTypes?.map((activity) => {
                    const activitySettings = settings?.[activity?.id] || { base: 10, multiplier: 1.0 };

                    return (
                        <div
                            key={activity?.id}
                            className={`border rounded-xl p-5 ${activity?.color} transition-shadow hover:shadow-sm`}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <span className="text-3xl bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-inherit">
                                    {activity?.icon}
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {activity?.label}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                        {activity?.description}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Point Breakdown</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {difficultyLevels?.map((level) => (
                                        <div key={level?.level} className="text-center">
                                            <p className="text-[10px] text-gray-500 mb-1">{level?.label}</p>
                                            <p className={`text-lg font-bold ${level?.color}`}>
                                                {calculatePoints(activitySettings?.base, activitySettings?.multiplier, level?.multiplier)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Summary Section */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    📊 Configuration Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Activity Types</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {activityTypes?.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Average Base Points</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {Math.round(
                                Object.values(settings || {})?.reduce((sum, s) => sum + (s?.base || 0), 0) /
                                activityTypes?.length
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Max Possible Points</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {Object.values(settings || {})?.reduce(
                                (sum, s) => sum + calculatePoints(s?.base || 0, s?.multiplier || 1, 1.5),
                                0
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityPointsConfig;