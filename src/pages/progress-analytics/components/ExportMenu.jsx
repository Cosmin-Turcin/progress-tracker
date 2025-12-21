import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportMenu = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    { value: 'pdf', label: 'Export as PDF', icon: 'FileText' },
    { value: 'csv', label: 'Export as CSV', icon: 'Table' },
    { value: 'json', label: 'Export as JSON', icon: 'Code' }
  ];

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Download"
        iconPosition="left"
      >
        Export
      </Button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-lg shadow-elevated border border-border z-50 animate-scale-in">
            <div className="p-2">
              {exportOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleExport(option?.value)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors duration-150 flex items-center gap-3 min-h-[44px]"
                >
                  <Icon name={option?.icon} size={18} color="var(--color-muted-foreground)" />
                  {option?.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportMenu;