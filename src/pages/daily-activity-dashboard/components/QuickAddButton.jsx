import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickAddButton = ({ category, icon, iconColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted transition-all duration-200 active-press group"
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Icon name={icon} size={20} color={iconColor} />
      </div>
      <span className="text-sm font-medium text-foreground">{category}</span>
      <Icon name="Plus" size={16} color="var(--color-muted-foreground)" className="ml-auto" />
    </button>
  );
};

export default QuickAddButton;