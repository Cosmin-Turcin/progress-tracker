import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';
import Input from './Input';

const QuickActionButton = ({ onActivityLogged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activityName, setActivityName] = useState('');
  const [intensity, setIntensity] = useState('normal');

  const categories = [
    { value: 'fitness', label: 'Fitness', icon: 'Dumbbell' },
    { value: 'mindset', label: 'Mindset', icon: 'Brain' },
    { value: 'nutrition', label: 'Nutrition', icon: 'Apple' },
    { value: 'work', label: 'Work', icon: 'Briefcase' },
    { value: 'social', label: 'Social', icon: 'Users' },
    { value: 'others', label: 'Others', icon: 'MoreHorizontal' }
  ];

  const intensities = [
    { value: 'light', label: 'Easy (0.7x)', icon: 'Zap' },
    { value: 'normal', label: 'Medium (1.0x)', icon: 'Zap' },
    { value: 'intense', label: 'Hard (1.5x)', icon: 'Zap' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (selectedCategory && activityName) {
      const activity = {
        category: selectedCategory,
        activityName: activityName,
        intensity: intensity,
        timestamp: new Date()?.toISOString()
      };

      if (onActivityLogged) {
        onActivityLogged(activity);
      }

      setSelectedCategory('');
      setActivityName('');
      setIntensity('normal');
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="hidden lg:block fixed right-6 bottom-6 z-[200]">
        <div className={`
          transition-all duration-300 ease-smooth
          ${isOpen ? 'mb-4' : 'mb-0'}
        `}>
          {isOpen && (
            <div className="bg-card rounded-lg shadow-elevated border border-border p-6 w-80 mb-4 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Log Activity</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  label="Category"
                  placeholder="Select category"
                  options={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  required
                />

                <Input
                  label="Activity Name"
                  type="text"
                  placeholder="e.g., Morning run"
                  value={activityName}
                  onChange={(e) => setActivityName(e?.target?.value)}
                  required
                />

                <Select
                  label="Intensity"
                  placeholder="Select intensity"
                  options={intensities}
                  value={intensity}
                  onChange={setIntensity}
                  required
                />



                <Button
                  type="submit"
                  variant="default"
                  fullWidth
                  iconName="Plus"
                  iconPosition="left"
                >
                  Log Activity
                </Button>
              </form>
            </div>
          )}
        </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="default"
          size="icon"
          iconName={isOpen ? "X" : "Plus"}
          iconSize={28}
          className="shadow-elevated hover-lift rounded-full w-14 h-14 p-0"
        />
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed right-4 bottom-20 z-[200] w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevated flex items-center justify-center hover-lift active-press"
      >
        <Icon name={isOpen ? "X" : "Plus"} size={24} color="currentColor" />
      </button>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-[199] animate-fade-in">
          <div className="fixed inset-x-0 bottom-0 bg-card rounded-t-2xl shadow-elevated border-t border-border p-6 animate-slide-up safe-area-inset-bottom">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Log Activity</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground active-press"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Category"
                placeholder="Select category"
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                required
              />

              <Input
                label="Activity Name"
                type="text"
                placeholder="e.g., Morning run"
                value={activityName}
                onChange={(e) => setActivityName(e?.target?.value)}
                required
              />

              <Select
                label="Intensity"
                placeholder="Select intensity"
                options={intensities}
                value={intensity}
                onChange={setIntensity}
                required
              />



              <Button
                type="submit"
                variant="default"
                fullWidth
                iconName="Plus"
                iconPosition="left"
                size="lg"
              >
                Log Activity
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActionButton;