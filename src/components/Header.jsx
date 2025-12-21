import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, BarChart3, Target, Bell, Trophy, Settings, User, LogOut, Calendar, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Icon from './AppIcon';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const linkClass = (path) => {
    const isActive = location?.pathname === path;
    return `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
      isActive 
        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
  };

  const menuItems = [
    { path: '/daily-activity-dashboard', icon: Home, label: 'Daily Dashboard' },
    { path: '/progress-analytics', icon: BarChart3, label: 'Progress Analytics' },
    { path: '/habit-consistency-hub', icon: Calendar, label: 'Habit Consistency' },
    { path: '/reminders-notifications', icon: Bell, label: 'Reminders' },
    { path: '/achievements-badges-gallery', icon: Trophy, label: 'Achievements' },
    { path: '/friends-leaderboard', icon: Trophy, label: 'Friends' },
    { path: '/settings-customization', icon: Settings, label: 'Settings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => location?.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/daily-activity-dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Activity Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/daily-activity-dashboard"
              className={linkClass('/daily-activity-dashboard')}
            >
              Daily Dashboard
            </Link>
            <Link
              to="/progress-analytics"
              className={linkClass('/progress-analytics')}
            >
              Progress Analytics
            </Link>
            <Link
              to="/habit-consistency-hub"
              className={linkClass('/habit-consistency-hub')}
            >
              Habit Consistency
            </Link>
            <Link
              to="/reminders-notifications"
              className={linkClass('/reminders-notifications')}
            >
              Reminders
            </Link>
            <Link
              to="/achievements-badges-gallery"
              className={linkClass('/achievements-badges-gallery')}
            >
              Achievements
            </Link>
            <Link
              to="/friends-leaderboard"
              className={linkClass('/friends-leaderboard')}
            >
              Leaderboard
            </Link>
            <Link
              to="/user-profile"
              className={linkClass('/user-profile')}
            >
              My Profile
            </Link>
            <Link
              to="/settings-customization"
              className={linkClass('/settings-customization')}
            >
              Settings
            </Link>
          </nav>

          {/* User Profile & Logout */}
          <div className="hidden lg:flex items-center space-x-4">
            {user && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.email?.split('@')?.[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="space-y-2">
              {menuItems?.map((item) => {
                const Icon = item?.icon;
                return (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item?.path)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item?.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Section */}
            {user && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.email?.split('@')?.[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;