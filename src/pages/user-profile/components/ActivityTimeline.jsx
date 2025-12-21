import { Activity, Calendar, Clock, Award } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Icon from '../../../components/AppIcon';


export default function ActivityTimeline({ activities }) {
  const getIconComponent = (iconName) => {
    const Icon = LucideIcons?.[iconName];
    return Icon || Activity;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    }
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString?.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      fitness: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
      mindset: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
      nutrition: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
      work: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
      social: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500' }
    };
    return colors?.[category] || colors?.fitness;
  };

  const groupedActivities = activities?.reduce((acc, activity) => {
    const date = formatDate(activity?.activityDate);
    if (!acc?.[date]) acc[date] = [];
    acc?.[date]?.push(activity);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Activity Timeline</h2>
          <p className="text-gray-600">Your recent progress and accomplishments</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
            Filter by Category
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
            Date Range
          </button>
        </div>
      </div>

      {Object?.keys(groupedActivities || {})?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No activities recorded yet</p>
          <p className="text-sm text-gray-500 mt-1">Start logging activities to see your progress here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object?.entries(groupedActivities || {})?.map(([date, dateActivities]) => (
            <div key={date} className="relative">
              <div className="sticky top-0 bg-gray-50 z-10 py-2 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-900">{date}</h3>
                  <span className="text-sm text-gray-500">
                    ({dateActivities?.length} {dateActivities?.length === 1 ? 'activity' : 'activities'})
                  </span>
                </div>
              </div>

              <div className="relative pl-8 space-y-4">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {dateActivities?.map((activity, index) => {
                  const Icon = getIconComponent(activity?.icon);
                  const colors = getCategoryColor(activity?.category);
                  
                  return (
                    <div key={activity?.id} className="relative">
                      <div className={`absolute -left-5 w-6 h-6 ${colors?.dot} rounded-full border-4 border-white shadow-sm`}></div>
                      
                      <div className={`${colors?.bg} rounded-lg p-4 border ${colors?.border} hover:shadow-md transition`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div 
                              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm"
                              style={{ color: activity?.iconColor || 'currentColor' }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {activity?.activityName}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-block px-2 py-0.5 ${colors?.bg} ${colors?.text} text-xs font-medium rounded border ${colors?.border}`}>
                                  {activity?.category}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(activity?.activityTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-bold text-gray-900 ml-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            {activity?.points} pts
                          </div>
                        </div>

                        {activity?.notes && (
                          <p className="text-sm text-gray-700 pl-13">
                            {activity?.notes}
                          </p>
                        )}

                        {activity?.durationMinutes && (
                          <div className="mt-2 text-xs text-gray-500 pl-13">
                            Duration: {activity?.durationMinutes} minutes
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}