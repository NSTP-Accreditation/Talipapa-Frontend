import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { Award, Calendar, MapPin, Phone, User, X } from 'lucide-react';
import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { createPortal } from 'react-dom';
import { RecordInterface } from '@/types/global.types';
import { validateAddress } from '@/utils/validation';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { PaginatedResponse } from '@/types/pagination';

type AddRecordModalType = {
  openAddRecordModal: boolean;
  setOpenAddRecordModal: Dispatch<SetStateAction<boolean>>;
  refetchRecords: (fetchUrl?: string) => Promise<PaginatedResponse<RecordInterface>>;
};

const AddRecordModal = ({
  openAddRecordModal,
  setOpenAddRecordModal,
  refetchRecords,
}: AddRecordModalType) => {
  const authFetch = useAuthFetch();

  const [isCreating, setIsCreating] = useState(false);
  const [newRecord, setNewRecord] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    gender: '',
    points: 0,
    age: '',
    contactNumber: '',
    address: '',
  });

  const { success, error: showError } = useToast();

  const handleCreateResident = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreating) {
      return;
    }

    setIsCreating(true);

    // Validate required fields
    if (!newRecord.firstName || !newRecord.lastName || !newRecord.middleName) {
      showError('First name, last name, and middle name are required.', {
        title: 'Validation',
      });
      setIsCreating(false);
      return;
    }

    // Validate age
    const ageNum = parseInt(newRecord.age);
    if (isNaN(ageNum) || ageNum > 120 || ageNum < 1) {
      showError('Please enter a valid age (0-120).', { title: 'Validation' });
      setIsCreating(false);
      return;
    }

    const addressValidation = validateAddress(newRecord.address || '');
    if (!addressValidation.valid) {
      showError(addressValidation.message, { title: 'Address Validation' });
      setIsCreating(false);
      return;
    }

    try {
      const payload = {
        ...newRecord,
        age: ageNum,
        contactNumber: newRecord.contactNumber
          ? `09${newRecord.contactNumber}`
          : '',
        isResident: true,
        type: 'resident',
      };

      const data = await authFetch('/records', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      await refetchRecords();
      setOpenAddRecordModal(false);
      setNewRecord({
        firstName: '',
        lastName: '',
        middleName: '',
        suffix: '',
        gender: '',
        points: 0,
        age: '',
        contactNumber: '',
        address: '',
      });
      success(`New Record Created! ID: ${data.record_id}`, {
        title: 'Record Created',
      });
    } catch (error: any) {
      showError(
        error?.message || 'Failed to create record. Please try again.',
        {
          title: 'Error',
        }
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!openAddRecordModal) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpenAddRecordModal(false);
      }}
    >
      <form
        onSubmit={handleCreateResident}
        className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-slideUp"
      >
        {/* Enhanced Header */}
        <div className="relative p-4 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                <User className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-white mb-0 sm:mb-1">
                  Add New Resident
                </h3>
                <p className="text-green-100 text-xs sm:text-sm font-medium">
                  Fill in the details to create a new record
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpenAddRecordModal(false)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-white">
          <div className="space-y-3 sm:space-y-5">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-800">
                Personal Information
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-5">
              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <span className="text-red-500">*</span>
                  <span>First Name</span>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={newRecord.firstName}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    placeholder="Enter first name"
                  />
                </div>
              </label>

              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <span className="text-red-500">*</span>
                  <span>Last Name</span>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={newRecord.lastName}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    placeholder="Enter last name"
                  />
                </div>
              </label>

              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <span className="text-red-500">*</span>
                  <span>Middle Name</span>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={newRecord.middleName}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        middleName: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    placeholder="If none put None"
                  />
                </div>
              </label>

              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <span>Suffix</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={newRecord.suffix}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        suffix: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    placeholder="Suffix (optional)"
                  />
                </div>
              </label>

              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <span className="text-red-500">*</span>
                  <span>Gender</span>
                </div>
                <div className="relative">
                  <select
                    required
                    value={newRecord.gender}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </label>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="space-y-3 sm:space-y-5">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-800">
                Additional Details
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-red-500">*</span>
                  <span>Age</span>
                </div>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={newRecord.age}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    const limited = digitsOnly.slice(0, 3);
                    setNewRecord((prev) => ({ ...prev, age: limited }));
                  }}
                  className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                  placeholder="0"
                />
              </label>

              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span>Contact</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold text-sm sm:text-base">
                    09
                  </span>
                  <input
                    type="text"
                    value={newRecord.contactNumber}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '');
                      const limited = digitsOnly.slice(0, 9);
                      setNewRecord((prev) => ({
                        ...prev,
                        contactNumber: limited,
                      }));
                    }}
                    className="w-full pl-10 sm:pl-14 border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    placeholder="9XXXXXXXX"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 sm:mt-2">
                  Contact will be saved as{' '}
                  <span className="font-medium">09XXXXXXXXX</span>. Only numbers
                  allowed. Total digits including prefix will be 11.
                </div>
              </label>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-3 sm:space-y-5">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-800">
                Location
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>

            <div className="block group">
              <AddressAutocomplete
                value={newRecord.address}
                onChange={(value) =>
                  setNewRecord((prev) => ({ ...prev, address: value }))
                }
                placeholder="Enter complete address..."
                label="Address"
                className="border-2 border-gray-300 hover:border-gray-400"
                maxLength={200}
                countryCode="ph"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                Start typing to see address suggestions. Provide full house
                number, street, barangay/purok, city or municipality.
              </p>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-green-800 font-medium">
                <span className="font-bold">Note:</span> Fields marked with{' '}
                <span className="text-red-500 font-bold">*</span> are required.
                Please ensure all information is accurate before submitting.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="flex justify-end gap-2 sm:gap-4 p-4 sm:p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <button
            type="button"
            onClick={() => setOpenAddRecordModal(false)}
            disabled={isCreating}
            className="px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
          >
            {isCreating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Resident</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default AddRecordModal;
