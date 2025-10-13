// import React from 'react';
import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { FullPageSpinner } from '@/components/LoadingSkeletons';

// import Forms from '@/pages/Admin/subcomponents/Forms'; // Forms.tsx doesn't exist
import { AuthProvider } from './contexts/AuthContext';

// ADMIN EXPORT HERE - Lazy loaded for better performance
const AdminLayout = lazy(() => import('@/admin/layout/AdminLayout'));
const Dashboard = lazy(() => import('@/admin/pages/Dashboard'));
const TradingStatistics = lazy(() => import('@/admin/pages/TradingStatistics'));
const Settings = lazy(() => import('@/admin/pages/Settings'));
const ActivityLogs = lazy(() => import('@/admin/pages/ActivityLogs'));
const EarnPointsLogs = lazy(() => import('@/admin/pages/EarnPoints'));
const SwapLogs = lazy(() => import('@/admin/pages/SwapItem'));
const Guidelines = lazy(() => import('@/admin/pages/Guidelines'));
const News = lazy(() => import('@/admin/pages/NewsEvents'));
const AboutUsAdmin = lazy(() => import('@/admin/pages/AboutUs'));
const Achievements = lazy(() => import('@/admin/pages/Achievements'));
const AdminLogin = lazy(() => import('@/admin/auth/AdminLogin'));
const Inventory = lazy(() => import('@/admin/pages/Inventory'));
const SwapItem = lazy(() => import('@/admin/pages/SwapItem'));
const GreenPages = lazy(() => import('@/admin/pages/GreenPages'));
const Records = lazy(() => import('@/admin/pages/Records'));
const TalipapaNatin = lazy(() => import('@/admin/pages/TalipapaNatin'));

// USER PAGE EXPORT HERE - Lazy loaded
const Home = lazy(() => import('@/users/page/Home'));
const GuidelinesApp = lazy(() => import('@/users/page/Guidelines'));
const MoreGuides = lazy(() => import('@/users/page/MoreGuides'));
const UnifiedGuide = lazy(
  () => import('@/users/guidelines/guides/UnifiedGuide')
);
const Trading = lazy(() => import('@/users/page/Trading'));
const AboutUs = lazy(() => import('@/users/page/AboutUs'));

// These are small and used everywhere, keep them imported normally
import NavBar from '@/users/components/NavBar';
import Footer from '@/users/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/components/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <SuspenseWrapper fallback={<FullPageSpinner />}>
          <Routes>
            {/* Admin Login Route - No protection needed */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes - No NavBar/Footer */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Main Routes */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Trading Routes */}
              <Route path="trading" element={<TradingStatistics />} />
              <Route
                path="trading/statistics"
                element={<TradingStatistics />}
              />
              <Route path="trading/activity" element={<ActivityLogs />} />
              <Route path="trading/earn-points" element={<EarnPointsLogs />} />
              <Route path="trading/swap-item" element={<SwapItem />} />
              <Route path="trading/swap" element={<SwapLogs />} />

              {/* Green Pages Route */}
              <Route path="green-pages" element={<GreenPages />} />

              {/* Home Editables Routes */}
              <Route path="about" element={<AboutUsAdmin />} />
              <Route path="about/achievements" element={<Achievements />} />
              <Route path="news" element={<News />} />
              <Route path="talipapa-natin" element={<TalipapaNatin />} />

              {/* Forms Route (Admin version) - Disabled: Forms.tsx doesn't exist */}
              {/* <Route path="forms" element={<Forms />} /> */}

              {/* Guidelines Route (Admin version) */}
              <Route path="guidelines" element={<Guidelines />} />

              {/* Inventory Route */}
              <Route path="inventory" element={<Inventory />} />

              {/* Logs Routes (same as trading but under notifications path) */}
              <Route
                path="notifications"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Logs Dashboard</h1>
                    <p>Select a log type from the menu.</p>
                  </div>
                }
              />
              <Route path="notifications/activity" element={<ActivityLogs />} />
              <Route
                path="notifications/earn-points"
                element={<EarnPointsLogs />}
              />
              <Route path="notifications/swap" element={<SwapLogs />} />

              {/* Settings Route */}
              <Route path="settings" element={<Settings />} />
              {/* Records Route */}
              <Route path="records" element={<Records />} />

              {/* 404 for unknown admin routes */}
              <Route path="*" element={<NotFound />} />

              {/* Legacy/Placeholder Routes */}
              <Route
                path="services"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Services Admin</h1>
                    <p>Manage services here.</p>
                  </div>
                }
              />
              <Route path="activity-logs" element={<ActivityLogs />} />
              <Route
                path="users"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Users Admin</h1>
                    <p>Manage users here.</p>
                  </div>
                }
              />
            </Route>

            {/* Public Routes - With NavBar/Footer */}
            <Route
              path="*"
              element={
                <div className="App">
                  <NavBar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/guidelines" element={<GuidelinesApp />} />
                    <Route path="/guidelines/more" element={<MoreGuides />} />
                    <Route
                      path="/guidelines/:guideId"
                      element={<UnifiedGuide />}
                    />
                    <Route path="/trading" element={<Trading />} />
                    <Route path="/aboutus" element={<AboutUs />} />

                    {/* 404 for unknown public routes */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </SuspenseWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
