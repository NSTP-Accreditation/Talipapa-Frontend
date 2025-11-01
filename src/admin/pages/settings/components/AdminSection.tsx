import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Mail, Phone, Plus, Shield, Trash, Users } from 'lucide-react';
import { Admin } from '../Settings.types';

type AdminSectionProps = {
  adminData: Admin[] | null;
  openAddAdminModal: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteAdminModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAdminToDelete: React.Dispatch<React.SetStateAction<Admin>>;
};

const AdminSection = ({
  adminData,
  openAddAdminModal,
  openDeleteAdminModal,
  setAdminToDelete,
}: AdminSectionProps) => {
  return (
    <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 to-white border-b border-gray-200">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="line-clamp-1">Admin Accounts</span>
          </CardTitle>
          <button
            onClick={() => openAddAdminModal(true)}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base min-h-[44px] whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add New Admin</span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        {adminData && adminData.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {adminData.map((admin) => (
              <div
                key={admin._id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-green-300 transition-all gap-3 sm:gap-4"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-4 ring-green-100">
                    <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
                      {admin.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 truncate mb-1 sm:mb-2">
                      {admin.username}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-green-600" />
                        <span className="truncate">{admin.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-green-600" />
                        <span>{admin.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-3 flex-shrink-0">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {(function deriveRoles() {
                      const anyAdmin = admin as any;

                      // Debug logging
                      console.log('Admin data:', {
                        username: admin.username,
                        rolesKeys: admin.rolesKeys,
                        roles: anyAdmin.roles,
                      });

                      // 1) Prefer rolesKeys if provided (array of labels)
                      if (
                        Array.isArray(admin.rolesKeys) &&
                        admin.rolesKeys.length
                      ) {
                        return admin.rolesKeys as string[];
                      }

                      // 2) If `roles` is an array, assume it's labels
                      if (
                        Array.isArray(anyAdmin.roles) &&
                        anyAdmin.roles.length
                      ) {
                        return anyAdmin.roles as string[];
                      }

                      // 3) If `roles` is an object, try to derive labels from keys/values
                      if (
                        anyAdmin.roles &&
                        typeof anyAdmin.roles === 'object' &&
                        Object.keys(anyAdmin.roles).length > 0
                      ) {
                        const roleKeys = Object.keys(anyAdmin.roles);
                        const superId = Number(
                          import.meta.env.VITE_SUPERADMIN ?? 1
                        );
                        const adminId = Number(import.meta.env.VITE_ADMIN ?? 2);
                        const staffId = Number(import.meta.env.VITE_STAFF ?? 3);

                        return roleKeys
                          .map((k) => {
                            const keyLower = String(k).toLowerCase();
                            const value = anyAdmin.roles[k];

                            // Check if key is a role name (case-insensitive)
                            if (keyLower === 'superadmin') return 'SuperAdmin';
                            if (keyLower === 'admin') return 'Admin';
                            if (keyLower === 'staff') return 'Staff';

                            // Check if value is a role ID
                            if (
                              Number(value) === superId ||
                              String(value) === String(superId)
                            )
                              return 'SuperAdmin';
                            if (
                              Number(value) === adminId ||
                              String(value) === String(adminId)
                            )
                              return 'Admin';
                            if (
                              Number(value) === staffId ||
                              String(value) === String(staffId)
                            )
                              return 'Staff';

                            // Check if value is a role name
                            const vStr = String(value).toLowerCase();
                            if (vStr === 'superadmin') return 'SuperAdmin';
                            if (vStr === 'admin') return 'Admin';
                            if (vStr === 'staff') return 'Staff';

                            // Unknown role - return the key
                            return k;
                          })
                          .filter(Boolean);
                      }

                      // Fallback: empty roles array
                      console.warn('No roles found for admin:', admin.username);
                      return [] as string[];
                    })().map((role) => {
                      const roleLower = String(role).toLowerCase();
                      let colorClass = '';

                      if (roleLower === 'superadmin') {
                        colorClass =
                          'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
                      } else if (roleLower === 'admin') {
                        colorClass =
                          'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
                      } else if (roleLower === 'staff') {
                        colorClass =
                          'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
                      } else {
                        colorClass =
                          'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300';
                      }

                      return (
                        <span
                          key={role}
                          className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm flex items-center gap-1 ${colorClass}`}
                        >
                          <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{role}</span>
                        </span>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      openDeleteAdminModal(true);
                      setAdminToDelete(admin);
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all shadow-md border-2 border-red-300 hover:border-red-600 hover:shadow-lg flex-shrink-0"
                    title="Delete admin account"
                    aria-label="Delete admin account"
                  >
                    <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-gray-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <p className="text-gray-600 text-base sm:text-lg font-bold mb-2">
              No admin accounts found
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Click "Add New Admin" to create your first account
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSection;
