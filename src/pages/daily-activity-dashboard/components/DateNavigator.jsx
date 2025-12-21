import React from 'react';

import Button from '../../../components/ui/Button';

const DateNavigator = ({ currentDate, onPrevious, onNext, onToday }) => {
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date?.toLocaleDateString('en-US', options);
  };

  const isToday = () => {
    const today = new Date();
    return currentDate?.toDateString() === today?.toDateString();
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-card rounded-lg border border-border p-4">
      <Button
        variant="outline"
        size="sm"
        iconName="ChevronLeft"
        onClick={onPrevious}
        className="flex-shrink-0"
      />
      
      <div className="flex-1 text-center">
        <p className="text-lg font-semibold text-foreground">{formatDate(currentDate)}</p>
        {!isToday() && (
          <button
            onClick={onToday}
            className="text-xs text-primary hover:underline mt-1"
          >
            Jump to Today
          </button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        iconName="ChevronRight"
        onClick={onNext}
        disabled={isToday()}
        className="flex-shrink-0"
      />
    </div>
  );
};

export default DateNavigator;