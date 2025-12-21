import React from 'react';
import Icon from '../../../components/AppIcon';

const HabitPriorityRanking = ({ habits }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Priority Ranking</h3>
        <button className="text-primary hover:text-primary/80 transition-colors">
          <Icon name="Settings" size={20} />
        </button>
      </div>
      <div className="space-y-3">
        {habits?.map((habit, index) => (
          <div
            key={habit?.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-subtle ${getPriorityColor(habit?.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold font-data">{index + 1}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name={habit?.icon} size={18} />
                    <span className="font-medium">{habit?.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{habit?.category}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${habit?.priority === 'high' ? 'bg-error/20' : habit?.priority === 'medium' ? 'bg-warning/20' : 'bg-primary/20'}`}>
                {habit?.priority?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Icon name="Target" size={14} color="var(--color-muted-foreground)" />
                  <span className="text-sm font-data">{habit?.completionRate}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Flame" size={14} color="var(--color-warning)" />
                  <span className="text-sm font-data">{habit?.streak} days</span>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="GripVertical" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitPriorityRanking;