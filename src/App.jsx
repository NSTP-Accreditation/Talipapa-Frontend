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
import Dashboard from '@/pages/Admin/Dashboard';
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
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<div className="p-6"><h1 className="text-2xl font-bold">About Us Admin</h1><p>Manage about us content here.</p></div>} />
            <Route path="services" element={<div className="p-6"><h1 className="text-2xl font-bold">Services Admin</h1><p>Manage services here.</p></div>} />
            <Route path="resources" element={<div className="p-6"><h1 className="text-2xl font-bold">Resources Admin</h1><p>Manage resources here.</p></div>} />
            <Route path="trading" element={<div className="p-6"><h1 className="text-2xl font-bold">Trading Admin</h1><p>Manage trading content here.</p></div>} />
            <Route path="news" element={<div className="p-6"><h1 className="text-2xl font-bold">News Admin</h1><p>Manage news articles here.</p></div>} />
            <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Admin</h1><p>Manage users here.</p></div>} />
            <Route path="notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Notifications Admin</h1><p>Manage notifications here.</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings Admin</h1><p>Manage settings here.</p></div>} />
          </Route>

          {/* Public Routes - With NavBar/Footer */}
          <Route path="*" element={
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
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
