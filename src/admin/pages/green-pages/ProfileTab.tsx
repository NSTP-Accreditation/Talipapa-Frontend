import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { Users, Leaf } from 'lucide-react';
import useFetchData from '../../hooks/useFetchData';

interface Position {
  id: string;
  label: string;
  isCustom?: boolean;
}

interface Skill {
  _id?: string;
  name: string;
  short?: string;
  type?: string;
}

interface Staff {
  _id?: string;
  name: string;
  age?: string;
  gender?: string;
  email_address?: string;
  position?: Position[];
  skills?: Skill[];
  contact_number?: string;
  time_in_field?: string;
}

interface ProfileTabProps {
  staffDirectory?: Staff[] | null;
  openAddStaffModal: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  staffDirectory,
  openAddStaffModal,
}) => {
  const loading = staffDirectory == null;
  const error = null;
  // Normalize contact display to 11-digit local format starting with '09'
  const formatContact = (contact?: string | null) => {
    if (!contact) return null;
    const digits = contact.replace(/\D/g, '');
    if (!digits) return null;

    // If stored as '639XXXXXXXX' -> convert to '09XXXXXXXXX'
    if (digits.startsWith('639') && digits.length >= 11) {
      return '0' + digits.slice(2);
    }

    // If already '09XXXXXXXXX'
    if (digits.startsWith('09') && digits.length === 11) {
      return digits;
    }

    // If stored as '9XXXXXXXXX' (10 digits starting with 9), prefix 0
    if (digits.length === 10 && digits.startsWith('9')) {
      return '0' + digits;
    }

    // Fallback: return digits unchanged
    return digits;
  };
  return (
    <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            Staff Directory
          </CardTitle>
          <button
            onClick={openAddStaffModal}
            className="bg-white text-green-700 hover:bg-green-50 px-4 sm:px-6 py-2.5 rounded-xl font-bold shadow-lg text-sm sm:text-base transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            <span>Add Staff</span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-5 md:p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="space-y-3 sm:space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-20rem)] lg:max-h-[740px]">
          {loading && (
            <div className="p-6 text-center text-sm text-gray-500">
              Loading staff...
            </div>
          )}

          {error && (
            <div className="p-6 text-center text-sm text-red-600">
              Error loading staff: {error}
            </div>
          )}

          {Array.isArray(staffDirectory) && staffDirectory.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No staff found for this farm.
            </div>
          )}

          {Array.isArray(staffDirectory) &&
            staffDirectory.map((staff) => (
              <Card
                key={staff._id ?? staff.name}
                className="p-3 sm:p-4 md:p-5 bg-white border-2 border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 rounded-2xl group"
              >
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-100">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
                        {staff.name}
                      </p>
                      <p className="text-xs sm:text-sm text-green-600 font-semibold">
                        {Array.isArray(staff.position) &&
                        staff.position.length > 0
                          ? staff.position.map((p) => p.label).join(', ')
                          : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 sm:p-2.5 rounded-lg">
                      <p className="text-xs sm:text-xs text-gray-600 font-semibold">
                        Age
                      </p>
                      <p className="text-sm sm:text-sm md:text-base font-bold text-gray-900">
                        {staff.age ?? '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-2.5 rounded-lg">
                      <p className="text-xs sm:text-xs text-gray-600 font-semibold">
                        Gender
                      </p>
                      <p className="text-sm sm:text-sm md:text-base font-bold text-gray-900">
                        {staff.gender ?? '—'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 sm:p-2.5 rounded-lg">
                    <p className="text-xs sm:text-xs text-gray-600 font-semibold">
                      Email
                    </p>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900 break-all">
                      {!staff.email_address
                        ? 'No Email Provided'
                        : staff.email_address}
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 sm:p-2.5 rounded-lg">
                    <p className="text-xs sm:text-xs text-gray-600 font-semibold">
                      Contact Number
                    </p>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                      {formatContact(staff.contact_number) || 'No Contact Provided'}
                    </p>
                  </div>

                  {staff.skills && staff.skills.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs sm:text-xs text-gray-600 font-semibold mb-2">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {staff.skills.map((s) => (
                          <span
                            key={s._id ?? s.name}
                            className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-semibold"
                          >
                            {s.short ?? s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
