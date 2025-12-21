import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeedItem = ({ activity, time, points, category, icon, iconColor }) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-200">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Icon name={icon} size={16} color={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{activity}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{time}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{category}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-sm font-semibold font-data text-accent">+{points}</span>
      </div>
    </div>
  );
};

export default ActivityFeedItem;