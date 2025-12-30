import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, subtitle, icon, iconColor, trend, trendValue, onClick }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-lg border border-border p-6 hover-lift transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}15` }}>
          <Icon name={icon} size={24} color={iconColor} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-semibold font-data text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
};

export default MetricCard;