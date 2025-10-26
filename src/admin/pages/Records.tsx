import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Download,
  Search,
  User,
  Phone,
  MapPin,
  Calendar,
  Award,
  X,
  UserRoundPen,
  Edit,
  Trash2,
} from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { useToast } from '@/hooks/useToast';
import { debounce } from 'lodash';
import { ResponsiveSkeleton } from '../../components/ResponsiveSkeleton';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuth } from '@/contexts/AuthContext';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Heuristic address validator: not perfect, but rejects obvious gibberish.
// Rules applied:
// - Minimum length (10 chars)
// - Must contain at least one number (house/building number) OR common address keywords
// - Must contain at least two words (to avoid single-word gibberish)
// - Must not be mostly repeated characters or single-letter words
const validateAddress = (address: string) => {
  const clean = (address || '').trim();
  if (!clean) return { valid: false, message: 'Address is required.' };

  if (clean.length < 10) {
    return { valid: false, message: 'Address is too short.' };
  }

  // Reject if it looks like random characters, e.g., 'asdasdasd' or 'qweqwe'
  const repeatedPattern = /(\w)\1{4,}/i; // same character 5+ times
  if (repeatedPattern.test(clean.replace(/\s+/g, ''))) {
    return { valid: false, message: 'Address looks invalid.' };
  }

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return { valid: false, message: 'Please provide a more specific address.' };
  }

  const hasNumber = /\d/.test(clean);
  const commonKeywords =
    /street|st\.?|road|rd\.?|avenue|ave\.?|lane|ln\.?|boulevard|blvd\.?|drive|dr\.?|block|brgy|barangay|purok|compound|subdivision|subd\.?|sitio|zone|city|municipal|province|town|street/gi;

  if (!hasNumber && !commonKeywords.test(clean)) {
    // If no digits and no address keywords, likely not a real address
    return {
      valid: false,
      message:
        'Address should include a house number or a common address term (street, barangay, city, etc.).',
    };
  }

  // Reject if most tokens are single letters (e.g., 'a b c')
  const singleLetterTokens = words.filter((w) => w.length === 1).length;
  if (singleLetterTokens >= Math.ceil(words.length / 2)) {
    return { valid: false, message: 'Address looks invalid.' };
  }

  // Basic pass
  return { valid: true, message: '' };
};

const ResidentRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [records, setRecords] = useState<any[]>([]); // Explicitly type as array
  const authFetch = useAuthFetch();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetchData('/records');
  const { success, error: showError } = useToast();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query) {
        setRecords(data || []); // Ensure array
        return;
      }

      const fetchSearch = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/records/search?query=${query}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${user?.accessToken}`,
              },
              credentials: 'include',
            }
          );

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message);
          }
          setRecords(result?.results || []); // Ensure array
        } catch (error) {
          console.log(error);
          setRecords([]); // Set to empty array on error
        }
      };
      fetchSearch();
    }, 700),
    [data, user?.accessToken]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
    setCurrentPage(1);
  };

  const [isCreating, setIsCreating] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newResident, setNewResident] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    points: 0,
    age: '',
    contact_number: '',
    address: '',
  });
  // Name validation state
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [middleNameError, setMiddleNameError] = useState('');
  const [areNamesValid, setAreNamesValid] = useState(false);
  // Age validation state
  const [ageError, setAgeError] = useState('');
  const [isAgeValid, setIsAgeValid] = useState(false);
  // Address validation state
  const [addressError, setAddressError] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(false);
  // Keep only the editable part of the contact (suffix). The fixed prefix will be '09'.
  // Editable part is up to 9 digits so total length becomes 11 (09 + 9 digits).
  const [contactRest, setContactRest] = useState('');
  // Editable part for record ID. Fixed prefix will be 'BT-'. This stores the rest (e.g. '0001').
  const [recordIdRest, setRecordIdRest] = useState('');

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editContactRest, setEditContactRest] = useState('');
  const [editFirstNameError, setEditFirstNameError] = useState('');
  const [editLastNameError, setEditLastNameError] = useState('');
  const [editMiddleNameError, setEditMiddleNameError] = useState('');
  const [editAreNamesValid, setEditAreNamesValid] = useState(false);
  const [editAgeError, setEditAgeError] = useState('');
  const [editIsAgeValid, setEditIsAgeValid] = useState(false);
  const [editAddressError, setEditAddressError] = useState('');
  const [editIsAddressValid, setEditIsAddressValid] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingResident, setDeletingResident] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => {
    setNewResident({
      firstName: '',
      lastName: '',
      middleName: '',
      points: 0,
      age: '',
      address: '',
      contact_number: '',
    });
    setContactRest('');
    setRecordIdRest('');
    setFirstNameError('');
    setLastNameError('');
    setMiddleNameError('');
    setAgeError('');
    setIsAgeValid(false);
    setAreNamesValid(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (resident: any) => {
    setEditingResident({
      ...resident,
      age: String(resident.age || ''),
    });
    // Extract the contact rest (remove '09' prefix if present)
    const contact = resident.contact_number || '';
    setEditContactRest(contact.startsWith('09') ? contact.slice(2) : contact);
    setEditFirstNameError('');
    setEditLastNameError('');
    setEditMiddleNameError('');
    setEditAgeError('');
    setEditIsAgeValid(true);
    setEditAreNamesValid(true);
    setEditAddressError('');
    setEditIsAddressValid(true);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (resident: any) => {
    setDeletingResident(resident);
    setIsDeleteModalOpen(true);
  };

  // Validate name using Unicode letter class, allowing spaces, apostrophes and hyphens
  const validateName = (value: string, required = false) => {
    const v = (value || '').trim();
    if (required && v === '') {
      return { valid: false, message: 'This field is required.' };
    }
    if (v === '') return { valid: true, message: '' };
    // allow letters (unicode), spaces, apostrophes and hyphens
    const nameRegex = /^[\p{L}\s'\-]+$/u;
    if (!nameRegex.test(v)) {
      return {
        valid: false,
        message:
          'Only alphabetic characters, spaces, hyphens or apostrophes are allowed.',
      };
    }
    // simple length guard
    if (v.length > 80) {
      return { valid: false, message: 'Name is too long.' };
    }
    return { valid: true, message: '' };
  };

  const handleCreateResident = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreating) {
      return;
    }

    setIsCreating(true);

    if (!isAgeValid) {
      showError('Please enter a valid age (0-120).', { title: 'Validation' });
      setIsCreating(false);
      return;
    }

    // Validate names before submitting
    if (!areNamesValid) {
      showError('Please correct the name fields before submitting.', {
        title: 'Validation',
      });
      setIsCreating(false);
      return;
    }

    // Validate address before submitting
    const addressValidation = validateAddress(newResident.address || '');
    if (!addressValidation.valid) {
      setAddressError(addressValidation.message);
      setIsCreating(false);
      showError('Please enter a valid address. ' + addressValidation.message, {
        title: 'Validation',
      });
      return;
    }

    try {
      // Compose full contact with fixed '09' prefix. We assume the desired total length
      // including the prefix is 11 digits (so contactRest is max 9 digits). If contactRest
      // is empty, we'll send an empty string for contact.
      // Convert age to number for backend
      const ageNumber = Number(newResident.age);
      const payload = {
        ...newResident,
        age: isNaN(ageNumber) ? 0 : ageNumber,
        contact_number: contactRest ? `09${contactRest}` : '',
        // include the full record id with BT- prefix when provided
        ...(recordIdRest ? { record_id: `BT-${recordIdRest}` } : {}),
      };

      const data = await authFetch('/records', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      refetch();
      setIsAddModalOpen(false);
      success(`New Record Created! ID: ${data.record_id}`, {
        title: 'Record Created',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateResident = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    if (!editIsAgeValid) {
      showError('Please enter a valid age (0-120).', { title: 'Validation' });
      setIsUpdating(false);
      return;
    }

    if (!editAreNamesValid) {
      showError('Please correct the name fields before submitting.', {
        title: 'Validation',
      });
      setIsUpdating(false);
      return;
    }

    const addressValidation = validateAddress(editingResident.address || '');
    if (!addressValidation.valid) {
      setEditAddressError(addressValidation.message);
      setIsUpdating(false);
      showError('Please enter a valid address. ' + addressValidation.message, {
        title: 'Validation',
      });
      return;
    }

    try {
      const ageNumber = Number(editingResident.age);
      const payload = {
        ...editingResident,
        age: isNaN(ageNumber) ? 0 : ageNumber,
        contact_number: editContactRest ? `09${editContactRest}` : '',
      };

      console.log(payload);

      await authFetch(`/records/${editingResident._id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      refetch();
      setIsEditModalOpen(false);
      success(`Record Updated! ID: ${editingResident._id}`, {
        title: 'Record Updated',
      });
    } catch (error) {
      console.log(error);
      showError('Failed to update record.', { title: 'Error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteResident = async () => {
    if (isDeleting || !deletingResident) {
      return;
    }

    setIsDeleting(true);

    try {
      await authFetch(`/records/${deletingResident._id}`, {
        method: 'DELETE',
      });

      refetch();
      setIsDeleteModalOpen(false);
      success(`Record Deleted! ID: ${deletingResident._id}`, {
        title: 'Record Deleted',
      });
    } catch (error) {
      console.log(error);
      showError('Failed to delete record.', { title: 'Error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  useEffect(() => {
    if (data && !loading && !error) {
      const recordsArray = Array.isArray(data) ? data : [];
      setRecords(recordsArray);
    }
  }, [data, loading, error]);

  // Live-validate address whenever it changes
  useEffect(() => {
    const res = validateAddress(newResident.address || '');
    setAddressError(res.valid ? '' : res.message);
    setIsAddressValid(res.valid);
  }, [newResident.address]);

  // Validate name fields whenever they change
  useEffect(() => {
    const f = validateName(newResident.firstName, true);
    const l = validateName(newResident.lastName, true);
    const m = validateName(newResident.middleName, false);
    setFirstNameError(f.valid ? '' : f.message);
    setLastNameError(l.valid ? '' : l.message);
    setMiddleNameError(m.valid ? '' : m.message);
    setAreNamesValid(f.valid && l.valid && m.valid);
  }, [newResident.firstName, newResident.lastName, newResident.middleName]);

  // Validate age whenever it changes
  useEffect(() => {
    const v = String(newResident.age || '').trim();
    const n = v === '' ? NaN : Number(v);
    if (v === '') {
      setIsAgeValid(false);
      setAgeError('Age is required.');
    } else if (isNaN(n) || n < 0 || n > 120) {
      setIsAgeValid(false);
      setAgeError('Enter a valid age between 0 and 120.');
    } else {
      setIsAgeValid(true);
      setAgeError('');
    }
  }, [newResident.age]);

  // Validation for edit modal
  useEffect(() => {
    if (!editingResident) return;
    const res = validateAddress(editingResident.address || '');
    setEditAddressError(res.valid ? '' : res.message);
    setEditIsAddressValid(res.valid);
  }, [editingResident?.address]);

  useEffect(() => {
    if (!editingResident) return;
    const f = validateName(editingResident.firstName, true);
    const l = validateName(editingResident.lastName, true);
    const m = validateName(editingResident.middleName, false);
    setEditFirstNameError(f.valid ? '' : f.message);
    setEditLastNameError(l.valid ? '' : l.message);
    setEditMiddleNameError(m.valid ? '' : m.message);
    setEditAreNamesValid(f.valid && l.valid && m.valid);
  }, [
    editingResident?.firstName,
    editingResident?.lastName,
    editingResident?.middleName,
  ]);

  useEffect(() => {
    if (!editingResident) return;
    const v = String(editingResident.age || '').trim();
    const n = v === '' ? NaN : Number(v);
    if (v === '') {
      setEditIsAgeValid(false);
      setEditAgeError('Age is required.');
    } else if (isNaN(n) || n < 0 || n > 120) {
      setEditIsAgeValid(false);
      setEditAgeError('Enter a valid age between 0 and 120.');
    } else {
      setEditIsAgeValid(true);
      setEditAgeError('');
    }
  }, [editingResident?.age]);

  // Fixed Pagination logic with null checks
  const safeRecords = records || []; // This ensures we always have an array
  const totalPages = Math.ceil(safeRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentResidents = safeRecords.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // --- EXPORT TO EXCEL FUNCTIONALITY ---
  const handleExportToExcel = async () => {
    if (!records || records.length === 0) {
      showError('No records available to export.', { title: 'Export' });
      return;
    }

    // --- Create Workbook & Sheets ---
    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Resident Summary');
    const recordsSheet = workbook.addWorksheet('Resident Records');
    const rawDataSheet = workbook.addWorksheet('Raw Data'); // ✅ New sheet

    // --- SUMMARY CALCULATIONS ---
    const totalResidents = records.length;
    const totalPoints = records.reduce((sum, r) => sum + (r.points || 0), 0);
    const avgAge = (
      records.reduce((sum, r) => sum + (Number(r.age) || 0), 0) / totalResidents
    ).toFixed(1);

    const ageGroups = { '0–17': 0, '18–35': 0, '36–59': 0, '60+': 0 };
    records.forEach((r) => {
      const age = Number(r.age);
      if (age <= 17) ageGroups['0–17']++;
      else if (age <= 35) ageGroups['18–35']++;
      else if (age <= 59) ageGroups['36–59']++;
      else ageGroups['60+']++;
    });

    // --- HEADER ---
    summarySheet.mergeCells('A1', 'C1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = '🏛️ Resident Crystallized Report';
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2E7D32' },
    };
    summarySheet.getRow(1).height = 35;

    // --- KEY METRICS ---
    const metrics = [
      ['Total Residents', totalResidents],
      ['Average Age', avgAge],
      ['Total Points', totalPoints],
    ];
    summarySheet.addRows([[], ...metrics, [], ['Age Group', 'Count']]);
    Object.entries(ageGroups).forEach(([group, count]) => {
      summarySheet.addRow([group, count]);
    });

    // Styling summary
    summarySheet.columns = [{ width: 20 }, { width: 20 }, { width: 20 }];
    summarySheet.eachRow((row, rowNumber) => {
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.font = { name: 'Calibri', size: 12 };
      if (rowNumber > 2 && rowNumber < 6) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });

    // --- BAR CHART (Age Group Distribution) ---
    const chartStartRow = 9;
    const chartData: (string | number)[][] = [['Age Group', 'Count']];
    Object.entries(ageGroups).forEach(([key, val]) =>
      chartData.push([key, val])
    );
    summarySheet.addRows([[], ...chartData]);

    // Simulated visual bar chart
    let rowIndex = chartStartRow + 1;
    for (const [group, count] of Object.entries(ageGroups)) {
      const row = summarySheet.getRow(rowIndex);
      const barLength = Math.floor((count / totalResidents) * 30);
      const bar = '█'.repeat(barLength);
      row.getCell(3).value = bar;
      row.getCell(3).font = { color: { argb: 'FF2E7D32' } };
      rowIndex++;
    }

    // --- RECORDS SHEET ---
    recordsSheet.columns = [
      { header: '#', key: 'num', width: 5 },
      { header: 'Record ID', key: 'record_id', width: 20 },
      { header: 'Full Name', key: 'name', width: 25 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Points', key: 'points', width: 10 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    records.forEach((r, i) => {
      recordsSheet.addRow({
        num: i + 1,
        record_id: r._id,
        name: `${r.firstName} ${r.middleName ? r.middleName + ' ' : ''}${r.lastName}`,
        age: r.age,
        points: r.points,
        address: r.address,
        createdAt: dayjs(r.createdAt).format('YYYY-MM-DD | h:mm:ss A'),
      });
    });

    // Style header row
    const headerRow = recordsSheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF43A047' },
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    // Border all cells
    recordsSheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // --- RAW DATA SHEET ---
    const rawHeaderStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00796B' },
      },
      alignment: { horizontal: 'center', vertical: 'middle' },
    };

    const allKeys = Object.keys(records[0] || {});
    rawDataSheet.columns = allKeys.map((key) => ({
      header: key,
      key,
      width: 25,
    }));
    records.forEach((r) => rawDataSheet.addRow(r));

    const rawHeaderRow = rawDataSheet.getRow(1);
    rawHeaderRow.eachCell((cell: ExcelJS.Cell) => {
      cell.font = rawHeaderStyle.font as ExcelJS.Font;
      cell.fill = rawHeaderStyle.fill as ExcelJS.Fill;
      cell.alignment = rawHeaderStyle.alignment as ExcelJS.Alignment;
    });

    // Optional: add a small timestamp note
    const timestampRow = rawDataSheet.addRow([]);
    rawDataSheet.addRow(['Generated on:', new Date().toLocaleString()]).font = {
      italic: true,
      color: { argb: 'FF555555' },
    };

    // --- EXPORT FILE ---
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'Resident_Crystallized_Report.xlsx');
  };
  // end of handleExportToExcel

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Show loading skeleton while loading (responsive)
  if (loading) {
    return <ResponsiveSkeleton page="records" />;
  }

  // Update all references to use safeRecords instead of records
  return (
    <div className="p-3 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-4 sm:space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <UserRoundPen className="w-7 h-7 sm:w-10 sm:h-10 text-green-600" />
            Resident Records
          </h1>
          <p className="text-xs sm:text-base text-gray-700 font-medium">
            List of the resident records created
            <span className="ml-2 sm:ml-3 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
              {safeRecords.length}{' '}
              {safeRecords.length === 1 ? 'Record' : 'Records'}
            </span>
          </p>
        </div>

        {/* Right side: Add Residents and Download button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button
            onClick={openAddModal}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm flex items-center justify-center gap-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            + Add Residents
          </Button>

          <Button
            onClick={handleExportToExcel}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Export Excel Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 mb-4 sm:mb-8">
        <div className="relative w-full">
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by Record ID or Name..."
            className="w-full rounded-xl border-2 border-gray-300 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
        {searchTerm && (
          <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
            Found{' '}
            <span className="font-semibold text-green-600">
              {safeRecords.length}
            </span>{' '}
            matching records
          </div>
        )}
      </div>

      {/* Enhanced Table */}
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
                  Age
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentResidents.length > 0 ? (
                currentResidents.map((resident, index) => (
                  <tr
                    key={index}
                    className="hover:bg-green-50 transition-colors duration-150"
                  >
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-200">
                        {resident?._id}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                          {resident?.firstName?.charAt(0)}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {resident?.firstName} {resident?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`text-xs sm:text-sm font-semibold text-gray-900`}
                      >
                        {resident?.age}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-lg sm:text-2xl">⭐</span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {resident?.points}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-gray-400">📍</span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium max-w-[150px] sm:max-w-none truncate sm:whitespace-normal">
                          {resident?.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-gray-400">📅</span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          <span className="hidden sm:inline">
                            {dayjs(resident?.createdAt).format(
                              'YYYY-MM-DD | h:mm:ss A'
                            )}
                          </span>
                          <span className="sm:hidden">
                            {dayjs(resident?.createdAt).format('MM/DD/YY')}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => openEditModal(resident)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          onClick={() => openDeleteModal(resident)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
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
          <div className="block sm:hidden text-xs text-gray-400 mt-2 p-2 text-center">
            Swipe left/right to see more columns
          </div>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-gray-600 font-medium text-center sm:text-left">
          Showing{' '}
          <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
          <span className="font-bold text-gray-900">
            {Math.min(startIndex + recordsPerPage, safeRecords.length)}
          </span>{' '}
          of{' '}
          <span className="font-bold text-gray-900">{safeRecords.length}</span>{' '}
          records
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-green-50 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            ← <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-100 border-2 border-green-300 rounded-lg">
            <span className="text-xs sm:text-sm font-bold text-green-800">
              {currentPage} / {totalPages || 1}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-green-50 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Next</span> →
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAddModal();
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
                  onClick={closeAddModal}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Enhanced Form Content */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-white">
              {/* Personal Information Section */}
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

                {/* Name fields in a row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                  {/* First Name */}
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>First Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={newResident.firstName}
                        onChange={(e) => {
                          // strip disallowed characters (allow letters, spaces, apostrophes, hyphens)
                          const filtered = e.target.value.replace(
                            /[^\p{L}\s'\-]/gu,
                            ''
                          );
                          setNewResident((s) => ({
                            ...s,
                            firstName: filtered,
                          }));
                          const res = validateName(filtered, true);
                          setFirstNameError(res.valid ? '' : res.message);
                        }}
                        onBlur={() => {
                          const res = validateName(newResident.firstName, true);
                          setFirstNameError(res.valid ? '' : res.message);
                        }}
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="Enter first name"
                      />
                      {firstNameError ? (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">
                          {firstNameError}
                        </p>
                      ) : null}
                    </div>
                  </label>
                  {/* Last Name */}
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>Last Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={newResident.lastName}
                        onChange={(e) => {
                          const filtered = e.target.value.replace(
                            /[^\p{L}\s'\-]/gu,
                            ''
                          );
                          setNewResident((s) => ({ ...s, lastName: filtered }));
                          const res = validateName(filtered, true);
                          setLastNameError(res.valid ? '' : res.message);
                        }}
                        onBlur={() => {
                          const res = validateName(newResident.lastName, true);
                          setLastNameError(res.valid ? '' : res.message);
                        }}
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="Enter last name"
                      />
                      {lastNameError ? (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">
                          {lastNameError}
                        </p>
                      ) : null}
                    </div>
                  </label>
                  {/* Middle Name (now required) */}
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>Middle Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={newResident.middleName}
                        onChange={(e) => {
                          const filtered = e.target.value.replace(
                            /[^\p{L}\s'\-]/gu,
                            ''
                          );
                          setNewResident((s) => ({
                            ...s,
                            middleName: filtered,
                          }));
                          const res = validateName(filtered, true);
                          setMiddleNameError(res.valid ? '' : res.message);
                        }}
                        onBlur={() => {
                          const res = validateName(
                            newResident.middleName,
                            true
                          );
                          setMiddleNameError(res.valid ? '' : res.message);
                        }}
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="If none put None"
                      />
                      {middleNameError ? (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">
                          {middleNameError}
                        </p>
                      ) : null}
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
                      value={newResident.age as string}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '');
                        const limited = digitsOnly.slice(0, 3);
                        setNewResident((s) => ({ ...s, age: limited }));
                        // validate age (0-120)
                        const n = limited === '' ? NaN : Number(limited);
                        if (limited === '') {
                          setIsAgeValid(false);
                          setAgeError('Age is required.');
                        } else if (isNaN(n) || n < 0 || n > 120) {
                          setIsAgeValid(false);
                          setAgeError('Enter a valid age between 0 and 120.');
                        } else {
                          setIsAgeValid(true);
                          setAgeError('');
                        }
                      }}
                      onBlur={() => {
                        const v = String(newResident.age || '').trim();
                        const n = v === '' ? NaN : Number(v);
                        if (v === '') {
                          setIsAgeValid(false);
                          setAgeError('Age is required.');
                        } else if (isNaN(n) || n < 0 || n > 120) {
                          setIsAgeValid(false);
                          setAgeError('Enter a valid age between 0 and 120.');
                        } else {
                          setIsAgeValid(true);
                          setAgeError('');
                        }
                      }}
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                      placeholder="0"
                    />
                    {ageError ? (
                      <p className="text-xs sm:text-sm text-red-600 mt-1">
                        {ageError}
                      </p>
                    ) : null}
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
                        value={contactRest}
                        onChange={(e) => {
                          // Allow digits only, remove non-digits, and limit to 9 digits (since 09 + 9 = 11)
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          const limited = digitsOnly.slice(0, 9);
                          setContactRest(limited);
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

                <label className="block group">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>Address</span>
                  </div>
                  <textarea
                    rows={3}
                    value={newResident.address}
                    onChange={(e) =>
                      setNewResident((s) => ({ ...s, address: e.target.value }))
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 resize-none text-sm sm:text-base"
                    placeholder="Enter complete address..."
                  />
                  {addressError ? (
                    <p className="text-xs sm:text-sm text-red-600 mt-1 sm:mt-2">
                      {addressError}
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Provide full house number, street, barangay/purok, city or
                      municipality.
                    </p>
                  )}
                </label>
              </div>

              {/* Info Note */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
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

            {/* Enhanced Footer */}
            <div className="flex justify-end gap-2 sm:gap-4 p-4 sm:p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={isCreating}
                className="px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isCreating || !isAddressValid || !areNamesValid || !isAgeValid
                }
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
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingResident && (
        <div
          className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEditModal();
          }}
        >
          <form
            onSubmit={handleUpdateResident}
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
                      Edit Resident
                    </h3>
                    <p className="text-green-100 text-xs sm:text-sm font-medium">
                      Update resident information
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-white">
              {/* Personal Information Section */}
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                  {/* First Name */}
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>First Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={editingResident.firstName}
                        onChange={(e) => {
                          const filtered = e.target.value.replace(
                            /[^\p{L}\s'\-]/gu,
                            ''
                          );
                          setEditingResident((s: any) => ({
                            ...s,
                            firstName: filtered,
                          }));
                        }}
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="Enter first name"
                      />
                      {editFirstNameError ? (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">
                          {editFirstNameError}
                        </p>
                      ) : null}
                    </div>
                  </label>

                  {/* Last Name */}
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>Last Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={editingResident.lastName}
                        onChange={(e) => {
                          const filtered = e.target.value.replace(
                            /[^\p{L}\s'\-]/gu,
                            ''
                          );
                          setEditingResident((s: any) => ({
                            ...s,
                            lastName: filtered,
                          }));
                        }}
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="Enter last name"
                      />
                      {editLastNameError ? (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">
                          {editLastNameError}
                        </p>
                      ) : null}
                    </div>
                  </label>

                  {/* Middle Name */}
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>Middle Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={editingResident.middleName}
                        onChange={(e) => {
                          const filtered = e.target.value.replace(
                            /[^\p{L}\s'\-]/gu,
                            ''
                          );
                          setEditingResident((s: any) => ({
                            ...s,
                            middleName: filtered,
                          }));
                        }}
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="If none put None"
                      />
                      {editMiddleNameError ? (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">
                          {editMiddleNameError}
                        </p>
                      ) : null}
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
                      value={editingResident.age as string}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '');
                        const limited = digitsOnly.slice(0, 3);
                        setEditingResident((s: any) => ({
                          ...s,
                          age: limited,
                        }));
                      }}
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                      placeholder="0"
                    />
                    {editAgeError ? (
                      <p className="text-xs sm:text-sm text-red-600 mt-1">
                        {editAgeError}
                      </p>
                    ) : null}
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
                        value={editContactRest}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          const limited = digitsOnly.slice(0, 9);
                          setEditContactRest(limited);
                        }}
                        className="w-full pl-10 sm:pl-14 border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                        placeholder="9XXXXXXXX"
                      />
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

                <label className="block group">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>Address</span>
                  </div>
                  <textarea
                    rows={3}
                    value={editingResident.address}
                    onChange={(e) =>
                      setEditingResident((s: any) => ({
                        ...s,
                        address: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 resize-none text-sm sm:text-base"
                    placeholder="Enter complete address..."
                  />
                  {editAddressError ? (
                    <p className="text-xs sm:text-sm text-red-600 mt-1 sm:mt-2">
                      {editAddressError}
                    </p>
                  ) : null}
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 sm:gap-4 p-4 sm:p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
                className="px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isUpdating ||
                  !editIsAddressValid ||
                  !editAreNamesValid ||
                  !editIsAgeValid
                }
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
                    <span>Update Resident</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingResident && (
        <div
          className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="relative p-4 sm:p-6 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                    <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      Delete Resident
                    </h3>
                    <p className="text-red-100 text-xs sm:text-sm font-medium">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 ring-white/30"
                  title="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-800 font-medium">
                  Are you sure you want to delete the record for{' '}
                  <span className="font-bold text-red-700">
                    {deletingResident.firstName} {deletingResident.lastName}
                  </span>
                  ?
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Record ID:{' '}
                  <span className="font-semibold">{deletingResident._id}</span>
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                    <span className="font-bold">Warning:</span> This will
                    permanently delete all data associated with this resident.
                    This action cannot be reversed.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteResident}
                disabled={isDeleting}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentRecords;
