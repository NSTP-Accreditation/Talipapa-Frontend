import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from './MenuBar';
import AdminHeader from './AdminHeader';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Admin MenuBar */}
      <MenuBar />

      {/* Main Content Area - offset by sidebar width */}
      <div className="ml-[310px] flex flex-col min-h-screen">
        {/* Admin Header */}
        <AdminHeader />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
