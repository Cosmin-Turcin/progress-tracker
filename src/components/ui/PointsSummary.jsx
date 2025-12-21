import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const PointsSummary = ({ dailyPoints = 0, weeklyAverage = 0, goalProgress = 0, dailyGoal = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const progressPercentage = Math.min((dailyPoints / dailyGoal) * 100, 100);

  return (
    <>
      <div className="hidden lg:flex fixed top-0 right-6 h-16 items-center z-[100]">
        <div className="flex items-center gap-6 bg-card/95 backdrop-blur-subtle px-6 py-3 rounded-b-lg shadow-subtle border border-border border-t-0">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground font-medium">Today</span>
              <span className="text-2xl font-semibold font-data text-primary">{dailyPoints}</span>
            </div>
            <div className="w-px h-8 bg-border" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground font-medium">Weekly Avg</span>
              <span className="text-lg font-medium font-data text-foreground">{weeklyAverage}</span>
            </div>
            <div className="w-px h-8 bg-border" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground font-medium">Goal Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all duration-300 ease-smooth rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium font-data text-foreground">{goalProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed top-4 right-4 z-[100]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 bg-card/95 backdrop-blur-subtle px-4 py-2 rounded-lg shadow-moderate border border-border active-press"
        >
          <Icon name="Award" size={20} color="var(--color-primary)" />
          <span className="text-lg font-semibold font-data text-primary">{dailyPoints}</span>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            color="var(--color-muted-foreground)" 
          />
        </button>

        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-card rounded-lg shadow-elevated border border-border animate-slide-down">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">Today's Points</span>
                <span className="text-xl font-semibold font-data text-primary">{dailyPoints}</span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">Weekly Average</span>
                <span className="text-lg font-medium font-data text-foreground">{weeklyAverage}</span>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">Daily Goal</span>
                  <span className="text-sm font-medium font-data text-foreground">{dailyPoints}/{dailyGoal}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all duration-300 ease-smooth rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium font-data text-secondary">{goalProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PointsSummary;