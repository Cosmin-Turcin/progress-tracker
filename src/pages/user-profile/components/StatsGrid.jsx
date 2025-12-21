import { Activity, TrendingUp, Target, Award, Calendar, Zap } from 'lucide-react';

export default function StatsGrid({ statistics }) {
  const stats = [
    {
      icon: Activity,
      label: 'Total Activities',
      value: statistics?.total_activities || 0,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      icon: Target,
      label: 'Total Points',
      value: statistics?.total_points || 0,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: `${statistics?.current_streak || 0} days`,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      icon: Zap,
      label: 'Longest Streak',
      value: `${statistics?.longest_streak || 0} days`,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      icon: Award,
      label: 'Achievements Unlocked',
      value: statistics?.achievements_unlocked || 0,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      icon: Calendar,
      label: 'Last Activity',
      value: statistics?.last_activity_date 
        ? new Date(statistics?.last_activity_date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'No activity yet',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Personal Statistics</h2>
        <p className="text-gray-600">Your progress and achievements overview</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className={`${stat?.bgColor} rounded-xl p-6 border ${stat?.borderColor} hover:shadow-md transition`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center border ${stat?.borderColor}`}>
                <stat.icon className={`w-6 h-6 ${stat?.iconColor}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat?.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat?.value}</p>
          </div>
        ))}
      </div>
      {statistics?.current_streak > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Keep it up!</h3>
              <p className="text-gray-700 mt-1">
                You're on a {statistics?.current_streak}-day streak! Complete an activity today to keep it going.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Consistency Rating</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    ((statistics?.current_streak || 0) / 30) * 100,
                    100
                  )}%`
                }}
              ></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(((statistics?.current_streak || 0) / 30) * 100)}%
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Based on your 30-day activity consistency
        </p>
      </div>
    </div>
  );
}