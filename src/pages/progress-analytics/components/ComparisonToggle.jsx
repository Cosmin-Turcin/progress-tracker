import React from 'react';
import Icon from '../../../components/AppIcon';

const ComparisonToggle = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 min-h-[44px]
        ${enabled 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-card text-foreground border-border hover:bg-muted'
        }
      `}
    >
      <Icon 
        name="GitCompare" 
        size={20} 
        color="currentColor"
      />
      <span className="text-sm font-medium">Compare Periods</span>
    </button>
  );
};

export default ComparisonToggle;