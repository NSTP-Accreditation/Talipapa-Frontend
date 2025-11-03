import React, { FormEvent, useState } from 'react';
import { Edit, X, Phone, MapPin, Package } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';

type Props = {
  editItem: any | null;
  setEditItem: (v: any | null) => void;
  refetchRecords: (url?: string) => Promise<any>;
};

const EditEstablishmentModal = ({
  editItem,
  setEditItem,
  refetchRecords,
}: Props) => {
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem || isUpdating) return;
    setIsUpdating(true);

    if (
      !editItem.name?.trim() ||
      !editItem.type?.trim() ||
      !editItem.ownerName?.trim()
    ) {
      showError('Name, type and owner are required', { title: 'Validation' });
      setIsUpdating(false);
      return;
    }

    try {
      const payload = {
        name: editItem.name,
        type: editItem.type,
        ownerName: editItem.ownerName,
        contactNumber: editItem.contactNumber
          ? `09${editItem.contactNumber}`
          : '',
        address: editItem.address,
      };

      const res = await authFetch(`/establishment/${editItem._id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      console.log(res);
      
      // refresh
      await refetchRecords();
      setEditItem(null);
      success('Establishment updated', { title: 'Success' });
    } catch (err: any) {
      showError(err?.message || 'Failed to update establishment');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!editItem) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && setEditItem(null)}
    >
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-slideUp"
      >
        {/* Enhanced Header */}
        <div className="relative p-4 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                <Edit className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-white mb-0 sm:mb-1">
                  Edit Establishment
                </h3>
                <p className="text-green-100 text-xs sm:text-sm font-medium">
                  Update establishment information
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditItem(null)}
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
                <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-gray-800">
                Business Information
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <span className="text-red-500">*</span>
                  <span>Business Name</span>
                </div>
                <div className="relative">
                  <input
                    required
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    placeholder="Enter business name"
                  />
                </div>
              </label>

              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <span className="text-red-500">*</span>
                  <span>Business Type</span>
                </div>
                <div className="relative">
                  <input
                    required
                    value={editItem.type}
                    onChange={(e) =>
                      setEditItem({ ...editItem, type: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    placeholder="Enter business type"
                  />
                </div>
              </label>

              <label className="block group">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  <span className="text-red-500">*</span>
                  <span>Owner Name</span>
                </div>
                <div className="relative">
                  <input
                    required
                    value={editItem.ownerName}
                    onChange={(e) =>
                      setEditItem({ ...editItem, ownerName: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    placeholder="Enter owner's full name"
                  />
                </div>
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
                    value={editItem.contactNumber}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        contactNumber: e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 9),
                      })
                    }
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
                value={editItem.address}
                onChange={(value) =>
                  setEditItem({ ...editItem, address: value })
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
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 sm:gap-4 p-4 sm:p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <button
            type="button"
            onClick={() => setEditItem(null)}
            disabled={isUpdating}
            className="px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
          >
            {isUpdating ? (
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
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Update Establishment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default EditEstablishmentModal;
