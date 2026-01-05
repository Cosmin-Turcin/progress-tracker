import React from 'react';
import { Trophy, Flame, Target, Award, Calendar, TrendingUp, Activity, Zap } from 'lucide-react';

export default function ProfileStats({ stats, userStats, isOwnProfile }) {
    const getComparison = (friendValue, userValue) => {
        if (isOwnProfile || !userStats) return null;

        const friend = typeof friendValue === 'string' ? parseInt(friendValue) : friendValue;
        const user = typeof userValue === 'string' ? parseInt(userValue) : userValue;

        if (friend > user) {
            return { text: `${friend - user} ahead of you`, color: 'text-orange-600', icon: TrendingUp };
        } else if (user > friend) {
            return { text: `${user - friend} behind you`, color: 'text-green-600', icon: TrendingUp };
        }
        return { text: 'Same as you', color: 'text-blue-600' };
    };

    const mainStats = [
        {
            icon: Target,
            label: 'Total Score',
            value: stats?.total_points || 0,
            userValue: userStats?.total_points,
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600',
            description: 'Points earned'
        },
        {
            icon: Flame,
            label: 'Current Streak',
            value: stats?.current_streak || 0,
            userValue: userStats?.current_streak,
            color: 'green',
            gradient: 'from-green-500 to-green-600',
            suffix: ' days',
            description: 'Days in a row'
        },
        {
            icon: Award,
            label: 'Achievements',
            value: stats?.total_achievements || stats?.achievements_unlocked || 0,
            userValue: userStats?.total_achievements || userStats?.achievements_unlocked,
            color: 'purple',
            gradient: 'from-purple-500 to-purple-600',
            description: 'Unlocked badges'
        }
    ];

    const detailStats = [
        {
            icon: Activity,
            label: 'Total Sessions',
            value: stats?.total_activities || 0,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: Zap,
            label: 'Longest Streak',
            value: `${stats?.longest_streak || 0} days`,
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        },
        {
            icon: Calendar,
            label: 'Last Activity',
            value: stats?.last_activity_date
                ? new Date(stats?.last_activity_date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'No activity',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Primary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainStats.map((stat, index) => {
                    const comparison = getComparison(stat.value, stat.userValue);
                    return (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform`}
                        >
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <stat.icon className="w-8 h-8 opacity-80" />
                                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{stat.label}</span>
                            </div>
                            <p className="text-4xl font-bold relative z-10">
                                {stat.value}{stat.suffix || ''}
                            </p>
                            <p className="text-sm opacity-90 mt-2 relative z-10">{stat.description}</p>

                            {comparison && (
                                <div className="mt-4 pt-4 border-t border-white/20 relative z-10 flex items-center gap-2">
                                    <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                        {comparison.text}
                                    </span>
                                </div>
                            )}

                            {/* Decorative background icon */}
                            <stat.icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform" />
                        </div>
                    );
                })}
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {detailStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4 hover:border-blue-100 transition-colors shadow-sm">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Consistency Bar (Personal Only) */}
            {isOwnProfile && stats?.current_streak > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Consistency Rating</h3>
                            <p className="text-sm text-gray-500">Based on your 30-day activity</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-blue-600">
                                {Math.round(((stats?.current_streak || 0) / 30) * 100)}%
                            </span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                                width: `${Math.min(((stats?.current_streak || 0) / 30) * 100, 100)}%`
                            }}
                        ></div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-sm text-gray-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span>Keep your streak alive to reach 100% consistency this month!</span>
                    </div>
                </div>
            )}
        </div>
    );
}
