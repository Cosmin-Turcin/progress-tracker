import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityLogCard = ({ activity, category, time, points, icon, iconColor, onEdit, onDelete }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:shadow-subtle transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon name={icon} size={20} color={iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">{activity}</h4>
            <p className="text-xs text-muted-foreground mt-1">{category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <span className="text-lg font-bold font-data text-accent">+{points}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={14} color="var(--color-muted-foreground)" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            iconName="Edit2"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          />
          <Button
            variant="ghost"
            size="xs"
            iconName="Trash2"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-error hover:text-error"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogCard;