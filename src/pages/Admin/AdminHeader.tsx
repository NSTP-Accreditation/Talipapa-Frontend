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
    <div className="bg-white border-b border-gray-200 py-4 pr-8">
      <div className="flex items-center justify-between px-8">
        {/* Left Side - System Info */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">{title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Right Side - Admin User Info */}
        <div className="flex items-center gap-6 mr-6">
          <div className="text-right pr-4">
            <p className="text-sm font-medium text-gray-900 leading-tight">Admin User</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <div 
            className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold shadow-md mr-4 leading-none flex-shrink-0" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              minWidth: '40px',
              minHeight: '40px'
            }}
          >
            A
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
