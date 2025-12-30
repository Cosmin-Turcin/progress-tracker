export const ACHIEVEMENT_DEFINITIONS = [
    // 1. Core Milestones
    {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Log your first activity! Welcome aboard.',
        requirement: 'Log 1 activity',
        icon: 'Footprints',
        iconColor: 'var(--color-primary)',
        achievementType: 'milestone'
    },
    {
        id: 'points_100_day',
        title: 'High Flyer',
        description: 'You earned over 100 points in a single day!',
        requirement: 'Earn 100+ points in one day',
        icon: 'Rocket',
        iconColor: 'var(--color-success)',
        achievementType: 'milestone'
    },
    {
        id: 'points_500',
        title: 'Halfway Hero',
        description: 'Reached 500 total points across all categories.',
        requirement: 'Earn 500 total points',
        icon: 'Shield',
        iconColor: 'var(--color-primary)',
        achievementType: 'milestone'
    },
    {
        id: 'points_1000',
        title: 'Millennium Member',
        description: 'Incredible! You\'ve reached 1,000 total points.',
        requirement: 'Earn 1000 total points',
        icon: 'Crown',
        iconColor: 'var(--color-warning)',
        achievementType: 'milestone'
    },

    // 2. Category Milestones (10 Logs each)
    {
        id: 'fitness_10',
        title: 'Fitness Fanatic',
        description: 'Consistency is key. You\'ve logged 10 fitness activities.',
        requirement: 'Log 10 Fitness activities',
        icon: 'Dumbbell',
        iconColor: 'var(--color-success)',
        achievementType: 'milestone'
    },
    {
        id: 'mindset_10',
        title: 'Mindset Master',
        description: 'Focus and clarity. 10 mindset sessions completed.',
        requirement: 'Log 10 Mindset activities',
        icon: 'Brain',
        iconColor: 'var(--color-primary)',
        achievementType: 'milestone'
    },
    {
        id: 'nutrition_10',
        title: 'Nutrition Ninja',
        description: 'Fueling your body right. 10 nutrition logs.',
        requirement: 'Log 10 Nutrition activities',
        icon: 'Apple',
        iconColor: 'var(--color-accent)',
        achievementType: 'milestone'
    },
    {
        id: 'work_10',
        title: 'Work Warrior',
        description: 'Peak productivity. 10 work blocks logged.',
        requirement: 'Log 10 Work activities',
        icon: 'Briefcase',
        iconColor: 'var(--color-secondary)',
        achievementType: 'milestone'
    },

    // 3. Streak Milestones
    {
        id: 'streak_3',
        title: 'Streak Starter',
        description: '3 days in a row! You\'re building a great habit.',
        requirement: 'Maintain a 3-day streak',
        icon: 'Zap',
        iconColor: 'var(--color-warning)',
        achievementType: 'streak'
    },
    {
        id: 'streak_7',
        title: 'Consistent',
        description: 'A full week! You\'re on fire.',
        requirement: 'Maintain a 7-day streak',
        icon: 'Flame',
        iconColor: 'var(--color-accent)',
        achievementType: 'streak'
    },
    {
        id: 'streak_14',
        title: 'Bi-Weekly Hero',
        description: 'Two weeks of pure discipline.',
        requirement: 'Maintain a 14-day streak',
        icon: 'Trophy',
        iconColor: 'var(--color-primary)',
        achievementType: 'streak'
    },
    {
        id: 'streak_30',
        title: 'Monthly Legend',
        description: 'A full month! You are now a habit-building legend.',
        requirement: 'Maintain a 30-day streak',
        icon: 'Star',
        iconColor: 'var(--color-warning)',
        achievementType: 'streak'
    },

    // 4. Special & Time-based
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'The early bird gets the worm. Activity logged before 7 AM.',
        requirement: 'Log an activity before 7:00 AM',
        icon: 'Sunrise',
        iconColor: 'var(--color-warning)',
        achievementType: 'special'
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Burning the midnight oil. Activity logged after 11 PM.',
        requirement: 'Log an activity after 11:00 PM',
        icon: 'Moon',
        iconColor: 'var(--color-secondary)',
        achievementType: 'special'
    }
];
