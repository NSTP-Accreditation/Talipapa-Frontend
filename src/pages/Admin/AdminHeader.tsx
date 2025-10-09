import React from 'react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'Barangay Information System',
  subtitle = 'Content Management System',
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - System Info */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">{title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Right Side - Admin User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 leading-tight">Admin User</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
