import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Users,
  User,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  X,
  MapPin,
} from 'lucide-react';
import { sanitizeName } from '@/utils/validation';
import { useToast } from '@/hooks/useToast';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import useFetchData from '@/admin/hooks/useFetchData';
import { Farm } from './MapDropdown';

interface Skill {
  _id: string;
  name: string;
  short: string;
  type: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchStaff: (fetchUrl?: string) => Promise<any>;
  farmsData: { success: boolean; data: Farm[] } | undefined;
}

const AddStaffModal = ({
  isOpen,
  onClose,
  refetchStaff,
  farmsData
} : AddStaffModalProps ) => {
  const toast = useToast();
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const authFetch = useAuthFetch();
  
  const { data: skillsData, loading: skillsLoading } = useFetchData<{ success: boolean, message: boolean, data: Skill[]}>('/skills');

  const [contactRest, setContactRest] = useState('');
  const [staffForm, setStaffForm] = useState({
    name: '',
    position: '',
    age: '',
    gender: '',
    emailAddress: '',
    contactNumber: '',
    skills: [],
    assignedFarm: [],
  });

  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const staffPayload = {...staffForm, position: staffForm.position.trim().split(',')}
    
    try {
      const result = await authFetch('/staff', {
        method: 'POST',
        body: JSON.stringify(staffPayload),
      });
      toast.success(result.message);
      onClose();
      refetchStaff();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add staff');
    }
    setIsSubmitting(false);
  };

  const handleStaffFormChange = (field: string, value: any) => {
    setStaffForm((prev: any) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Modal Header */}
        <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  Add New Staff Member
                </h3>
                <p className="text-green-100 text-xs sm:text-sm font-medium">
                  Enter staff details below
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <form
          onSubmit={handleSubmitStaff}
          className="overflow-y-auto max-h-[calc(90vh-200px)]"
        >
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-green-100 sm:border-b-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                  Personal Information
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Full Name */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={staffForm.name}
                    onChange={(e) => {
                      const filtered = sanitizeName(e.target.value);
                      handleStaffFormChange('name', filtered);
                    }}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 sm:border-2 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Position */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={staffForm.position}
                    onChange={(e) =>
                      handleStaffFormChange('position', e.target.value)
                    }
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 sm:border-2 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                    placeholder="e.g., Machine Operator"
                    required
                  />
                </div>
              </div>

              {/* Age/Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Age Range
                  </label>
                  <select
                    value={staffForm.age}
                    onChange={(e) =>
                      handleStaffFormChange('age', e.target.value)
                    }
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 sm:border-2 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white text-sm sm:text-base"
                  >
                    <option value="">Select age range</option>
                    <option value="18-25 years old">18-25 years old</option>
                    <option value="26-35 years old">26-35 years old</option>
                    <option value="36-45 years old">36-45 years old</option>
                    <option value="46-55 years old">46-55 years old</option>
                    <option value="Above 55 years old">
                      Above 55 years old
                    </option>
                  </select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Gender
                  </label>
                  <select
                    value={staffForm.gender}
                    onChange={(e) =>
                      handleStaffFormChange('gender', e.target.value)
                    }
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 sm:border-2 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white text-sm sm:text-base"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Skills Checkbox Grid */}
              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  Skills
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 max-h-48 sm:max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                  {skillsData?.data?.map((skill) => (
                    <div
                      key={skill._id}
                      className="flex items-center space-x-2 p-1.5 sm:p-2 hover:bg-white rounded-md transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`skill-${skill._id}`}
                        checked={staffForm.skills?.includes(skill._id) || false}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const updatedSkills = isChecked
                            ? [...(staffForm.skills || []), skill._id]
                            : (staffForm.skills || []).filter(
                                (id) => id !== skill._id
                              );
                          handleStaffFormChange('skills', updatedSkills);
                        }}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`skill-${skill._id}`}
                        className="flex flex-col text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-xs text-gray-500">
                          {skill.type}
                        </span>
                      </label>
                    </div>
                  ))}

                  {skillsData?.data?.length === 0 && (
                    <div className="col-span-2 text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">
                      No skills available
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Farms */}
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  Assigned Farms
                </label>

                <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-48 sm:max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                  {farmsData.data.map((farm) => (
                    <div
                      key={farm._id}
                      className="flex items-center space-x-2 p-1.5 sm:p-2 hover:bg-white rounded-md transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`farm-${farm._id}`}
                        checked={
                          staffForm.assignedFarm?.includes(farm._id) || false
                        }
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const updatedFarms = isChecked
                            ? [...(staffForm.assignedFarm || []), farm._id]
                            : (staffForm.assignedFarm || []).filter(
                                (id) => id !== farm._id
                              );
                          handleStaffFormChange('assignedFarm', updatedFarms);
                        }}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`farm-${farm._id}`}
                        className="flex flex-col text-xs sm:text-sm font-medium text-gray-700 cursor-pointer flex-1"
                      >
                        <span className="font-semibold">{farm.name}</span>
                        <span className="text-xs text-gray-500">
                          {farm.farmType} • {farm.size}
                        </span>
                        <span className="text-xs text-gray-400">
                          {farm.address}
                        </span>
                      </label>
                    </div>
                  ))}

                  {farmsData.data.length === 0 && (
                    <div className="text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">
                      No farms available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-green-100 sm:border-b-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                  Contact Information
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={staffForm.emailAddress}
                    onChange={(e) =>
                      handleStaffFormChange('emailAddress', e.target.value)
                    }
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 sm:border-2 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Contact Number <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold text-sm sm:text-base">
                      09
                    </span>
                    <input
                      type="text"
                      value={contactRest}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '');
                        const limited = digitsOnly.slice(0, 9);
                        setContactRest(limited);
                        handleStaffFormChange(
                          'contactNumber',
                          limited ? `09${limited}` : ''
                        );
                      }}
                      className="w-full pl-10 sm:pl-14 px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 sm:border-2 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium text-sm sm:text-base"
                      placeholder="9XXXXXXXX"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Contact will be saved as{' '}
                    <span className="font-medium">09XXXXXXXXX</span>. Only
                    numbers allowed.
                  </div>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-green-50 border border-green-200 sm:border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-green-800 font-medium">
                  <span className="font-bold">Note:</span> Fields marked with{' '}
                  <span className="text-red-500 font-bold">*</span> are
                  required. Please ensure all information is accurate before
                  submitting.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 sm:border-t-2 flex gap-2 sm:gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-gray-700 bg-white border border-gray-300 sm:border-2 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add Staff</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddStaffModal;
