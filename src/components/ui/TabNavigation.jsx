import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location?.pathname);

  const tabs = [
    {
      path: '/daily-activity-dashboard',
      label: 'Today',
      icon: 'Calendar',
      tooltip: 'Track your daily activities and progress'
    },
    {
      path: '/progress-analytics',
      label: 'Analytics',
      icon: 'TrendingUp',
      tooltip: 'View detailed progress trends and insights'
    },
    {
      path: '/habit-consistency-hub',
      label: 'Habits',
      icon: 'Target',
      tooltip: 'Monitor habit streaks and consistency'
    }
  ];

  useEffect(() => {
    setActiveTab(location?.pathname);
  }, [location?.pathname]);

  const handleTabClick = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <>
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-[100]">
        <div className="w-full max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={24} color="var(--color-primary)" />
              </div>
              <span className="text-xl font-semibold text-foreground">Progress Tracker</span>
            </div>

            <div className="flex items-center gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.path}
                  onClick={() => handleTabClick(tab?.path)}
                  className={`
                    group relative flex items-center gap-2 px-4 py-2 rounded-md
                    transition-all duration-200 ease-smooth min-h-[44px]
                    ${activeTab === tab?.path
                      ? 'bg-primary text-primary-foreground shadow-subtle'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  title={tab?.tooltip}
                >
                  <Icon 
                    name={tab?.icon} 
                    size={20} 
                    color={activeTab === tab?.path ? 'currentColor' : 'currentColor'}
                  />
                  <span className="font-medium text-sm">{tab?.label}</span>
                  
                  {activeTab === tab?.path && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-[100] safe-area-inset-bottom">
        <div className="h-full flex items-center justify-around px-2">
          {tabs?.map((tab) => (
            <button
              key={tab?.path}
              onClick={() => handleTabClick(tab?.path)}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg
                transition-all duration-200 ease-smooth min-h-[44px] min-w-[64px]
                active-press
                ${activeTab === tab?.path
                  ? 'text-primary' :'text-muted-foreground'
                }
              `}
              title={tab?.tooltip}
            >
              <Icon 
                name={tab?.icon} 
                size={24} 
                color="currentColor"
              />
              <span className={`
                text-xs font-medium
                ${activeTab === tab?.path ? 'font-semibold' : ''}
              `}>
                {tab?.label}
              </span>
              
              {activeTab === tab?.path && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
      <div className="hidden lg:block h-16" />
      <div className="lg:hidden h-16" />
    </>
  );
};

export default TabNavigation;