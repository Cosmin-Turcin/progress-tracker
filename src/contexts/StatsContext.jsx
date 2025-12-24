import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { activityService } from '../services/activityService';
import { settingsService } from '../services/settingsService';
import { useAuth } from './AuthContext';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
    const { user } = useAuth();
    const [dailyPoints, setDailyPoints] = useState(0);
    const [weeklyAverage, setWeeklyAverage] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(200); // Default goal
    const [activityPoints, setActivityPoints] = useState(null);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [loading, setLoading] = useState(false);

    const refreshStats = useCallback(async (date = new Date()) => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const stats = await activityService?.getStatistics(user?.id, date);

            setDailyPoints(stats?.totalPoints || 0);
            setCurrentStreak(stats?.currentStreak || 0);

            // Load weekly average
            const endDate = new Date(date);
            const startDate = new Date(date);
            startDate?.setDate(startDate?.getDate() - 7);

            const weekActivities = await activityService?.getByDateRange(user?.id, startDate, endDate);
            const weekTotal = weekActivities?.reduce((sum, a) => sum + a?.points, 0) || 0;
            setWeeklyAverage(Math.round(weekTotal / 7));

            // Load user settings
            const settings = await settingsService?.get(user?.id);
            if (settings) {
                setDailyGoal(settings?.dailyGoals?.dailyGoal || 200);
                setActivityPoints(settings?.activityPoints);
            }
        } catch (error) {
            console.error('Error refreshing global stats:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            refreshStats();
        }
    }, [user?.id, refreshStats]);

    const goalProgress = Math.min(Math.round((dailyPoints / dailyGoal) * 100), 100);

    return (
        <StatsContext.Provider value={{
            dailyPoints,
            weeklyAverage,
            dailyGoal,
            activityPoints,
            goalProgress,
            currentStreak,
            loading,
            refreshStats
        }}>
            {children}
        </StatsContext.Provider>
    );
};

export const useStats = () => {
    const context = useContext(StatsContext);
    if (!context) {
        throw new Error('useStats must be used within a StatsProvider');
    }
    return context;
};
