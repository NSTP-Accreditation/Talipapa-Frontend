import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import NavBar from '@/components/NavBar';
import GuidelinesApp from '@/pages/guidelines/Guidelines';
import MoreGuides from '@/pages/guidelines/MoreGuides';
import BarangayClearanceGuide from '@/pages/guidelines/guides/BarangayClearanceGuide';
import CertificateOfIndigencyGuide from '@/pages/guidelines/guides/CertificateOfIndigencyGuide';
import CertificateOfResidencyGuide from '@/pages/guidelines/guides/CertificateOfResidencyGuide';
import BusinessClearanceGuide from '@/pages/guidelines/guides/BusinessClearanceGuide';
import GoodMoralCharacterGuide from '@/pages/guidelines/guides/GoodMoralCharacterGuide';
import TrafficClearanceGuide from '@/pages/guidelines/guides/TrafficClearanceGuide';
import BarangayAffidavitGuide from '@/pages/guidelines/guides/BarangayAffidavitGuide';
import PhilsysIdGuide from '@/pages/guidelines/guides/PhilsysIdGuide';
import QuezonCityIdGuide from '@/pages/guidelines/guides/QuezonCityIdGuide';
import Trading from '@/pages/trading/Trading';
import Footer from '@/components/Footer';
import AboutUs from '@/pages/aboutus/AboutUs';
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/subcomponents/Dashboard';
import EcocycleTrading from '@/pages/Admin/subcomponents/Ecocycletrading';
import Settings from '@/pages/Admin/subcomponents/Settings';
import ActivityLogs from '@/pages/Admin/subcomponents/ActivityLogs';
import EarnPointsLogs from '@/pages/Admin/subcomponents/EarnPointsLogs';
import SwapLogs from '@/pages/Admin/subcomponents/SwapLogs';
// import Forms from '@/pages/Admin/subcomponents/Forms'; // Forms.tsx doesn't exist
import Guidelines from '@/pages/Admin/subcomponents/Guidelines';
import News from '@/pages/Admin/subcomponents/NewsEvents';
import AboutUsAdmin from '@/pages/Admin/subcomponents/AboutUs';
import Achievements from '@/pages/Admin/subcomponents/Achievements';
import AdminLogin from '@/pages/Admin/AdminLogin';
import ProtectedRoute from '@/components/ProtectedRoute';
import Inventory from '@/pages/Admin/subcomponents/Inventory';
import { AuthProvider } from '@/contexts/AuthContext';

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
            <Route path="trading" element={<EcocycleTrading />} />
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
