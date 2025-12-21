import React from 'react';
import Icon from '../../../components/AppIcon';

const StreakTimeline = ({ streaks }) => {
  const getStreakColor = (days) => {
    if (days >= 30) return 'bg-secondary';
    if (days >= 14) return 'bg-primary';
    if (days >= 7) return 'bg-accent';
    return 'bg-muted';
  };

  const getStreakIcon = (category) => {
    const icons = {
      fitness: 'Dumbbell',
      mindset: 'Brain',
      nutrition: 'Apple',
      work: 'Briefcase',
      social: 'Users'
    };
    return icons?.[category] || 'Target';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Active Streaks</h3>
        <Icon name="Flame" size={20} color="var(--color-accent)" />
      </div>
      <div className="space-y-4">
        {streaks?.map((streak, index) => (
          <div key={index} className="relative">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${getStreakColor(streak?.days)} flex items-center justify-center`}>
                <Icon name={getStreakIcon(streak?.category)} size={24} color="white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground">{streak?.name}</h4>
                  <span className="text-sm font-semibold font-data text-primary">{streak?.days} days</span>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStreakColor(streak?.days)} transition-all duration-300`}
                    style={{ width: `${Math.min((streak?.days / 30) * 100, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Started {streak?.startDate}</span>
                  <span className="text-xs text-muted-foreground">
                    {streak?.days < 30 ? `${30 - streak?.days} days to milestone` : 'Milestone reached!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {streaks?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="TrendingUp" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No active streaks yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start logging activities to build streaks</p>
        </div>
      )}
    </div>
  );
};

export default StreakTimeline;