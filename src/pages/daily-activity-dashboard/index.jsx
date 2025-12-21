import React, { useState, useEffect } from 'react';
import TabNavigation from '../../components/ui/TabNavigation';
import PointsSummary from '../../components/ui/PointsSummary';
import QuickActionButton from '../../components/ui/QuickActionButton';
import MetricCard from './components/MetricCard';
import TimelineChart from './components/TimelineChart';
import QuickAddButton from './components/QuickAddButton';
import ActivityFeedItem from './components/ActivityFeedItem';
import AchievementNotification from './components/AchievementNotification';
import ActivityLogCard from './components/ActivityLogCard';
import DateNavigator from './components/DateNavigator';
import { useAuth } from '../../contexts/AuthContext';
import { activityService } from '../../services/activityService';
import { realtimeService } from '../../services/realtimeService';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';

export default function DailyActivityDashboard() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [todayActivities, setTodayActivities] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [fitnessPoints, setFitnessPoints] = useState(0);
  const [mindsetPoints, setMindsetPoints] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityFeed, setActivityFeed] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [recentAchievements, setRecentAchievements] = useState([]);

  const quickAddCategories = [
    { category: "Workout", icon: "Dumbbell", iconColor: "var(--color-primary)" },
    { category: "Meditation", icon: "Brain", iconColor: "var(--color-secondary)" },
    { category: "Cardio", icon: "Heart", iconColor: "var(--color-error)" },
    { category: "Strength", icon: "Zap", iconColor: "var(--color-accent)" },
    { category: "Nutrition", icon: "Apple", iconColor: "var(--color-success)" },
    { category: "Focus Session", icon: "Target", iconColor: "var(--color-primary)" }
  ];

  const achievements = [
    {
      title: "7-Day Streak!",
      description: "You\'ve logged activities for 7 consecutive days",
      icon: "Flame",
      iconColor: "var(--color-accent)",
      isNew: true
    },
    {
      title: "Fitness Milestone",
      description: "Reached 500 total fitness points this month",
      icon: "Trophy",
      iconColor: "var(--color-success)",
      isNew: true
    }
  ];

  useEffect(() => {
    if (selectedDate && user?.id) {
      loadDashboardData(selectedDate);
    }
  }, [selectedDate, user?.id]);

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
        const selectedDateStr = selectedDate?.toDateString();

        if (activityDate === selectedDateStr) {
          setActivityFeed(prev => [activity, ...(prev || [])]);
          // Refresh metrics
          loadDashboardData(selectedDate);
        }
      },
      onUpdate: (activity) => {
        console.log('Real-time: Activity updated', activity);
        setActivityFeed(prev =>
          prev?.map(a => a?.id === activity?.id ? activity : a)
        );
        loadDashboardData(selectedDate);
      },
      onDelete: (activity) => {
        console.log('Real-time: Activity deleted', activity);
        setActivityFeed(prev =>
          prev?.filter(a => a?.id !== activity?.id)
        );
        loadDashboardData(selectedDate);
      }
    });

    // Subscribe to statistics updates (for streaks)
    const unsubStats = realtimeService?.subscribeToStatistics(user?.id, (stats) => {
      console.log('Real-time: Statistics updated', stats);
      // Update metrics with new statistics
      setMetrics(prev => ({
        ...prev,
        currentStreak: stats?.currentStreak || 0
      }));
    });

    // Subscribe to achievements
    const unsubAchievements = realtimeService?.subscribeToAchievements(user?.id, (achievement) => {
      console.log('Real-time: New achievement unlocked!', achievement);
      setRecentAchievements(prev => [achievement, ...(prev || [])]);
    });

    // Cleanup subscriptions on unmount
    return () => {
      if (unsubActivities) unsubActivities();
      if (unsubStats) unsubStats();
      if (unsubAchievements) unsubAchievements();
    };
  }, [user?.id, selectedDate]);

  // Calculate statistics from activities
  useEffect(() => {
    if (todayActivities?.length > 0) {
      const fitness = todayActivities?.filter(a => a?.category === 'fitness')?.reduce((sum, a) => sum + a?.points, 0);
      const mindset = todayActivities?.filter(a => a?.category === 'mindset')?.reduce((sum, a) => sum + a?.points, 0);

      setFitnessPoints(fitness);
      setMindsetPoints(mindset);
      setDailyPoints(fitness + mindset);
    }
  }, [todayActivities]);

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

      // Load statistics
      const stats = await activityService?.getStatistics(user?.id, date);
      setDailyPoints(stats?.totalPoints || 0);
      setFitnessPoints(stats?.fitnessPoints || 0);
      setMindsetPoints(stats?.mindsetPoints || 0);

      // Load user statistics for streak
      const { data: userStats } = await supabase?.from('user_statistics')?.select('current_streak')?.eq('user_id', user?.id)?.single();

      if (userStats) {
        setCurrentStreak(userStats?.current_streak || 0);
      }

      // Calculate weekly average
      const weekStart = new Date(date);
      weekStart?.setDate(weekStart?.getDate() - 7);
      const weekActivities = await activityService?.getByDateRange(user?.id, weekStart, date);
      const weekTotal = weekActivities?.reduce((sum, a) => sum + a?.points, 0) || 0;
      setWeeklyAverage(Math.round(weekTotal / 7));

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

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleQuickAdd = (category) => {
    console.log(`Quick add: ${category}`);
  };

  const handleActivityLogged = async (activity) => {
    try {
      const newActivity = await activityService?.create(activity);
      await loadDashboardData(selectedDate);
    } catch (err) {
      console.error('Error logging activity:', err);
      setError(err?.message || 'Failed to log activity');
    }
  };

  const handleEditActivity = async (activity) => {
    console.log('Edit activity:', activity);
  };

  const handleDeleteActivity = async (activity) => {
    try {
      await activityService?.delete(activity?.id);
      await loadDashboardData(selectedDate);
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError(err?.message || 'Failed to delete activity');
    }
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
      <TabNavigation />
      <PointsSummary
        dailyPoints={dailyPoints}
        weeklyAverage={weeklyAverage}
        goalProgress={87}
        dailyGoal={200}
      />
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
            trend="up"
            trendValue="+12%"
          />
          <MetricCard
            title="Mindset Points"
            value={mindsetPoints}
            subtitle="Today's mindset activities"
            icon="Brain"
            iconColor="var(--color-secondary)"
            trend="up"
            trendValue="+8%"
          />
          <MetricCard
            title="Activities Completed"
            value={todayActivities?.length}
            subtitle="Total logged today"
            icon="CheckCircle"
            iconColor="var(--color-success)"
            trend="up"
            trendValue="+2"
          />
          <MetricCard
            title="Current Streak"
            value={`${currentStreak} days`}
            subtitle="Keep it going!"
            icon="Flame"
            iconColor="var(--color-accent)"
            trend="up"
            trendValue="New record"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 lg:mb-8">
          <div className="lg:col-span-8">
            <TimelineChart data={timelineData} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Add Activity</h3>
              <div className="space-y-2">
                {quickAddCategories?.map((cat, index) => (
                  <QuickAddButton
                    key={index}
                    category={cat?.category}
                    icon={cat?.icon}
                    iconColor={cat?.iconColor}
                    onClick={() => handleQuickAdd(cat?.category)}
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

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Achievements</h3>
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
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Today's Activity Log</h3>
          {todayActivities?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No activities logged for this date. Click Quick Add to get started!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}