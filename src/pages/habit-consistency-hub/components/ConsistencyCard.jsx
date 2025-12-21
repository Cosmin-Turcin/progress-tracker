import React from 'react';
import Icon from '../../../components/AppIcon';

const ConsistencyCard = ({ title, value, subtitle, icon, trend, status = 'neutral' }) => {
  const statusColors = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20',
    neutral: 'bg-muted text-foreground border-border'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className={`rounded-lg border p-6 transition-all duration-200 hover:shadow-subtle ${statusColors?.[status]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${status === 'success' ? 'bg-success/20' : status === 'warning' ? 'bg-warning/20' : status === 'error' ? 'bg-error/20' : 'bg-primary/10'}`}>
          <Icon name={icon} size={24} color={status === 'success' ? 'var(--color-success)' : status === 'warning' ? 'var(--color-warning)' : status === 'error' ? 'var(--color-error)' : 'var(--color-primary)'} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trendColors?.[trend?.direction]}`}>
            <Icon name={trend?.direction === 'up' ? 'TrendingUp' : trend?.direction === 'down' ? 'TrendingDown' : 'Minus'} size={16} />
            <span className="text-sm font-medium">{trend?.value}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-semibold font-data mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default ConsistencyCard;