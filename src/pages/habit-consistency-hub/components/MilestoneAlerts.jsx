import React from 'react';
import Icon from '../../../components/AppIcon';

const MilestoneAlerts = ({ milestones }) => {
  const getMilestoneIcon = (type) => {
    switch (type) {
      case 'streak':
        return 'Flame';
      case 'completion':
        return 'Target';
      case 'achievement':
        return 'Award';
      default:
        return 'Star';
    }
  };

  const getMilestoneColor = (daysUntil) => {
    if (daysUntil <= 3) return 'border-error/20 bg-error/5';
    if (daysUntil <= 7) return 'border-warning/20 bg-warning/5';
    return 'border-primary/20 bg-primary/5';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Milestones</h3>
        <Icon name="Bell" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-3">
        {milestones?.map((milestone) => (
          <div
            key={milestone?.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-subtle ${getMilestoneColor(milestone?.daysUntil)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${milestone?.daysUntil <= 3 ? 'bg-error/10' : milestone?.daysUntil <= 7 ? 'bg-warning/10' : 'bg-primary/10'}`}>
                <Icon 
                  name={getMilestoneIcon(milestone?.type)} 
                  size={20} 
                  color={milestone?.daysUntil <= 3 ? 'var(--color-error)' : milestone?.daysUntil <= 7 ? 'var(--color-warning)' : 'var(--color-primary)'} 
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{milestone?.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{milestone?.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{milestone?.habit}</span>
                  <span className={`text-xs font-medium ${milestone?.daysUntil <= 3 ? 'text-error' : milestone?.daysUntil <= 7 ? 'text-warning' : 'text-primary'}`}>
                    {milestone?.daysUntil} days left
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneAlerts;