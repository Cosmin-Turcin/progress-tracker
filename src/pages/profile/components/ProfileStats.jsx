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
            {/* Primary Stats Row - Hero Redesign */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainStats.map((stat, index) => {
                    const comparison = getComparison(stat.value, stat.userValue);
                    return (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br ${stat.gradient}`}
                        >
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2 opacity-90">
                                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-widest">{stat.label}</span>
                                    </div>

                                    <div className="mt-4">
                                        <span className="text-6xl font-black tracking-tighter leading-none">
                                            {stat.value}
                                        </span>
                                        {stat.suffix && <span className="text-2xl font-bold opacity-80 ml-1">{stat.suffix}</span>}
                                    </div>
                                    <p className="mt-2 font-medium opacity-80 text-sm">{stat.description}</p>
                                </div>

                                {comparison && (
                                    <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-2">
                                        <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                                            {comparison.icon ? <comparison.icon className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                        </div>
                                        <span className="font-bold text-sm text-white drop-shadow-sm">
                                            {comparison.text}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Decorative background Elements */}
                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <stat.icon className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 transform rotate-12 group-hover:rotate-6 transition-transform pointer-events-none" />
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
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative">
                        {/* Grid markers for visual metric feeling */}
                        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/50 z-10"></div>
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/50 z-10"></div>
                        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white/50 z-10"></div>

                        <div
                            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
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
