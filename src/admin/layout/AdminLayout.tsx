import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from '../components/MenuBar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    try {
      if (sidebarOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    } catch (e) {
      // ignore (server-side rendering or restricted env)
    }

    return () => {
      try {
        document.body.classList.remove('sidebar-open');
      } catch (e) {}
    };
  }, [sidebarOpen]);
  return (
    <div className="min-h-screen bg-gradient-professional gradient-mesh relative">
      {/* Fixed Admin MenuBar */}
      <MenuBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - offset by sidebar width */}
      <div className="sm:ml-[310px] flex flex-col min-h-screen">
        {/* Admin Header */}
        <AdminHeader
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((s) => !s)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
