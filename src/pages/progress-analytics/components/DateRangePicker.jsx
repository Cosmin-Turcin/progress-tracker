import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const DateRangePicker = ({ selectedRange, onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetRanges = [
    { label: '7 Days', value: '7d', days: 7 },
    { label: '30 Days', value: '30d', days: 30 },
    { label: '90 Days', value: '90d', days: 90 },
    { label: '6 Months', value: '6m', days: 180 },
    { label: '12 Months', value: '12m', days: 365 }
  ];

  const handleRangeSelect = (range) => {
    onRangeChange(range);
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    const selected = presetRanges?.find(r => r?.value === selectedRange);
    return selected ? selected?.label : 'Select Range';
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Calendar"
        iconPosition="left"
        className="min-w-[160px]"
      >
        {getSelectedLabel()}
      </Button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-lg shadow-elevated border border-border z-50 animate-scale-in">
            <div className="p-2">
              {presetRanges?.map((range) => (
                <button
                  key={range?.value}
                  onClick={() => handleRangeSelect(range?.value)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm font-medium
                    transition-colors duration-150 min-h-[44px] flex items-center
                    ${selectedRange === range?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  {range?.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;