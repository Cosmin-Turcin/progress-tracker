import React, { useState, useEffect } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { activityService } from '../../services/activityService';
import { realtimeService } from '../../services/realtimeService';
import TabNavigation from '../../components/ui/TabNavigation';
import PointsSummary from '../../components/ui/PointsSummary';
import QuickActionButton from '../../components/ui/QuickActionButton';
import KPICard from './components/KPICard';
import DateRangePicker from './components/DateRangePicker';
import CategoryFilter from './components/CategoryFilter';
import ComparisonToggle from './components/ComparisonToggle';
import TrendChart from './components/TrendChart';
import PerformanceHeatmap from './components/PerformanceHeatmap';
import CategoryBreakdown from './components/CategoryBreakdown';
import WeeklyPattern from './components/WeeklyPattern';
import StreakTimeline from './components/StreakTimeline';
import ExportMenu from './components/ExportMenu';
import Header from '../../components/Header';

const ProgressAnalytics = () => {
  const { user } = useAuth();
  const [selectedRange, setSelectedRange] = useState('30d');
  const [selectedCategories, setSelectedCategories] = useState(['fitness', 'mindset', 'nutrition', 'work', 'social']);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kpiData, setKpiData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyPatternData, setWeeklyPatternData] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    dailyPoints: 0,
    weeklyAverage: 0,
    goalProgress: 0,
    dailyGoal: 100
  });

  // Load analytics data
  useEffect(() => {
    if (user?.id) {
      loadAnalyticsData();
    }
  }, [user, selectedRange, selectedCategories]);

  // Real-time subscriptions for instant analytics updates
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to activity changes to refresh analytics
    const unsubActivities = realtimeService?.subscribeToActivities(user?.id, {
      onInsert: () => loadAnalyticsData(),
      onUpdate: () => loadAnalyticsData(),
      onDelete: () => loadAnalyticsData()
    });

    // Subscribe to statistics changes for KPIs
    const unsubStats = realtimeService?.subscribeToStatistics(user?.id, () => {
      loadAnalyticsData();
    });

    // Subscribe to goals changes for progress tracking
    const unsubGoals = realtimeService?.subscribeToGoals(user?.id, {
      onInsert: () => loadAnalyticsData(),
      onUpdate: () => loadAnalyticsData(),
      onDelete: () => loadAnalyticsData()
    });

    // Cleanup subscriptions
    return () => {
      unsubActivities();
      unsubStats();
      unsubGoals();
    };
  }, [user]);

  const loadAnalyticsData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      // Load KPI data
      const stats = await activityService?.getStatistics(user?.id);

      setKpiData([
        {
          title: 'Average Daily Points',
          value: Math.round(stats?.totalPoints / 30) || 0,
          unit: 'pts',
          change: '+12.5%',
          changeType: 'positive',
          icon: 'TrendingUp',
          iconColor: 'var(--color-primary)'
        },
        {
          title: 'Consistency Score',
          value: stats?.currentStreak ? Math.min(100, stats?.currentStreak * 3) : 0,
          unit: '%',
          change: '+8.3%',
          changeType: 'positive',
          icon: 'Target',
          iconColor: 'var(--color-secondary)'
        },
        {
          title: 'Improvement Rate',
          value: '15',
          unit: '%',
          change: '+3.2%',
          changeType: 'positive',
          icon: 'TrendingUp',
          iconColor: 'var(--color-accent)'
        },
        {
          title: 'Personal Bests',
          value: stats?.achievementsUnlocked || 0,
          unit: 'PRs',
          change: '+5 this month',
          changeType: 'positive',
          icon: 'Award',
          iconColor: '#8B5CF6'
        }
      ]);

      // Load trend data and heatmap data (90 days for heatmap's 84-day view)
      const endDate = new Date();
      const startDate = new Date();
      startDate?.setDate(startDate?.getDate() - 90);

      const activities = await activityService?.getByDateRange(user?.id, startDate, endDate);

      // Helper for consistent date formatting (YYYY-MM-DD)
      const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      // Calculate daily points using UTC-safe local date matching
      const dailyPoints = {};
      activities?.forEach((activity) => {
        // activity.activityDate is already "YYYY-MM-DD" from database
        const dateKey = activity.activityDate;
        dailyPoints[dateKey] = (dailyPoints?.[dateKey] || 0) + activity?.points;
      });

      const trend = Object.entries(dailyPoints)
        ?.map(([date, points]) => ({
          date: new Date(date)?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          points,
          movingAverage: points
        }))
        ?.sort((a, b) => new Date(a.date) - new Date(b.date))
        ?.slice(-30); // Show last 30 days in trend chart

      setTrendData(trend);

      // Load category breakdown
      const categoryBreakdown = {};
      activities?.forEach((activity) => {
        categoryBreakdown[activity.category] =
          (categoryBreakdown?.[activity?.category] || 0) + activity?.points;
      });

      const total = Object.values(categoryBreakdown)?.reduce((sum, val) => sum + val, 0);
      const categories = Object.entries(categoryBreakdown)?.map(([name, value]) => ({
        name: name?.charAt(0)?.toUpperCase() + name?.slice(1),
        value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0
      }));

      setCategoryData(categories);

      // Calculate weekly patterns
      const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const weeklyPoints = {};

      activities?.forEach((activity) => {
        if (!activity.activityDate) return;
        const [y, m, d] = activity.activityDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        const day = weekDays?.[dateObj.getDay()];
        weeklyPoints[day] = (weeklyPoints?.[day] || [])?.concat(activity?.points);
      });

      const weeklyPattern = weekDays?.map((day) => ({
        day,
        average: weeklyPoints?.[day]
          ? Math.round(weeklyPoints?.[day]?.reduce((a, b) => a + b, 0) / weeklyPoints?.[day]?.length)
          : 0
      }));

      setWeeklyPatternData(weeklyPattern);

      // Load streaks (keeping mock data for now as there's no streak table)
      setStreakData([
        {
          category: 'fitness',
          name: 'Morning Workout',
          days: stats?.currentStreak || 0,
          startDate: new Date()?.toLocaleDateString()
        }
      ]);

      // Calculate heatmap data for last 84 days (12 weeks)
      const heatData = [];
      const now = new Date();
      for (let i = 83; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = formatDate(date);
        const score = dailyPoints[dateKey] || 0;
        heatData.push({
          date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          dayOfWeek: date.getDay(),
          score
        });
      }
      setHeatmapData(heatData);

      // Update summary stats
      const todayKey = formatDate(new Date());
      const todayPoints = dailyPoints[todayKey] || 0;

      const weeklySum = Object.entries(dailyPoints)
        .filter(([dateKey]) => {
          const d = new Date(dateKey);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return d >= weekAgo;
        })
        .reduce((sum, [, pts]) => sum + pts, 0);

      setSummaryStats({
        dailyPoints: todayPoints,
        weeklyAverage: Math.round(weeklySum / 7),
        goalProgress: Math.min(Math.round((todayPoints / 100) * 100), 100),
        dailyGoal: 100
      });

    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError(err?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };


  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`);
  };

  const handleActivityLogged = (activity) => {
    console.log('Activity logged:', activity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
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
            onClick={loadAnalyticsData}
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
        dailyPoints={summaryStats?.dailyPoints}
        weeklyAverage={summaryStats?.weeklyAverage}
        goalProgress={summaryStats?.goalProgress}
        dailyGoal={summaryStats?.dailyGoal}
      />
      <QuickActionButton onActivityLogged={handleActivityLogged} />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">Progress Analytics</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Analyze your long-term trends and identify improvement patterns
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 lg:mb-8">
          <DateRangePicker
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
          <ComparisonToggle
            enabled={comparisonMode}
            onToggle={() => setComparisonMode(!comparisonMode)}
          />
          <div className="sm:ml-auto">
            <ExportMenu onExport={handleExport} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {kpiData?.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="lg:col-span-8">
            <TrendChart data={trendData} showMovingAverage={showMovingAverage} />
          </div>
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <PerformanceHeatmap data={heatmapData} />
            <CategoryBreakdown data={categoryData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <WeeklyPattern data={weeklyPatternData} />
          <StreakTimeline streaks={streakData} />
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Insights & Recommendations</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-sm font-medium text-foreground mb-1">🎯 Strong Performance</p>
              <p className="text-sm text-muted-foreground">
                Your consistency score has improved by 8.3% this period. Keep maintaining your daily routines!
              </p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm font-medium text-foreground mb-1">💡 Opportunity</p>
              <p className="text-sm text-muted-foreground">
                Friday and Saturday show lower activity. Consider scheduling lighter activities on these days.
              </p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-foreground mb-1">🔥 Milestone Alert</p>
              <p className="text-sm text-muted-foreground">
                You're 3 days away from a 30-day streak in Healthy Eating. Stay focused!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressAnalytics;