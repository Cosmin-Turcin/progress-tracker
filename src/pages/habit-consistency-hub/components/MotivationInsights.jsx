import React from 'react';
import Icon from '../../../components/AppIcon';

const MotivationInsights = ({ insights }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'TrendingUp';
      case 'warning':
        return 'AlertTriangle';
      case 'tip':
        return 'Lightbulb';
      default:
        return 'Info';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return 'border-success/20 bg-success/5 text-success';
      case 'warning':
        return 'border-warning/20 bg-warning/5 text-warning';
      case 'tip':
        return 'border-primary/20 bg-primary/5 text-primary';
      default:
        return 'border-border bg-muted text-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Sparkles" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Motivation Insights</h3>
      </div>
      <div className="space-y-3">
        {insights?.map((insight) => (
          <div
            key={insight?.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-subtle ${getInsightColor(insight?.type)}`}
          >
            <div className="flex items-start gap-3">
              <Icon name={getInsightIcon(insight?.type)} size={20} />
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{insight?.title}</h4>
                <p className="text-sm text-muted-foreground">{insight?.message}</p>
                {insight?.action && (
                  <button className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    {insight?.action}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotivationInsights;