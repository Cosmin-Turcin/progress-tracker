import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, unit, change, changeType, icon, iconColor }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover-lift transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}15` }}>
            <Icon name={icon} size={24} color={iconColor} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-semibold font-data text-foreground">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
          </div>
        </div>
      </div>
      
      <div className={`flex items-center gap-2 ${getChangeColor()}`}>
        <Icon name={getChangeIcon()} size={16} color="currentColor" />
        <span className="text-sm font-medium">{change}</span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
    </div>
  );
};

export default KPICard;