// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Forms from '@/pages/Admin/subcomponents/Forms'; // Forms.tsx doesn't exist
import { AuthProvider } from './contexts/AuthContext';


// ADMIN EXPORT HERE
import AdminLayout from '@/admin/layout/AdminLayout';
import Dashboard from '@/admin/pages/Dashboard';
import TradingStatistics from '@/admin/pages/TradingStatistics';
import Settings from '@/admin/pages/Settings';
import ActivityLogs from '@/admin/pages/Records';
import EarnPointsLogs from '@/admin/pages/EarnPoints';
import SwapLogs from '@/admin/pages/SwapItem';
import Guidelines from '@/admin/pages/Guidelines';
import News from '@/admin/pages/NewsEvents';
import AboutUsAdmin from '@/admin/pages/AboutUs';
import Achievements from '@/admin/pages/Achievements';
import AdminLogin from '@/admin/auth/AdminLogin';
import ProtectedRoute from '@/components/ProtectedRoute';
import Inventory from '@/admin/pages/Inventory';
// USER PAGE EXPORT HERE
import Home from '@/users/page/Home';
import NavBar from '@/users/components/NavBar';
import GuidelinesApp from '@/users/page/Guidelines';
import MoreGuides from '@/users/page/MoreGuides';
import BarangayClearanceGuide from '@/users/guidelines/guides/CertificateOfIndigencyGuide';
import CertificateOfIndigencyGuide from '@/users/guidelines/guides/CertificateOfIndigencyGuide';
import CertificateOfResidencyGuide from '@/users/guidelines/guides/CertificateOfResidencyGuide';
import BusinessClearanceGuide from '@/users/guidelines/guides/BusinessClearanceGuide';
import GoodMoralCharacterGuide from '@/users/guidelines/guides/GoodMoralCharacterGuide';
import TrafficClearanceGuide from '@/users/guidelines/guides/TrafficClearanceGuide';
import BarangayAffidavitGuide from '@/users/guidelines/guides/BarangayAffidavitGuide';
import PhilsysIdGuide from '@/users/guidelines/guides/PhilsysIdGuide';
import QuezonCityIdGuide from '@/users/guidelines/guides/QuezonCityIdGuide';
import HealthCertificateGuide from '@/users/guidelines/guides/HealthCertificateGuide';
import FloodAssistanceGuide from '@/users/guidelines/guides/FloodAssistanceGuide';
import LandUsePermitGuide from '@/users/guidelines/guides/LandUsePermitGuide';
import RestrictedAreaPassGuide from '@/users/guidelines/guides/RestrictedAreaPassGuide';
import Trading from '@/users/page/Trading';
import AboutUs from '@/users/page/AboutUs';



import Footer from '@/users/components/Footer';


function App() {
  return (
    <AuthProvider>
      <Router>
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
            <Route path="trading/statistics" element={<TradingStatistics />} />
            <Route path="trading/activity" element={<ActivityLogs />} />
            <Route path="trading/earn-points" element={<EarnPointsLogs />} />
            <Route path="trading/swap" element={<SwapLogs />} />

            {/* Home Editables Routes */}
            <Route path="about" element={<AboutUsAdmin />} />
            <Route path="about/achievements" element={<Achievements />} />
            <Route path="news" element={<News />} />

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
              path="resources"
              element={<ActivityLogs />}
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
                  <Route path="/guidelines" element={<GuidelinesApp />} />
                  <Route path="/guidelines/more" element={<MoreGuides />} />
                  <Route path="/guidelines/barangay-clearance" element={<BarangayClearanceGuide />} />
                  <Route path="/guidelines/certificate-of-indigency" element={<CertificateOfIndigencyGuide />} />
                  <Route path="/guidelines/certificate-of-residency" element={<CertificateOfResidencyGuide />} />
                  <Route path="/guidelines/business-clearance" element={<BusinessClearanceGuide />} />
                  <Route path="/guidelines/good-moral-character" element={<GoodMoralCharacterGuide />} />
                  <Route path="/guidelines/traffic-clearance" element={<TrafficClearanceGuide />} />
                  <Route path="/guidelines/barangay-affidavit" element={<BarangayAffidavitGuide />} />
                  <Route path="/guidelines/philsys-id" element={<PhilsysIdGuide />} />
                  <Route path="/guidelines/quezon-city-id" element={<QuezonCityIdGuide />} />
                  <Route path="/guidelines/health-certificate" element={<HealthCertificateGuide />} />
                  <Route path="/guidelines/flood-assistance" element={<FloodAssistanceGuide />} />
                  <Route path="/guidelines/land-use-permit" element={<LandUsePermitGuide />} />
                  <Route path="/guidelines/restricted-area-pass" element={<RestrictedAreaPassGuide />} />
                  <Route path="/trading" element={<Trading />} />
                  <Route path="/aboutus" element={<AboutUs />} />
                </Routes>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
