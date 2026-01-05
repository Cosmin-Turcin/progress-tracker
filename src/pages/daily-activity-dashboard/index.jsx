import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QuickActionButton from '../../components/ui/QuickActionButton';
import MetricCard from './components/MetricCard';
import TimelineChart from './components/TimelineChart';
import QuickAddButton from './components/QuickAddButton';
import ActivityFeedItem from './components/ActivityFeedItem';
import AchievementNotification from './components/AchievementNotification';
import AchievementOverlay from '../../components/ui/AchievementOverlay';
import ActivityLogCard from './components/ActivityLogCard';
import DateNavigator from './components/DateNavigator';
import QuickIntensityModal from './components/QuickIntensityModal';
import { useAuth } from '../../contexts/AuthContext';
import { useStats } from '../../contexts/StatsContext';
import { activityService } from '../../services/activityService';
import ManageShortcutsModal from './components/ManageShortcutsModal';
import { Settings } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { achievementService } from '../../services/achievementService';
import { realtimeService } from '../../services/realtimeService';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';

export default function DailyActivityDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    dailyPoints,
    weeklyAverage,
    dailyGoal,
    activityPoints,
    currentStreak,
    longestStreak,
    fitnessPoints,
    mindsetPoints,
    activitiesCount,
    comparison,
    refreshStats,
    quickShortcuts
  } = useStats();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [todayActivities, setTodayActivities] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activityFeed, setActivityFeed] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [quickAddActivity, setQuickAddActivity] = useState(null);
  const [showManageShortcuts, setShowManageShortcuts] = useState(false);


  useEffect(() => {
    if (currentDate && user?.id) {
      loadDashboardData(currentDate);
    }
  }, [currentDate, user?.id]);

  // Set up real-time subscriptions for instant activity updates
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscriptions for dashboard');

    // Subscribe to activity changes
    const unsubActivities = realtimeService?.subscribeToActivities(user?.id, {
      onInsert: (activity) => {
        console.log('Real-time: New activity logged', activity);
        // Add to activity feed if it's for today
        const activityDate = new Date(activity?.activityDate)?.toDateString();
        const currentDateStr = currentDate?.toDateString();

        if (activityDate === currentDateStr) {
          setActivityFeed(prev => [activity, ...(prev || [])]);
          // Refresh metrics
          loadDashboardData(currentDate);
        }
      },
      onUpdate: (activity) => {
        console.log('Real-time: Activity updated', activity);
        setActivityFeed(prev =>
          prev?.map(a => a?.id === activity?.id ? activity : a)
        );
        loadDashboardData(currentDate);
      },
      onDelete: (activity) => {
        console.log('Real-time: Activity deleted', activity);
        setActivityFeed(prev =>
          prev?.filter(a => a?.id !== activity?.id)
        );
        loadDashboardData(currentDate);
      }
    });

    // Subscribe to statistics updates (for streaks)
    const unsubStats = realtimeService?.subscribeToStatistics(user?.id, (stats) => {
      console.log('Real-time: Statistics updated', stats);
      // Update local metrics and refresh context stats
      setMetrics(prev => ({
        ...prev,
        currentStreak: stats?.currentStreak || 0
      }));
      refreshStats(currentDate);
    });

    // Subscribe to achievements
    const unsubAchievements = realtimeService?.subscribeToAchievements(user?.id, (achievement) => {
      console.log('Real-time: New achievement unlocked!', achievement);
      setAchievements(prev => [achievement, ...(prev || [])]?.slice(0, 5));
      setShowAchievement(achievement); // Trigger notification overlay
    });

    // Cleanup subscriptions on unmount
    return () => {
      if (unsubActivities) unsubActivities();
      if (unsubStats) unsubStats();
      if (unsubAchievements) unsubAchievements();
    };
  }, [user?.id, currentDate]);

  const loadDashboardData = async (date) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      // Load today's activities
      const todayData = await activityService?.getAll(user?.id, date);
      setTodayActivities(todayData || []);

      // Load recent activities (last 5)
      const recentData = await activityService?.getAll(user?.id);
      setRecentActivities((recentData || [])?.slice(0, 5));

      // Load timeline data
      const timeline = await activityService?.getTimelineData(user?.id, date);
      setTimelineData(timeline || []);



      // Load achievements
      const achievementsData = await achievementService?.getAll();
      setAchievements(achievementsData?.slice(0, 2) || []);

      // Refresh global stats context
      refreshStats(date);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate?.setDate(newDate?.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate?.setDate(newDate?.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleQuickAdd = (category, label) => {
    setQuickAddActivity({ category, label });
  };

  const handleSubmitQuickAdd = async (intensity) => {
    try {
      if (!quickAddActivity) return;

      const activityData = {
        activityName: quickAddActivity?.label,
        category: quickAddActivity?.category,
        intensity: intensity,
        activityDate: formatDate(new Date()),
        activityTime: new Date()?.toTimeString()?.split(' ')?.[0]
      };

      await activityService?.create(activityData);
      setQuickAddActivity(null);
      await loadDashboardData(currentDate);
      refreshStats(currentDate);
    } catch (err) {
      console.error('Error in quick add:', err);
      setError(err?.message || 'Failed to log quick activity');
    }
  };

  const handleActivityLogged = async (activity) => {
    try {
      await activityService?.create(activity);
      await loadDashboardData(currentDate);
      refreshStats(currentDate);
    } catch (err) {
      console.error('Error logging activity:', err);
      setError(err?.message || 'Failed to log activity');
    }
  };

  const handleEditActivity = async (activity) => {
    // For now, let's just implement a simple toggle of intensity or something to show it works
    // In a real app, this would open a modal with a form
    try {
      const newIntensity = activity?.intensity === 'intense' ? 'normal' : 'intense';
      await activityService?.update(activity?.id, { intensity: newIntensity });
      await loadDashboardData(currentDate);
      refreshStats(currentDate);
    } catch (err) {
      console.error('Error editing activity:', err);
      setError(err?.message || 'Failed to edit activity');
    }
  };

  const handleDeleteActivity = async (activity) => {
    try {
      await activityService?.delete(activity?.id);
      await loadDashboardData(currentDate);
      refreshStats(currentDate);
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError(err?.message || 'Failed to delete activity');
    }
  };

  // Helper to calculate trend
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { trend: 'up', value: current > 0 ? `+${current}` : '0' };
    const diff = current - previous;
    const percent = Math.round((diff / previous) * 100);
    return {
      trend: diff >= 0 ? 'up' : 'down',
      value: `${diff >= 0 ? '+' : ''}${percent}%`
    };
  };

  const fitnessTrend = calculateTrend(fitnessPoints, comparison?.prevFitnessPoints);
  const mindsetTrend = calculateTrend(mindsetPoints, comparison?.prevMindsetPoints);
  const activitiesTrend = {
    trend: (activitiesCount - (comparison?.prevActivitiesCount || 0)) >= 0 ? 'up' : 'down',
    value: `${activitiesCount - (comparison?.prevActivitiesCount || 0) >= 0 ? '+' : ''}${activitiesCount - (comparison?.prevActivitiesCount || 0)}`
  };
  const streakTrend = {
    trend: 'up',
    value: currentStreak > 0 && currentStreak === longestStreak ? 'New record' : 'Active'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionButton onActivityLogged={handleActivityLogged} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6">
          <DateNavigator
            currentDate={currentDate}
            onPrevious={handlePreviousDay}
            onNext={handleNextDay}
            onToday={handleToday}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <MetricCard
            title="Fitness Points"
            value={fitnessPoints}
            subtitle="Today's fitness activities"
            icon="Dumbbell"
            iconColor="var(--color-primary)"
            trend={fitnessTrend.trend}
            trendValue={fitnessTrend.value}
          />
          <MetricCard
            title="Mindset Points"
            value={mindsetPoints}
            subtitle="Today's mindset activities"
            icon="Brain"
            iconColor="var(--color-secondary)"
            trend={mindsetTrend.trend}
            trendValue={mindsetTrend.value}
          />
          <MetricCard
            title="Activities Completed"
            value={activitiesCount}
            subtitle="Total logged today"
            icon="CheckCircle"
            iconColor="var(--color-success)"
            trend={activitiesTrend.trend}
            trendValue={activitiesTrend.value}
          />
          <MetricCard
            title="Current Streak"
            value={`${currentStreak} days`}
            subtitle="Keep it going!"
            icon="Flame"
            iconColor="var(--color-accent)"
            trend={streakTrend.trend}
            trendValue={streakTrend.value}
            onClick={() => navigate('/achievements-badges-gallery')}
          />
        </div>

        {/* Daily Goal Progress */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6 lg:mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Daily Goal Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(Math.round((dailyPoints / dailyGoal) * 100), 100)}%` }}
              />
            </div>
            <span className="text-xl font-bold font-data text-primary">
              {Math.min(Math.round((dailyPoints / dailyGoal) * 100), 100)}%
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground font-medium mt-2">
            <span>{dailyPoints} / {dailyGoal} Points</span>
            <span>Goal achievement</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 lg:mb-8">
          <div className="lg:col-span-8 space-y-6">
            <TimelineChart data={timelineData} />

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Today's Activity Log</h3>
              {todayActivities?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No activities logged for this date. Click Quick Add to get started!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {todayActivities?.map((activity, index) => (
                    <ActivityLogCard
                      key={activity?.id || index}
                      activity={activity?.activityName}
                      category={`${activity?.category} - ${activity?.intensity}`}
                      time={activity?.activityTime}
                      points={activity?.points}
                      icon={activity?.icon}
                      iconColor={activity?.iconColor}
                      onEdit={() => handleEditActivity(activity)}
                      onDelete={() => handleDeleteActivity(activity)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Quick Add Activity</h3>
                <button
                  onClick={() => setShowManageShortcuts(true)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  title="Manage Shortcuts"
                >
                  <Settings size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {quickShortcuts?.map((cat, index) => (
                  <QuickAddButton
                    key={index}
                    label={cat?.label}
                    icon={cat?.icon}
                    iconColor={cat?.iconColor}
                    onClick={() => handleQuickAdd(cat?.category, cat?.label)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {recentActivities?.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No activities yet. Start logging!</p>
                ) : (
                  recentActivities?.map((activity, index) => (
                    <ActivityFeedItem
                      key={activity?.id || index}
                      activity={activity?.activityName}
                      time={activity?.activityTime}
                      points={activity?.points}
                      category={activity?.category}
                      icon={activity?.icon}
                      iconColor={activity?.iconColor}
                    />
                  ))
                )}
              </div>
            </div>

            {achievements?.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
                  <Link
                    to="/achievements-badges-gallery"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View Gallery
                  </Link>
                </div>
                <div className="space-y-3">
                  {achievements?.map((achievement, index) => (
                    <AchievementNotification
                      key={index}
                      title={achievement?.title}
                      description={achievement?.description}
                      icon={achievement?.icon}
                      iconColor={achievement?.iconColor}
                      isNew={achievement?.isNew}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Quick Intensity Modal */}
        {quickAddActivity && (
          <QuickIntensityModal
            activity={quickAddActivity}
            onClose={() => setQuickAddActivity(null)}
            onSelect={handleSubmitQuickAdd}
          />
        )}
        {/* Achievement Celebration Overlay */}
        <AchievementOverlay
          achievement={showAchievement}
          onClose={() => setShowAchievement(null)}
        />

        {/* Manage Shortcuts Modal */}
        <AnimatePresence>
          {showManageShortcuts && (
            <ManageShortcutsModal
              shortcuts={quickShortcuts}
              onClose={() => setShowManageShortcuts(false)}
              onUpdate={() => refreshStats(currentDate)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}