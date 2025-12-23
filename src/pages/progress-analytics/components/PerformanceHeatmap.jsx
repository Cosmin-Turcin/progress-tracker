import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceHeatmap = ({ data }) => {
  const getIntensityColor = (score) => {
    if (score >= 80) return 'bg-secondary';
    if (score >= 50) return 'bg-primary';
    if (score >= 25) return 'bg-accent';
    if (score > 0) return 'bg-warning';
    return 'bg-muted';
  };

  const getIntensityOpacity = (score) => {
    if (score >= 80) return 'opacity-100';
    if (score >= 50) return 'opacity-80';
    if (score >= 25) return 'opacity-60';
    if (score > 0) return 'opacity-40';
    return 'opacity-10';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Performance Heatmap</h3>
        <Icon name="Calendar" size={20} color="var(--color-muted-foreground)" />
      </div>
      <div className="space-y-2">
        <div className="flex gap-1 mb-2">
          <div className="w-12" />
          {months?.map((month, idx) => (
            <div key={idx} className="flex-1 text-center">
              <span className="text-xs text-muted-foreground">{month}</span>
            </div>
          ))}
        </div>

        {weekDays?.map((day, dayIdx) => (
          <div key={dayIdx} className="flex items-center gap-1">
            <div className="w-12">
              <span className="text-xs text-muted-foreground">{day}</span>
            </div>
            <div className="flex-1 flex gap-1">
              {data?.filter(d => d?.dayOfWeek === dayIdx)?.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex-1 aspect-square rounded ${getIntensityColor(item?.score)} ${getIntensityOpacity(item?.score)} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
                  title={`${item?.date}: ${item?.score} points`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex gap-1">
          {[5, 25, 50, 80, 100]?.map((score, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded ${getIntensityColor(score)} ${getIntensityOpacity(score)}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
};

export default PerformanceHeatmap;