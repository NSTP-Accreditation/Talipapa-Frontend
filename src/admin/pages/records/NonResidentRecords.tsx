import React, { useState, FormEvent, useMemo, useRef, useEffect } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Download,
  Search,
  UserRoundPen,
  User,
  X,
  ListFilter,
} from 'lucide-react';
import useFetchData from '../../hooks/useFetchData';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { createPortal } from 'react-dom';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';

const NonResidentRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, refetch } = useFetchData('/records?type=non-resident');
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    gender: '',
    contact_number: '',
    address: '',
  });

  // Ensure we only show non-resident records even if backend returns mixed data
  const records: any[] = Array.isArray(data)
    ? (data as any[]).filter(
        (r: any) =>
          (r.type || r.record_type || '').toLowerCase() === 'non-resident'
      )
    : [];

  // sorting dropdown state and modes (unique keys). clicking same key toggles asc/desc.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hoverCloseTimeout = useRef<number | null>(null);

  // Order the filter keys similarly to the main records table where applicable
  const sortKeys = [
    { key: '_id', label: 'Record ID' },
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'points', label: 'Points' },
    { key: 'createdAt', label: 'Created At' },
  ];

  const [selectedKey, setSelectedKey] = useState<string>(sortKeys[0].key);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const currentMode = {
    key: selectedKey,
    label: sortKeys.find((s) => s.key === selectedKey)?.label || 'Sort',
    order,
  };

  const sortRecords = (items: any[]) => {
    const arr = [...items];
    const { key, order } = currentMode;
    const mult = order === 'asc' ? 1 : -1;

    arr.sort((a: any, b: any) => {
      try {
        if (key === 'createdAt') {
          const ta = new Date(a.createdAt || a.created_at || 0).getTime() || 0;
          const tb = new Date(b.createdAt || b.created_at || 0).getTime() || 0;
          return (ta - tb) * mult;
        }
        if (key === '_id') {
          const va = (a.record_id || a._id || '').toString();
          const vb = (b.record_id || b._id || '').toString();
          return va.localeCompare(vb) * mult;
        }
        if (key === 'points') {
          return (Number(a.points || 0) - Number(b.points || 0)) * mult;
        }
        if (key === 'age') {
          return (Number(a.age || 0) - Number(b.age || 0)) * mult;
        }
        if (key === 'name') {
          const na =
            `${a.lastName || a.last_name || ''}, ${a.firstName || a.first_name || a.first || ''}`.toLowerCase();
          const nb =
            `${b.lastName || b.last_name || ''}, ${b.firstName || b.first_name || b.first || ''}`.toLowerCase();
          return na.localeCompare(nb) * mult;
        }
        return 0;
      } catch (err) {
        return 0;
      }
    });

    return arr;
  };

  const sortedRecords = useMemo(
    () => sortRecords(records),
    [records, selectedKey, order]
  );

  const openAddModal = () => {
    setForm({
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      gender: '',
      contact_number: '',
      address: '',
    });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCreating) return;
    // Basic required-field validation
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.middleName?.trim() ||
      !form.gender ||
      !form.contact_number.trim() ||
      !form.address.trim()
    ) {
      showError('Please fill all required fields.', { title: 'Validation' });
      return;
    }
    setIsCreating(true);
    try {
      const payload = { ...form, type: 'non-resident' };
      const res = await authFetch('/records', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      success('Non-resident record created.', { title: 'Success' });
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
    <>
      <div className="p-3 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <UserRoundPen className="w-7 h-7 sm:w-10 sm:h-10 text-green-600" />
              Non Resident Records
            </h1>
            <p className="text-xs sm:text-base text-gray-700 font-medium">
              List of non-resident records
              <span className="ml-2 sm:ml-3 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                {records.length} {records.length === 1 ? 'Record' : 'Records'}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button
              onClick={openAddModal}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm flex items-center justify-center gap-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              + Add Non-Resident
            </Button>

            <Button
              onClick={() => {
                // export action placeholder
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Export Excel Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search by Record ID or Name..."
                className="w-full rounded-xl border-2 border-gray-300 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </div>

            <div
              className="relative"
              ref={menuRef}
              onMouseEnter={() => {
                if (hoverCloseTimeout.current) {
                  window.clearTimeout(hoverCloseTimeout.current);
                  hoverCloseTimeout.current = null;
                }
                setMenuOpen(true);
              }}
              onMouseLeave={() => {
                hoverCloseTimeout.current = window.setTimeout(() => {
                  setMenuOpen(false);
                  hoverCloseTimeout.current = null;
                }, 150);
              }}
            >
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition w-36 justify-between"
                title={`Sort: ${currentMode.label} ${currentMode.order === 'asc' ? 'ascending' : 'descending'}`}
              >
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-gray-600" />
                  <span className="hidden sm:inline truncate">
                    {currentMode.label}
                  </span>
                </div>
                <span className="text-xs">
                  {currentMode.order === 'asc' ? '▲' : '▼'}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-sm">
                  {sortKeys.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => {
                        if (selectedKey === m.key)
                          setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
                        else {
                          setSelectedKey(m.key);
                          setOrder('asc');
                        }
                        // keep menu open after selection per request
                      }}
                      className={`w-full text-left px-2 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center justify-between ${selectedKey === m.key ? 'bg-green-50' : ''}`}
                    >
                      <span className="truncate">{m.label}</span>
                      <span className="text-xs text-gray-500">
                        {selectedKey === m.key
                          ? order === 'asc'
                            ? '▲'
                            : '▼'
                          : '—'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                    Type
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
                            {(
                              r.firstName ||
                              r.first_name ||
                              r.first ||
                              ''
                            ).charAt(0)}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-900">{`${r.firstName || r.first_name || r.first || ''} ${r.lastName || r.last_name || r.last || ''}`}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          Non-Resident
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
            className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
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
                      <User className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-3xl font-bold text-white mb-0 sm:mb-1">
                        Add Non-Resident
                      </h3>
                      <p className="text-green-100 text-xs sm:text-sm font-medium">
                        Fill in the details to create a new record
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
                          value={form.firstName}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              firstName: e.target.value,
                            }))
                          }
                          className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 text-sm sm:text-base"
                          placeholder="First name"
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
                          value={form.middleName}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              middleName: e.target.value,
                            }))
                          }
                          className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 text-sm sm:text-base"
                          placeholder="Middle name"
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
                          value={form.lastName}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, lastName: e.target.value }))
                          }
                          className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 text-sm sm:text-base"
                          placeholder="Last name"
                        />
                      </div>
                    </label>

                    <label className="block group">
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                        <span>Suffix</span>
                      </div>
                      <div className="relative">
                        <input
                          value={form.suffix}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, suffix: e.target.value }))
                          }
                          className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 text-sm sm:text-base"
                          placeholder="Suffix (optional)"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                    <label className="block group">
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                        <span className="text-red-500">*</span>
                        <span>Gender</span>
                      </div>
                      <div className="relative">
                        <select
                          required
                          value={form.gender}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, gender: e.target.value }))
                          }
                          className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 text-sm sm:text-base"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </label>

                    <label className="block group">
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                        <span className="text-red-500">*</span>
                        <span>Contact</span>
                      </div>
                      <div className="relative">
                        <input
                          required
                          value={form.contact_number}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              contact_number: e.target.value,
                            }))
                          }
                          className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 text-sm sm:text-base"
                          placeholder="Contact number"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>Address</span>
                    </div>
                    <AddressAutocomplete
                      required
                      value={form.address}
                      onChange={(value) =>
                        setForm((s) => ({ ...s, address: value }))
                      }
                      placeholder="Enter complete address..."
                      className="border-2 border-gray-300"
                      maxLength={200}
                      countryCode="ph"
                    />
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
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}
    </>
  );
};

export default NonResidentRecords;
