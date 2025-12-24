import React from 'react';
import { Target, TrendingUp, Zap, Calendar } from 'lucide-react';

const DailyGoalsManager = ({ settings, onChange }) => {
    const handleSliderChange = (key, value) => {
        onChange(key, parseInt(value));
    };

    const goalConfigs = [
        {
            key: 'dailyGoal',
            label: 'Daily Points Target',
            icon: <Target className="h-5 w-5" />,
            min: 50,
            max: 500,
            step: 10,
            unit: 'points',
            color: 'bg-blue-500',
            description: 'Total points you aim to achieve each day',
        },
        {
            key: 'activityFrequency',
            label: 'Activity Frequency Goal',
            icon: <Zap className="h-5 w-5" />,
            min: 1,
            max: 20,
            step: 1,
            unit: 'activities',
            color: 'bg-green-500',
            description: 'Number of activities to complete daily',
        },
        {
            key: 'streakTarget',
            label: 'Streak Objective',
            icon: <TrendingUp className="h-5 w-5" />,
            min: 3,
            max: 365,
            step: 1,
            unit: 'days',
            color: 'bg-orange-500',
            description: 'Consecutive days to maintain your streak',
        },
    ];

    const getRecommendation = (key, value) => {
        const recommendations = {
            dailyGoal: {
                low: value < 100 ? 'Consider setting a higher target for better results' : null,
                optimal: value >= 100 && value <= 200 ? 'Great balanced target!' : null,
                high: value > 200 ? 'Ambitious goal - make sure it\'s sustainable' : null,
            },
            activityFrequency: {
                low: value < 3 ? 'Try to aim for at least 3 activities per day' : null,
                optimal: value >= 3 && value <= 8 ? 'Perfect frequency for building habits' : null,
                high: value > 8 ? 'High frequency - ensure quality over quantity' : null,
            },
            streakTarget: {
                low: value < 7 ? 'Start with weekly streaks and build up' : null,
                optimal: value >= 7 && value <= 30 ? 'Excellent streak goal for consistency' : null,
                high: value > 30 ? 'Long-term commitment - stay motivated!' : null,
            },
        };

        const rec = recommendations?.[key];
        return rec?.low || rec?.optimal || rec?.high;
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Daily Goals Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set personalized targets and track your progress with adaptive recommendations
                </p>
            </div>
            {/* Goal Configuration Cards */}
            <div className="space-y-6">
                {goalConfigs?.map((config) => {
                    const value = settings?.[config?.key] || config?.min;
                    const percentage = ((value - config?.min) / (config?.max - config?.min)) * 100;
                    const recommendation = getRecommendation(config?.key, value);

                    return (
                        <div
                            key={config?.key}
                            className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 ${config?.color} rounded-lg text-white`}>
                                        {config?.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {config?.label}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {config?.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {value}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                        {config?.unit}
                                    </span>
                                </div>
                            </div>
                            {/* Slider */}
                            <div className="mb-4">
                                <input
                                    type="range"
                                    min={config?.min}
                                    max={config?.max}
                                    step={config?.step}
                                    value={value}
                                    onChange={(e) => handleSliderChange(config?.key, e?.target?.value)}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, ${config?.color?.replace('bg-', '')
                                            } 0%, ${config?.color?.replace('bg-', '')} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
                                    }}
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>{config?.min} {config?.unit}</span>
                                    <span>{config?.max} {config?.unit}</span>
                                </div>
                            </div>
                            {/* Recommendation */}
                            {recommendation && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        💡 {recommendation}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Progress Projection */}
            <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Weekly Projection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekly Points</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {(settings?.dailyGoal || 0) * 7}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Based on daily target
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekly Activities</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {(settings?.activityFrequency || 0) * 7}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Total completions
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Streak Progress</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {Math.round((7 / (settings?.streakTarget || 1)) * 100)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Of target achieved
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyGoalsManager;