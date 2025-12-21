import React, { useState } from 'react';



const ActivityPointsConfig = ({ settings, onChange }) => {
    const activityTypes = [
        { id: 'exercise', label: 'Exercise', icon: '🏃', description: 'Physical activities and workouts', color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' },
        { id: 'reading', label: 'Reading', icon: '📚', description: 'Books, articles, and learning', color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' },
        { id: 'meditation', label: 'Meditation', icon: '🧘', description: 'Mindfulness and relaxation', color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' },
        { id: 'work', label: 'Work', icon: '💼', description: 'Professional tasks and projects', color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' },
        { id: 'social', label: 'Social', icon: '👥', description: 'Social interactions and networking', color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' },
    ];

    const difficultyLevels = [
        { level: 1, label: 'Easy', multiplier: 1.0 },
        { level: 2, label: 'Medium', multiplier: 1.5 },
        { level: 3, label: 'Hard', multiplier: 2.0 },
    ];

    const handleBasePointChange = (activityId, value) => {
        const numValue = parseInt(value) || 0;
        onChange(activityId, {
            ...settings?.[activityId],
            base: numValue,
        });
    };

    const handleMultiplierChange = (activityId, value) => {
        const numValue = parseFloat(value) || 1.0;
        onChange(activityId, {
            ...settings?.[activityId],
            multiplier: numValue,
        });
    };

    const calculateProjectedPoints = (base, multiplier) => {
        return Math.round(base * multiplier);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Activity Points Configuration
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customize point values for each activity type and set difficulty multipliers
                </p>
            </div>
            {/* Activity Configuration Cards */}
            <div className="space-y-4">
                {activityTypes?.map((activity) => {
                    const activitySettings = settings?.[activity?.id] || { base: 0, multiplier: 1.0 };
                    const projectedPoints = calculateProjectedPoints(
                        activitySettings?.base,
                        activitySettings?.multiplier
                    );

                    return (
                        <div
                            key={activity?.id}
                            className={`border rounded-lg p-5 ${activity?.color}`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{activity?.icon}</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {activity?.label}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {activity?.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                                    {/* Base Points */}
                                    <div className="min-w-[120px]">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Base Points
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={activitySettings?.base}
                                            onChange={(e) => handleBasePointChange(activity?.id, e?.target?.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    {/* Difficulty Multiplier */}
                                    <div className="min-w-[140px]">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Difficulty Multiplier
                                        </label>
                                        <input
                                            type="number"
                                            min="1.0"
                                            max="3.0"
                                            step="0.1"
                                            value={activitySettings?.multiplier}
                                            onChange={(e) => handleMultiplierChange(activity?.id, e?.target?.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    {/* Projected Points */}
                                    <div className="min-w-[120px]">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Max Points
                                        </label>
                                        <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-blue-600 dark:text-blue-400">
                                            {projectedPoints}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Difficulty Level Indicator */}
                            <div className="mt-4 flex gap-2">
                                {difficultyLevels?.map((level) => (
                                    <button
                                        key={level?.level}
                                        onClick={() => handleMultiplierChange(activity?.id, level?.multiplier)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                            Math.abs(activitySettings?.multiplier - level?.multiplier) < 0.1
                                                ? 'bg-blue-600 text-white' :'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {level?.label}
                                    </button>
                                ))}
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
                                (sum, s) => sum + calculateProjectedPoints(s?.base || 0, s?.multiplier || 1),
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