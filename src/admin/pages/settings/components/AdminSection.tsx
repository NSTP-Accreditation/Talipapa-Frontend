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
    <Card className="shadow-md border border-gray-200 overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-white border-b border-gray-200 flex items-center justify-between gap-4">
        <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          Admin Accounts
        </CardTitle>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => openAddAdminModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Admin
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-6 lg:p-8">
        {adminData && adminData.length > 0 ? (
          <div className="space-y-4">
            {adminData.map((admin) => (
              <div
                key={admin._id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-5 lg:p-6 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-4 ring-green-100">
                    <span className="text-white font-bold text-xl lg:text-2xl">
                      {admin.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base lg:text-lg text-gray-900 truncate">
                      {admin.username}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{admin.contactNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0">
                  <div className="flex flex-wrap gap-2">
                    {(function deriveRoles() {
                      const anyAdmin = admin as any;

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
                        typeof anyAdmin.roles === 'object'
                      ) {
                        const roleKeys = Object.keys(anyAdmin.roles);

                        const superId = String(
                          import.meta.env.VITE_SUPERADMIN ?? ''
                        );
                        const adminId = String(
                          import.meta.env.VITE_ADMIN ?? ''
                        );

                        return roleKeys.map((k) => {
                          const keyLower = String(k).toLowerCase();
                          // If the key already looks like a human label (case-insensitive)
                          if (keyLower === 'superadmin') return 'SuperAdmin';
                          if (keyLower === 'admin') return 'Admin';

                          // If the key matches the numeric id for roles
                          if (k === superId) return 'SuperAdmin';
                          if (k === adminId) return 'Admin';

                          // Check the value for a label or id
                          const v = anyAdmin.roles[k];
                          const vStr = String(v).toLowerCase();
                          if (vStr === 'superadmin') return 'SuperAdmin';
                          if (vStr === 'admin') return 'Admin';
                          if (String(v) === superId) return 'SuperAdmin';
                          if (String(v) === adminId) return 'Admin';

                          // Fallback to the raw key (preserve original casing)
                          return k;
                        });
                      }

                      // No roles found from API shapes — try a small heuristic:
                      // if the username contains "super" (case-insensitive),
                      // assume this is a SuperAdmin. This covers cases where
                      // the backend didn't populate role keys for some users.
                      const username = String(
                        anyAdmin.username || ''
                      ).toLowerCase();
                      if (
                        !Array.isArray(admin.rolesKeys) ||
                        !admin.rolesKeys.length
                      ) {
                        if (
                          !anyAdmin.roles ||
                          (Array.isArray(anyAdmin.roles) &&
                            !anyAdmin.roles.length) ||
                          (typeof anyAdmin.roles === 'object' &&
                            Object.keys(anyAdmin.roles).length === 0)
                        ) {
                          if (username.includes('super')) {
                            return ['SuperAdmin'];
                          }
                        }
                      }

                      return [] as string[];
                    })().map((role) => (
                      <span
                        key={role}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1 ${
                          String(role).toLowerCase() === 'superadmin'
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                            : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {role}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      openDeleteAdminModal(true);
                      setAdminToDelete(admin);
                    }}
                    className="w-10 h-10 flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all shadow-sm border border-red-200 hover:border-red-600 flex-shrink-0"
                    title="Delete admin account"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No admin accounts found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Add New Admin" to create one
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSection;
