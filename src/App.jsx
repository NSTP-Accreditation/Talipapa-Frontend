import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import NavBar from '@/components/NavBar';
import GuidelinesApp from '@/pages/guidelines/Guidelines';
import MoreGuides from '@/pages/guidelines/MoreGuides';
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
import Guidelines from '@/pages/Admin/subcomponents/Guidelines';
import News from '@/pages/Admin/subcomponents/News';
import AboutUsAdmin from '@/pages/Admin/subcomponents/AboutUs';
import Achievements from '@/pages/Admin/subcomponents/Achievements';
import AdminLogin from '@/pages/Admin/AdminLogin';
import ProtectedRoute from '@/components/ProtectedRoute';
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
            
            {/* Guidelines Route (Admin version) */}
            <Route path="guidelines" element={<Guidelines />} />
            
            {/* Logs Routes (same as trading but under notifications path) */}
            <Route path="notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Logs Dashboard</h1><p>Select a log type from the menu.</p></div>} />
            <Route path="notifications/activity" element={<ActivityLogs />} />
            <Route path="notifications/earn-points" element={<EarnPointsLogs />} />
            <Route path="notifications/swap" element={<SwapLogs />} />
            
            {/* Settings Route */}
            <Route path="settings" element={<Settings />} />
            
            {/* Legacy/Placeholder Routes */}
            <Route path="services" element={<div className="p-6"><h1 className="text-2xl font-bold">Services Admin</h1><p>Manage services here.</p></div>} />
            <Route path="resources" element={<div className="p-6"><h1 className="text-2xl font-bold">Resources Admin</h1><p>Manage resources here.</p></div>} />
            <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Admin</h1><p>Manage users here.</p></div>} />
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
