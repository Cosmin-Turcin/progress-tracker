import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CategoryFilter = ({ selectedCategories, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { value: 'fitness', label: 'Fitness', icon: 'Dumbbell', color: 'var(--color-primary)' },
    { value: 'mindset', label: 'Mindset', icon: 'Brain', color: 'var(--color-secondary)' },
    { value: 'nutrition', label: 'Nutrition', icon: 'Apple', color: 'var(--color-accent)' },
    { value: 'work', label: 'Work', icon: 'Briefcase', color: '#8B5CF6' },
    { value: 'social', label: 'Social', icon: 'Users', color: '#EC4899' }
  ];

  const handleCategoryToggle = (categoryValue) => {
    const newCategories = selectedCategories?.includes(categoryValue)
      ? selectedCategories?.filter(c => c !== categoryValue)
      : [...selectedCategories, categoryValue];
    onCategoryChange(newCategories);
  };

  const getSelectedCount = () => {
    return selectedCategories?.length === categories?.length
      ? 'All Categories'
      : `${selectedCategories?.length} Selected`;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Filter"
        iconPosition="left"
        className="min-w-[160px]"
      >
        {getSelectedCount()}
      </Button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-card rounded-lg shadow-elevated border border-border z-50 animate-scale-in">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Filter Categories</span>
                <button
                  onClick={() => onCategoryChange(categories?.map(c => c?.value))}
                  className="text-xs text-primary hover:underline"
                >
                  Select All
                </button>
              </div>

              <div className="space-y-2">
                {categories?.map((category) => (
                  <div key={category?.value} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                    <Checkbox
                      checked={selectedCategories?.includes(category?.value)}
                      onChange={() => handleCategoryToggle(category?.value)}
                    />
                    <Icon name={category?.icon} size={18} color={category?.color} />
                    <span className="text-sm font-medium text-foreground">{category?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryFilter;