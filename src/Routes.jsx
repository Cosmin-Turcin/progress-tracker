import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HabitConsistencyHub from './pages/habit-consistency-hub';
import DailyActivityDashboard from './pages/daily-activity-dashboard';
import ProgressAnalytics from './pages/progress-analytics';
import SettingsCustomization from './pages/settings-customization';
import RemindersNotifications from './pages/reminders-notifications';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import AchievementsBadgesGallery from 'pages/achievements-badges-gallery';
import FriendsLeaderboard from './pages/friends-leaderboard';
import Profile from './pages/profile';
import SocialActivityFeed from 'pages/social-activity-feed';
import DirectMessaging from "pages/direct-messaging";
import LandingPage from "pages/landing/LandingPage";
import SearchProfessionals from "pages/search-professionals";
import CVBuilder from "pages/cv-builder";
import GlobalFooter from "components/GlobalFooter";
import HubDashboard from "pages/hub/HubDashboard";
import FitnessHub from "pages/fitness/FitnessHub";
import MindsetHub from "pages/mindset/MindsetHub";
import NutritionHub from "pages/nutrition/NutritionHub";
import WorkHub from "pages/work/WorkHub";

function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <ScrollToTop />
          <RouterRoutes>
            {/* Auth Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/user-profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/achievements-badges-gallery" element={<ProtectedRoute><AchievementsBadgesGallery /></ProtectedRoute>} />
            <Route
              path="/friends-leaderboard"
              element={
                <ProtectedRoute>
                  <FriendsLeaderboard />
                </ProtectedRoute>
              }
            />
            <Route path="/friend-profile-view/:userId" element={<Profile />} />
            <Route path="/u/:username" element={<Profile />} />

            <Route
              path="/social-activity-feed"
              element={
                <ProtectedRoute>
                  <SocialActivityFeed />
                </ProtectedRoute>
              }
            />

            <Route path="/direct-messaging" element={<ProtectedRoute><DirectMessaging /></ProtectedRoute>} />
            <Route path="/direct-messaging/:friendId" element={<ProtectedRoute><DirectMessaging /></ProtectedRoute>} />
            <Route path="/search-professionals" element={<ProtectedRoute><SearchProfessionals /></ProtectedRoute>} />
            <Route path="/cv-builder" element={<ProtectedRoute><CVBuilder /></ProtectedRoute>} />
            <Route path="/hub" element={<ProtectedRoute><HubDashboard /></ProtectedRoute>} />
            <Route path="/fitness" element={<ProtectedRoute><FitnessHub /></ProtectedRoute>} />
            <Route path="/mindset" element={<ProtectedRoute><MindsetHub /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><NutritionHub /></ProtectedRoute>} />
            <Route path="/work" element={<ProtectedRoute><WorkHub /></ProtectedRoute>} />

            {/* Define your route here */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/habit-consistency-hub" element={<HabitConsistencyHub />} />
            <Route path="/daily-activity-dashboard" element={<DailyActivityDashboard />} />
            <Route path="/progress-analytics" element={<ProgressAnalytics />} />
            <Route path="/settings-customization" element={<SettingsCustomization />} />
            <Route path="/reminders-notifications" element={<RemindersNotifications />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
          <GlobalFooter />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;