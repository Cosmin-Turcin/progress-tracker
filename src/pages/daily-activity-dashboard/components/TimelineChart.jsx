import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const TimelineChart = ({ data }) => {
  const categories = [
    { key: 'fitness', label: 'Fitness', color: '#3B82F6' },   // blue-500
    { key: 'mindset', label: 'Mindset', color: '#8B5CF6' },   // violet-500
    { key: 'nutrition', label: 'Nutrition', color: '#10B981' }, // emerald-500
    { key: 'work', label: 'Work', color: '#F59E0B' },           // amber-500
    { key: 'social', label: 'Social', color: '#EC4899' },       // pink-500
    { key: 'others', label: 'Others', color: '#6B7280' },       // gray-500
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-moderate p-3 min-w-[140px]">
          <p className="text-sm font-medium text-foreground mb-2 border-b border-border pb-1">{data?.time}</p>
          <div className="space-y-1.5">
            {categories?.map(cat => (
              <div key={cat?.key} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat?.color }}></div>
                  <span className="text-xs text-muted-foreground">{cat?.label}:</span>
                </div>
                <span className="text-xs font-bold font-data text-foreground">{data?.[cat?.key] || 0}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-border mt-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
                <span className="text-xs font-bold text-foreground">Total:</span>
              </div>
              <span className="text-xs font-bold font-data text-accent">{data?.total || 0}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground">Today's Point Accumulation</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {categories?.map(cat => (
            <div key={cat?.key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat?.color }}></div>
              <span className="text-xs text-muted-foreground">{cat?.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
            <span className="text-xs font-bold text-foreground">Total</span>
          </div>
        </div>
      </div>
      <div className="w-full h-80" aria-label="Hourly Point Accumulation Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
              {categories?.map(cat => (
                <linearGradient key={`grad-${cat.key}`} id={`color-${cat.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cat.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={cat.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '11px' }}
              tickMargin={10}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '11px' }}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            {categories?.map(cat => (
              <Area
                key={cat?.key}
                type="monotone"
                dataKey={cat?.key}
                stroke={cat?.color}
                strokeWidth={1.5}
                fill={`url(#color-${cat?.key})`}
                stackId="1"
              />
            ))}
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--color-accent)"
              strokeWidth={3}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineChart;