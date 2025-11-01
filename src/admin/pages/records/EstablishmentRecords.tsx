import React, { useState, FormEvent } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Download,
  Search,
  UserRoundPen,
  Package,
  User,
  X,
  Phone,
  MapPin,
  Building2,
} from 'lucide-react';
import useFetchData from '../../hooks/useFetchData';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { createPortal } from 'react-dom';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';

const EstablishmentRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, refetch } = useFetchData(
    '/records?type=establishment'
  );
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    business_name: '',
    business_type: '',
    contact_number: '',
    address: '',
    owner_name: '',
  });

  // Ensure we only show establishment records even if backend returns mixed data
  const records: any[] = Array.isArray(data)
    ? (data as any[]).filter(
        (r: any) =>
          (r.type || r.record_type || '').toLowerCase() === 'establishment'
      )
    : [];

  const openAddModal = () => {
    setForm({
      business_name: '',
      business_type: '',
      contact_number: '',
      address: '',
      owner_name: '',
    });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);

    // Validate required fields
    if (
      !form.business_name.trim() ||
      !form.business_type.trim() ||
      !form.owner_name.trim() ||
      !form.contact_number.trim() ||
      !form.address.trim()
    ) {
      showError('Please fill all required fields.', { title: 'Validation' });
      setIsCreating(false);
      return;
    }

    try {
      const payload = {
        ...form,
        type: 'establishment',
        contact_number: form.contact_number ? `09${form.contact_number}` : '',
      };
      await authFetch('/records', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      success('Establishment record created.', { title: 'Success' });
      setIsAddModalOpen(false);
      refetch && refetch();
    } catch (err: any) {
      showError(err?.message || 'Failed to create record');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <ResponsiveSkeleton page="records" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
          </div>

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6 flex-1">
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Establishment Records
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 font-medium flex items-center flex-wrap gap-2">
                    <span>Manage business information</span>
                    <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                      {records.length}{' '}
                      {records.length === 1 ? 'Record' : 'Records'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                <Button
                  onClick={openAddModal}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base flex items-center justify-center gap-2 rounded-xl font-bold shadow-md hover:shadow-xl transition-all min-h-[44px]"
                >
                  <span className="text-lg sm:text-xl">+</span>
                  <span>Add Establishment</span>
                </Button>

                <Button
                  onClick={() => {
                    // export action placeholder
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-md hover:shadow-xl transition-all hover:scale-105 min-h-[44px]"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Export Excel Report</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="relative w-full">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
            <Input
              type="text"
              placeholder="Search by Record ID or Business Name..."
              className="w-full rounded-xl border-2 border-gray-300 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base bg-gradient-to-r from-white to-gray-50"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Simple listing */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200">
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50">
            <table className="w-full text-xs sm:text-sm min-w-[700px]">
              <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
                <tr>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                    Record ID
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                    Business Type
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {records.length > 0 ? (
                  records.map((r: any, index: number) => (
                    <tr
                      key={r._id || index}
                      className="hover:bg-green-50 transition-colors duration-150"
                    >
                      <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-200">
                          {r.record_id || r._id}
                        </span>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                            {(r.business_name || r.name || '').charAt(0)}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-900">
                            {r.name ||
                              r.business_name ||
                              `${r.firstName || ''} ${r.lastName || ''}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {r.business_type || '-'}
                        </span>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          {r.contact_number || '-'}
                        </span>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <Button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all">
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-2 sm:px-6 py-8 sm:py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm sm:text-base">
                          No records found.
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAddModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && closeAddModal()}
          >
            <form
              onSubmit={handleCreate}
              className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[98vh] flex flex-col animate-slideUp"
            >
              <div className="relative p-4 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                      <Package className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-3xl font-bold text-white mb-0 sm:mb-1">
                        Add Establishment
                      </h3>
                      <p className="text-green-100 text-xs sm:text-sm font-medium">
                        Fill in the details to create a new establishment record
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30"
                    title="Close"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-white">
                {/* Business Information Section */}
                <div className="space-y-3 sm:space-y-5">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
                          type="text"
                          value={form.business_name}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              business_name: e.target.value,
                            }))
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
                          type="text"
                          value={form.business_type}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              business_type: e.target.value,
                            }))
                          }
                          className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                          placeholder="Enter business type"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>Owner Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={form.owner_name}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            owner_name: e.target.value,
                          }))
                        }
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="Enter owner's full name"
                      />
                    </div>
                  </label>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-3 sm:space-y-5">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-800">
                      Contact Information
                    </h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </div>

                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      <span className="text-red-500">*</span>
                      <span>Contact</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold text-sm sm:text-base">
                        09
                      </span>
                      <input
                        required
                        type="text"
                        value={form.contact_number}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          const limited = digitsOnly.slice(0, 9);
                          setForm((s) => ({ ...s, contact_number: limited }));
                        }}
                        className="w-full pl-10 sm:pl-14 border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="9XXXXXXXX"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 sm:mt-2">
                      Contact will be saved as{' '}
                      <span className="font-medium">09XXXXXXXXX</span>. Only
                      numbers allowed. Total digits including prefix will be 11.
                    </div>
                  </label>
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
                      value={form.address}
                      onChange={(value) =>
                        setForm((s) => ({ ...s, address: value }))
                      }
                      placeholder="Enter complete address..."
                      label="Address"
                      className="border-2 border-gray-300 hover:border-gray-400"
                      maxLength={200}
                      countryCode="ph"
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Start typing to see address suggestions. Provide full
                      house number, street, barangay/purok, city or
                      municipality.
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
                      <span className="font-bold">Note:</span> Fields marked
                      with <span className="text-red-500 font-bold">*</span> are
                      required. Please ensure all information is accurate before
                      submitting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 sm:gap-4 p-4 sm:p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <button
                  type="button"
                  onClick={closeAddModal}
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
                      <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Create Establishment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}
    </div>
  );
};

export default EstablishmentRecords;
