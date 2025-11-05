// import React from 'react';
import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { FullPageSpinner } from '@/components/LoadingSkeletons';
import { ToastProvider } from './components/ui/toast';

// import Forms from '@/pages/Admin/subcomponents/Forms'; // Forms.tsx doesn't exist
import { AuthProvider } from './contexts/AuthContext';

// ADMIN EXPORT HERE - Lazy loaded for better performance
const AdminLayout = lazy(() => import('@/admin/layout/AdminLayout'));
const Dashboard = lazy(() => import('@/admin/pages/dashboard/Dashboard'));
const TradingStatistics = lazy(
  () => import('@/admin/pages/trading-statistics/TradingStatistics')
);
const Settings = lazy(() => import('@/admin/pages/settings/Settings'));
const ActivityLogs = lazy(
  () => import('@/admin/pages/activity-logs/ActivityLogs')
);
const EarnPointsLogs = lazy(
  () => import('@/admin/pages/earn-points/EarnPoints')
);
const SwapLogs = lazy(() => import('@/admin/pages/swap-item/SwapItem'));
const Guidelines = lazy(() => import('@/admin/pages/guidelines/Guidelines'));
const CarouselEditor = lazy(() => import('@/admin/pages/carousel'));
const News = lazy(() => import('@/admin/pages/NewsEvents/News'));
const AboutUsAdmin = lazy(() => import('@/admin/pages/about-us/AboutUs'));
const Achievements = lazy(
  () => import('@/admin/pages/achievements/Achievements')
);
const AdminLogin = lazy(() => import('@/admin/auth/AdminLogin'));
const Inventory = lazy(() => import('@/admin/pages/inventory/Inventory'));
const FarmInventory = lazy(
  () => import('@/admin/pages/farm-inventory/FarmInventory')
);
const SwapItem = lazy(() => import('@/admin/pages/swap-item/SwapItem'));
const GreenPages = lazy(() => import('@/admin/pages/green-pages/GreenPages'));
const TradingLocations = lazy(
  () => import('@/admin/pages/trading-locations/TradingLocations')
);
const Records = lazy(() => import('@/admin/pages/records/Records'));
const NonResidentRecords = lazy(
  () => import('@/admin/pages/records/NonResidentRecords')
);
const EstablishmentRecords = lazy(
  () => import('@/admin/pages/records/EstablishmentRecords')
);
const TalipapaNatin = lazy(
  () => import('@/admin/pages/talipapanatin/TalipapaNatin')
);

// USER PAGE EXPORT HERE - Lazy loaded
const Home = lazy(() => import('@/users/page/Home'));
const GuidelinesApp = lazy(() => import('@/users/page/Guidelines'));
const MoreGuides = lazy(() => import('@/users/page/MoreGuides'));
const UnifiedGuide = lazy(
  () => import('@/users/guidelines/guides/UnifiedGuide')
);
const Trading = lazy(() => import('@/users/page/Trading'));
const AboutUs = lazy(() => import('@/users/page/AboutUs'));
const EmergencyContact = lazy(() => import('@/users/page/EmergencyContact'));

// These are small and used everywhere, keep them imported normally
import NavBar from '@/users/components/NavBar';
import Footer from '@/users/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import NotFound from '@/components/NotFound';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import { BrgyInfoProvider } from './contexts/BrgyInfoContext';
import { Permission } from '@/types/rbac.types';

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <BrgyInfoProvider>
          <ToastProvider position="top-right" maxToasts={5}>
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
                    {/* Main Routes - Dashboard accessible to all authenticated users */}
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Trading Routes - SuperAdmin ONLY (MANAGE_TRADING permission) */}
                    <Route
                      path="trading"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <TradingStatistics />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="trading/statistics"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <TradingStatistics />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="trading/activity"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <ActivityLogs />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="trading/earn-points"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <EarnPointsLogs />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="trading/swap-item"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <SwapItem />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="trading/swap"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <SwapLogs />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="trading/locations"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <TradingLocations />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* Green Pages Route - SuperAdmin & Admin FULL, Staff VIEW */}
                    <Route
                      path="green-pages"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_GREEN_PAGES}
                        >
                          <GreenPages />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* Home Editables Routes - SuperAdmin & Admin ONLY */}
                    <Route
                      path="about"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_CONTENT}
                        >
                          <AboutUsAdmin />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="about/achievements"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_ACHIEVEMENTS}
                        >
                          <Achievements />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="news"
                      element={
                        <RoleProtectedRoute permission={Permission.VIEW_NEWS}>
                          <News />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="carousel-editor"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_CONTENT}
                        >
                          <CarouselEditor />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="talipapa-natin"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_CONTENT}
                        >
                          <TalipapaNatin />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* Forms Route (Admin version) - Disabled: Forms.tsx doesn't exist */}
                    {/* <Route path="forms" element={<Forms />} /> */}

                    {/* Guidelines Route (Admin version) - SuperAdmin & Admin ONLY */}
                    <Route
                      path="guidelines"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_GUIDELINES}
                        >
                          <Guidelines />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* Inventory Route - SuperAdmin FULL, Admin VIEW */}
                    <Route
                      path="inventory"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_INVENTORY}
                        >
                          <Inventory />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* Farm Inventory Route - SuperAdmin FULL, Admin VIEW */}
                    <Route
                      path="farm-inventory"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_FARM_INVENTORY}
                        >
                          <FarmInventory />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* Logs Routes (same as trading but under notifications path) - SuperAdmin ONLY */}
                    <Route
                      path="notifications"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_ACTIVITY_LOGS}
                        >
                          <div className="p-6">
                            <h1 className="text-2xl font-bold">
                              Logs Dashboard
                            </h1>
                            <p>Select a log type from the menu.</p>
                          </div>
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="notifications/activity"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_ACTIVITY_LOGS}
                        >
                          <ActivityLogs />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="notifications/earn-points"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <EarnPointsLogs />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="notifications/swap"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.MANAGE_TRADING}
                        >
                          <SwapLogs />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* Settings Route - SuperAdmin ONLY */}
                    <Route
                      path="settings"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_SETTINGS}
                        >
                          <Settings />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* Records Routes - SuperAdmin FULL, Admin VIEW */}
                    <Route
                      path="records"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_RECORDS}
                        >
                          <Records />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="records/non-resident"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_RECORDS}
                        >
                          <NonResidentRecords />
                        </RoleProtectedRoute>
                      }
                    />
                    <Route
                      path="records/establishment"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_RECORDS}
                        >
                          <EstablishmentRecords />
                        </RoleProtectedRoute>
                      }
                    />

                    {/* 404 for unknown admin routes */}
                    <Route path="*" element={<NotFound />} />

                    {/* Activity Logs Route - SuperAdmin ONLY */}
                    <Route
                      path="activity-logs"
                      element={
                        <RoleProtectedRoute
                          permission={Permission.VIEW_ACTIVITY_LOGS}
                        >
                          <ActivityLogs />
                        </RoleProtectedRoute>
                      }
                    />

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
                          <Route
                            path="/guidelines"
                            element={<GuidelinesApp />}
                          />
                          <Route
                            path="/guidelines/more"
                            element={<MoreGuides />}
                          />
                          <Route
                            path="/guidelines/:guideId"
                            element={<UnifiedGuide />}
                          />
                          <Route path="/trading" element={<Trading />} />
                          <Route path="/aboutus" element={<AboutUs />} />
                          <Route
                            path="/emergency-contact"
                            element={<EmergencyContact />}
                          />

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
          </ToastProvider>
        </BrgyInfoProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;
