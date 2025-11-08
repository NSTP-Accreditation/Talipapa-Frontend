import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { Users, Leaf } from 'lucide-react';
import { Farm } from './MapDropdown';
import useFetchData from '@/admin/hooks/useFetchData';
import AddStaffModal from './AddStaffModal';

interface Skill {
  _id: string;
  name: string;
  short?: string;
  type?: string;
}

interface Staff {
  _id?: string;
  name: string;
  age?: string;
  gender?: string;
  emailAddress?: string;
  position: string[];
  skills: Skill[];
  contactNumber?: string;
}

interface StaffTabProps {
  farmsData: { success: boolean; data: Farm[] } | undefined;
  selectedFarm: Farm | null;
}

const StaffTab = ({ farmsData, selectedFarm }: StaffTabProps) => {
  if (!selectedFarm) return <p>No farm selected</p>;

  const [openAddStaffModal, setOpenAddStaffModal] = useState(false);

  const {
    data: staffData,
    loading: staffLoading,
    error: staffError,
    refetch: refetchStaff,
  } = useFetchData<{ success: boolean, message: string, data: Staff[]}>(`/staff/farm/${selectedFarm._id}`);
  
  if(staffLoading) {
    return <p>Loading Staff</p>
  }

  if(!staffData && staffError) {
    return <p>Failed to fetch staff members.</p>
  }

  if(!staffData) return;

  return (
    <>
      <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-sm sm:text-lg md:text-xl">
                Staff Directory
              </span>
            </CardTitle>
            <button
              onClick={() => setOpenAddStaffModal(true)}
              className="bg-white text-green-700 hover:bg-green-50 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-xl font-bold shadow-lg text-xs sm:text-sm md:text-base transition-all hover:shadow-xl hover:scale-105 flex items-center gap-1 sm:gap-2"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Staff</span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 md:p-5 lg:p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar max-h-[calc(100vh-16rem)] sm:max-h-[calc(100vh-18rem)] lg:max-h-[740px]">
            {Array.isArray(staffData?.data) && staffData?.data.length === 0 && (
              <div className="p-4 sm:p-6 text-center text-xs sm:text-sm text-gray-500">
                No staff found for this farm.
              </div>
            )}

            {Array.isArray(staffData?.data) &&
              staffData?.data.map((staff, i) => (
                <Card
                  key={staff._id}
                  className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 rounded-xl sm:rounded-2xl group"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-3 pb-2 sm:pb-3 border-b-2 border-gray-100 group-hover:border-green-100">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl shadow-md group-hover:scale-110 transition-transform">
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
                          {staff.name}
                        </p>
                        <p className="text-xs sm:text-sm text-green-600 font-semibold truncate">
                          {Array.isArray(staff.position) &&
                          staff.position.length > 0
                            ? staff.position.join(', ')
                            : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                        <p className="text-xs text-gray-600 font-semibold mb-1">
                          Age
                        </p>
                        <p className="text-sm sm:text-base font-bold text-gray-900">
                          {staff.age ?? '—'}
                        </p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                        <p className="text-xs text-gray-600 font-semibold mb-1">
                          Gender
                        </p>
                        <p className="text-sm sm:text-base font-bold text-gray-900">
                          {staff.gender ?? '—'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50/80 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                      <p className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Email
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900 break-all">
                        {!staff.emailAddress
                          ? 'No Email Provided'
                          : staff.emailAddress}
                      </p>
                    </div>
                    <div className="bg-green-50/80 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                      <p className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Contact Number
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        {staff.contactNumber} || 'No Contact Provided'
                      </p>
                    </div>

                    {staff.skills && staff.skills.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-600 font-semibold mb-2 flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-green-600" />
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {staff.skills.map((s, index) => (
                            <span
                              key={s._id || `skill-${index}`}
                              className="px-2 sm:px-2.5 py-1 rounded-lg bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-bold border border-green-300 hover:shadow-sm transition-shadow"
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

      <AddStaffModal
        isOpen={openAddStaffModal}
        onClose={() => setOpenAddStaffModal(false)}
        refetchStaff={refetchStaff}
        farmsData={farmsData}
        // onSubmit={handleSubmitStaff}
        // staffForm={staffForm}
        // handleStaffFormChange={handleStaffFormChange}
        // contactRest={contactRest}
        // setContactRest={setContactRest}
        // skillsData={skillsData?.data || []}
        // farmsData={farmsData?.data || []}
        // isSubmitting={isSubmitting}
      />
    </>
  );
};

export default StaffTab;
