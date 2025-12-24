import React, { useState, useEffect } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { useStats } from '../../contexts/StatsContext';
import { activityService } from '../../services/activityService';
import { realtimeService } from '../../services/realtimeService';
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
  const { refreshStats } = useStats();
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
    dailyGoal: 200
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

      // 1. Prepare date range based on selectedRange
      const endDate = new Date();
      const startDate = new Date();

      const getRangeDays = (range) => {
        switch (range) {
          case '7d': return 7;
          case '30d': return 30;
          case '90d': return 90;
          case '1y': return 365;
          default: return 30;
        }
      };

      const rangeDays = getRangeDays(selectedRange);
      // For heatmap we always want at least 90 days history, but for charts we respect selectedRange
      const historyDays = Math.max(rangeDays, 90);
      startDate.setDate(startDate.getDate() - historyDays);

      // 2. Fetch raw activities for the range
      const allActivities = await activityService?.getByDateRange(user?.id, startDate, endDate);

      // 3. Filter activities by selected categories
      const activities = allActivities?.filter(a => selectedCategories?.includes(a?.category)) || [];

      // Helper for consistent date formatting (YYYY-MM-DD)
      const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      // 4. Calculate KPIs based on filtered data
      const totalPointsInRange = activities?.reduce((sum, a) => sum + a?.points, 0) || 0;
      const avgPoints = Math.round(totalPointsInRange / rangeDays) || 0;

      const activeDaysSet = new Set(activities?.map(a => a?.activityDate));
      const activeDays = activeDaysSet.size;
      const consistencyScore = rangeDays > 0 ? Math.round((activeDays / rangeDays) * 100) : 0;

      const globalStats = await activityService?.getStatistics(user?.id);

      setKpiData([
        {
          title: 'Average Daily Points',
          value: avgPoints,
          unit: 'pts',
          change: '+12.5%',
          changeType: 'positive',
          icon: 'TrendingUp',
          iconColor: 'var(--color-primary)'
        },
        {
          title: 'Consistency Score',
          value: consistencyScore,
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
          title: 'Total Activities',
          value: activities?.length || 0,
          unit: 'entries',
          change: 'in range',
          changeType: 'positive',
          icon: 'Award',
          iconColor: '#8B5CF6'
        }
      ]);

      // 5. Calculate daily points for charts and heatmap
      const dailyPoints = {};
      activities?.forEach((activity) => {
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
        ?.slice(-rangeDays);

      setTrendData(trend);

      // 6. Load category breakdown
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

      // 7. Calculate weekly patterns
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

      // 8. Streak data
      setStreakData([
        {
          category: 'all',
          name: 'Overall Activity',
          days: globalStats?.currentStreak || 0,
          startDate: formatDate(new Date(new Date().setDate(new Date().getDate() - (globalStats?.currentStreak || 0))))
        }
      ]);

      // 9. Heatmap data (fixed 84 days context)
      const heatData = [];
      const now = new Date();
      for (let i = 83; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateKey = formatDate(d);
        const score = dailyPoints[dateKey] || 0;
        heatData.push({
          date: d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          dayOfWeek: d.getDay(),
          score
        });
      }
      setHeatmapData(heatData);

      // 10. Update summary stats for Header/Context usage (though normally handled by StatsContext)
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
        goalProgress: Math.min(Math.round((todayPoints / 200) * 100), 100),
        dailyGoal: 200
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
    loadAnalyticsData();
    refreshStats();
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
                Your consistency score has significantly improved. Keep maintaining your daily routines!
              </p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm font-medium text-foreground mb-1">💡 Opportunity</p>
              <p className="text-sm text-muted-foreground">
                Analyzing your patterns reveals potential for higher performance on weekends.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressAnalytics;