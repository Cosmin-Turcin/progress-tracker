import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Home, BarChart3, Target, Bell, Trophy, Settings,
  User, LogOut, Calendar, Activity, Users, LayoutDashboard,
  TrendingUp, Star, MessageSquare, ChevronDown, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStats } from '../contexts/StatsContext';
import Icon from './AppIcon';
import BrandLogo from './BrandLogo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { dailyPoints, goalProgress, dailyGoal } = useStats();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const mainNav = [
    { path: '/daily-activity-dashboard', icon: LayoutDashboard, label: 'Today' },
    { path: '/progress-analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/habit-consistency-hub', icon: Target, label: 'Habits' },
  ];

  const subNav = [
    { path: '/social-activity-feed', icon: Activity, label: 'Feed' },
    { path: '/search-professionals', icon: Search, label: 'Professionals' },
    { path: '/friends-leaderboard', icon: Users, label: 'Leaderboard' },
    { path: '/achievements-badges-gallery', icon: Trophy, label: 'Achievements' },
    { path: '/reminders-notifications', icon: Bell, label: 'Reminders' },
    { path: '/settings-customization', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path) => location?.pathname === path;

  return (
    <header className="sticky top-0 z-[100] w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Main Nav & Profile */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/daily-activity-dashboard" className="flex items-center gap-3 group">
              <BrandLogo className="w-10 h-10 group-hover:scale-105 transition-transform" gradient={true} />
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 hidden sm:block tracking-tight">
                Ordomatic
              </span>
            </Link>

            {/* Desktop Tier 1 Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${active
                        ? 'bg-primary text-primary-foreground shadow-subtle'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            {/* Quick Stats (Desktop) */}
            {user && (
              <div className="hidden lg:flex items-center gap-6 pr-4 border-r border-border/50">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Daily Points</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-data text-primary leading-none">{dailyPoints}</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden self-center">
                      <div
                        className="h-full bg-secondary transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${goalProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold font-data text-muted-foreground">{goalProgress}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* User Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-elevated z-20 overflow-hidden animate-scale-in">
                      <div className="p-3 border-b border-border bg-muted/30">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Account</p>
                        <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors mt-1"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Tier 2: Desktop Sub Nav */}
        <div className="hidden md:flex items-center h-10 gap-6 border-t border-border/50">
          {subNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-1.5 h-full px-1 text-xs font-medium transition-all relative
                  ${active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon size={14} />
                {item.label}
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-down">
          <nav className="p-4 space-y-6">
            {/* Mobile Stats Panel */}
            <div className="px-3 py-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Today's Progress</span>
                  <span className="text-2xl font-black text-primary font-data">{dailyPoints} <span className="text-xs font-medium text-muted-foreground font-sans">Points</span></span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-muted flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-primary/10"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={113}
                      strokeDashoffset={113 - (113 * goalProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-foreground">{goalProgress}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Goal: {dailyGoal}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Menu</p>
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium
                      ${active
                        ? 'bg-primary text-primary-foreground shadow-subtle'
                        : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Features</p>
              {subNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                      ${active
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 bg-destructive text-destructive-foreground rounded-xl font-semibold shadow-lg shadow-destructive/20"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;