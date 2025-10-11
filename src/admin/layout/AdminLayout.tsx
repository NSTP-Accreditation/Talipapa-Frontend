import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from '../components/MenuBar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Admin MenuBar */}
      <MenuBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - offset by sidebar width */}
      <div className="sm:ml-[310px] flex flex-col min-h-screen">
        {/* Admin Header */}
        <AdminHeader onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
