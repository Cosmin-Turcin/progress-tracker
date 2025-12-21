import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementNotification = ({ title, description, icon, iconColor, isNew }) => {
  return (
    <div className="relative flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-accent/10 to-transparent border border-accent/20">
      {isNew && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
            New
          </span>
        </div>
      )}
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <Icon name={icon} size={20} color={iconColor} />
      </div>
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

export default AchievementNotification;