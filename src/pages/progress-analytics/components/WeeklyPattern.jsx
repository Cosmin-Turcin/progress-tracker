import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyPattern = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-moderate p-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <p className="text-sm text-muted-foreground">
            Average: <span className="font-semibold font-data text-foreground">{payload?.[0]?.value}</span> points
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Performance Pattern</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="average" 
              fill="var(--color-primary)" 
              radius={[8, 8, 0, 0]}
              name="Average Points"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Best Day</p>
          <p className="text-lg font-semibold text-foreground">
            {data?.reduce((max, item) => item?.average > max?.average ? item : max)?.day}
          </p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Needs Focus</p>
          <p className="text-lg font-semibold text-foreground">
            {data?.reduce((min, item) => item?.average < min?.average ? item : min)?.day}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPattern;