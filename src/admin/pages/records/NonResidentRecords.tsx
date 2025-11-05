import React, { useState, FormEvent, useMemo, useRef, useEffect } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Search,
  UserRoundPen,
  User,
  X,
  ListFilter,
  Phone,
  Calendar,
  MapPin,
  Users,
  FileText,
  Filter,
} from 'lucide-react';
import ExcelExportButton from '@/components/ui/ExcelExportButton';
import useFetchData from '../../hooks/useFetchData';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { createPortal } from 'react-dom';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { debounce } from 'lodash';
import EditRecordModal from './components/EditRecordModal';
import DeleterecordModal from './components/DeleterecordModal';
import RecordTable from './components/RecordTable';
import { useRBAC } from '../../../hooks/useRBAC';
import { Permission } from '../../../types/rbac.types';
import { ReadOnly } from '../../../components/rbac/Can';

const NonResidentRecords: React.FC = () => {
  const { data, loading, refetch } = useFetchData(
    '/records?residentStatus=non-resident'
  );
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();

  // RBAC: Check if user can manage records
  const { hasPermission } = useRBAC();
  const canManageRecords = hasPermission(Permission.MANAGE_RECORDS);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [originalRecords, setOriginalRecords] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    gender: '',
    age: '',
    contact_number: '',
    address: '',
  });

  // Ensure we only show non-resident records even if backend returns mixed data
  const records: any[] = Array.isArray(data) ? data : [];

  // sorting dropdown state and modes (unique keys). clicking same key toggles asc/desc.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hoverCloseTimeout = useRef<number | null>(null);
  // edit/delete modal state to mirror resident Records behavior
  const [editRecord, setEditRecord] = useState<any | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<any | null>(null);

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

  // search term state (wired to input)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

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

  const loadingTimerRef = useRef<number | null>(null);
  const loadingShownRef = useRef(false);

  const debouncedSearch = React.useCallback(
    debounce(async (query: string) => {
      // start a short timer before showing the loading skeleton to avoid
      // flicker on quick responses while the user types
      if (setSearchLoading) {
        if (loadingTimerRef.current)
          window.clearTimeout(loadingTimerRef.current);
        loadingShownRef.current = false;
        loadingTimerRef.current = window.setTimeout(() => {
          loadingShownRef.current = true;
          setSearchLoading(true);
        }, 250) as unknown as number;
      }

      if (!query) {
        try {
          await (refetch && refetch());
        } finally {
          if (loadingTimerRef.current)
            window.clearTimeout(loadingTimerRef.current);
          if (loadingShownRef.current)
            setSearchLoading && setSearchLoading(false);
          loadingTimerRef.current = null;
          loadingShownRef.current = false;
        }
        return;
      }

      try {
        const result = await refetch(
          `${import.meta.env.VITE_API_URL}/records/search?query=${encodeURIComponent(
            query
          )}&residentStatus=non-resident`
        );
        setOriginalRecords(result || []);
      } catch {
        setOriginalRecords([]);
      } finally {
        if (loadingTimerRef.current)
          window.clearTimeout(loadingTimerRef.current);
        if (loadingShownRef.current)
          setSearchLoading && setSearchLoading(false);
        loadingTimerRef.current = null;
        loadingShownRef.current = false;
      }
    }, 700),
    [refetch]
  );

  // cancel debounce on unmount to avoid async updates after unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel && debouncedSearch.cancel();
      if (loadingTimerRef.current) window.clearTimeout(loadingTimerRef.current);
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchTerm(v);
    debouncedSearch(v);
    setCurrentPage(1);
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

  useEffect(() => {
    // keep a local copy similar to resident Records component (use sorted records)
    // only update local state when the sortedRecords array actually differs
    const arraysEqual = (a: any[], b: any[]) => {
      if (a === b) return true;
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    };

    if (!arraysEqual(originalRecords, sortedRecords)) {
      setOriginalRecords(sortedRecords);
      // reset to first page when records change
      setCurrentPage(1);
    }
  }, [sortedRecords, originalRecords]);

  const recordsPerPage = 10;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const showingRecords = originalRecords.slice(
    startIndex,
    startIndex + recordsPerPage
  );
  const totalPages = Math.ceil(originalRecords.length / recordsPerPage);

  const openAddModal = () => {
    setForm({
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      gender: '',
      age: '',
      contact_number: '',
      address: '',
    });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);

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
      setIsCreating(false);
      return;
    }

    try {
      const payload = {
        ...form,
        type: 'non-resident',
        isResident: false,
        contact_number: form.contact_number ? `09${form.contact_number}` : '',
      };
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

  // Do not early-return on initial loading; render skeleton in-table area so
  // resident/non-resident pages behave similarly (skeleton appears where the
  // table would be). We'll show skeleton when `loading` or `searchLoading`.

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          <ReadOnly message="You have view-only access to Non-Resident Records. Contact a SuperAdmin to add, edit, or delete records." />
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
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      Non-Resident Records
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                      Manage non-resident information
                    </p>

                    {/* Quick Info Pills */}
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>
                          {records.length}{' '}
                          {records.length === 1
                            ? 'Non-Resident'
                            : 'Non-Residents'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Excel Export</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                        <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Search & Sort</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                  {canManageRecords && (
                    <Button
                      onClick={openAddModal}
                      className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base flex items-center justify-center gap-2 rounded-xl font-bold shadow-md hover:shadow-xl transition-all min-h-[44px]"
                    >
                      <span className="text-lg sm:text-xl">+</span>
                      <span>Add Non-Resident</span>
                    </Button>
                  )}

                  <ExcelExportButton
                    records={records || []}
                    recordType="non-resident"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 w-full">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by Record ID or Name..."
                  className="w-full rounded-xl border-2 border-gray-300 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base bg-gradient-to-r from-white to-gray-50"
                  value={searchTerm}
                  onChange={handleSearchChange}
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
                  className="flex items-center gap-2 px-3 py-2.5 sm:py-3 border-2 border-green-200 rounded-xl text-sm sm:text-base text-gray-700 hover:bg-green-50 transition w-36 justify-between bg-gradient-to-r from-white to-green-50/30 shadow-sm hover:shadow-md"
                  title={`Sort: ${currentMode.label} ${currentMode.order === 'asc' ? 'ascending' : 'descending'}`}
                >
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-green-600" />
                    <span className="hidden sm:inline truncate font-semibold">
                      {currentMode.label}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 font-bold">
                    {currentMode.order === 'asc' ? '▲' : '▼'}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border-2 border-green-200 rounded-lg shadow-xl py-1 z-50 text-sm">
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
                        className={`w-full text-left px-2 py-1.5 text-gray-700 hover:bg-green-50 flex items-center justify-between transition-colors ${selectedKey === m.key ? 'bg-green-100 font-semibold' : ''}`}
                      >
                        <span className="truncate">{m.label}</span>
                        <span
                          className={`text-xs ${selectedKey === m.key ? 'text-green-600 font-bold' : 'text-gray-400'}`}
                        >
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
            {searchTerm && (
              <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                Found{' '}
                <span className="font-semibold text-green-600">
                  {originalRecords.length}
                </span>{' '}
                matching records
              </div>
            )}
          </div>

          {/* Table (resident table component to keep behavior consistent) */}
          {loading || searchLoading ? (
            <ResponsiveSkeleton page="records" />
          ) : (
            <RecordTable
              showingRecords={showingRecords}
              setEditRecord={setEditRecord}
              setDeleteRecord={setDeleteRecord}
              startIndex={startIndex}
              recordsPerPage={recordsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              canManageRecords={canManageRecords}
            />
          )}
        </div>
      </div>

      {canManageRecords &&
        isAddModalOpen &&
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
                          type="text"
                          value={form.firstName}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
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
                          value={form.lastName}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, lastName: e.target.value }))
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
                          value={form.middleName}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
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
                          value={form.suffix}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, suffix: e.target.value }))
                          }
                          className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                          placeholder="Suffix (optional)"
                        />
                      </div>
                    </label>
                  </div>

                  {/* Compact: Gender + Age side-by-side */}
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
                          className="w-full h-12 sm:h-12 border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
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
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <span className="text-red-500">*</span>
                        <span>Age</span>
                      </div>
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={form.age}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          const limited = digitsOnly.slice(0, 3);
                          setForm((s) => ({ ...s, age: limited }));
                        }}
                        className="w-full h-12 sm:h-12 border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="0"
                      />
                    </label>
                  </div>
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
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Create Non-Resident</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}
      {/* EDIT & DELETE MODALS (reuse resident components) - Only show if user can manage records */}
      {canManageRecords && (
        <>
          <EditRecordModal
            editRecord={editRecord}
            setEditRecord={setEditRecord}
            setOriginalRecords={setOriginalRecords}
            refetchRecords={refetch}
          />

          <DeleterecordModal
            deleteRecord={deleteRecord}
            setDeleteRecord={setDeleteRecord}
            refetchRecords={refetch}
          />
        </>
      )}
    </>
  );
};

export default NonResidentRecords;
