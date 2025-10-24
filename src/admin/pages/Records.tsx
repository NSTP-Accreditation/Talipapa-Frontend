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
} from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { useToast } from '@/hooks/useToast';
import { debounce } from 'lodash';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
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
    contact: '',
    address: '',
  });
  // Address validation state
  const [addressError, setAddressError] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(false);
  // Keep only the editable part of the contact (suffix). The fixed prefix will be '09'.
  // Editable part is up to 9 digits so total length becomes 11 (09 + 9 digits).
  const [contactRest, setContactRest] = useState('');
  // Editable part for record ID. Fixed prefix will be 'BT-'. This stores the rest (e.g. '0001').
  const [recordIdRest, setRecordIdRest] = useState('');

  const openAddModal = () => {
    setNewResident({
      firstName: '',
      lastName: '',
      middleName: '',
      points: 0,
      age: '',
      address: '',
      contact: '',
    });
    setContactRest('');
    setRecordIdRest('');
    setIsAddModalOpen(true);
  };

  const handleCreateResident = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreating) {
      return;
    }

    setIsCreating(true);

    if (!newResident.age || String(newResident.age).trim() === '') {
      showError('Age is required!', { title: 'Validation' });
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
        contact: contactRest ? `09${contactRest}` : '',
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

  const closeAddModal = () => setIsAddModalOpen(false);

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

  // Show loading skeleton while loading
  if (loading) {
    return <FormTablePageSkeleton />;
  }

  // Update all references to use safeRecords instead of records
  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen space-y-4 sm:space-y-6 md:space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <UserRoundPen className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-600" />
            <span className="text-lg sm:text-2xl md:text-3xl">
              Resident Records
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-700 font-medium">
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
            className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-xs sm:text-sm">+ Add Residents</span>
          </Button>

          <Button
            onClick={handleExportToExcel}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="hidden xs:inline">Export Excel Report</span>
            <span className="xs:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="relative w-full">
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by Record ID or Name..."
            className="w-full rounded-lg sm:rounded-xl border-2 border-gray-300 py-2 sm:py-2.5 md:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
              <tr>
                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Record ID
                </th>
                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Created At
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
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border border-green-200">
                        {resident?._id}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                          {resident?.firstName?.charAt(0)}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">
                          {resident?.firstName} {resident?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {resident?.age}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-lg sm:text-xl md:text-2xl">
                          ⭐
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {resident?.points}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-gray-400 text-sm sm:text-base">
                          📍
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                          {resident?.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-gray-400 text-sm sm:text-base">
                          📅
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          {dayjs(resident?.createdAt).format(
                            window.innerWidth < 640
                              ? 'MM/DD/YY'
                              : 'YYYY-MM-DD | h:mm:ss A'
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-2 sm:px-6 py-8 sm:py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <p className="text-sm sm:text-base text-gray-500 font-medium">
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
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 gap-3 sm:gap-0">
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
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border-2 border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-50 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden xs:inline">← Previous</span>
            <span className="xs:hidden">←</span>
          </Button>

          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-green-100 border-2 border-green-300 rounded-md sm:rounded-lg">
            <span className="text-xs sm:text-sm font-bold text-green-800">
              <span className="hidden xs:inline">Page </span>
              {currentPage} of {totalPages || 1}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border-2 border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-50 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden xs:inline">Next →</span>
            <span className="xs:hidden">→</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Modal with Better Mobile UI */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-1003 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAddModal();
          }}
        >
          <form
            onSubmit={handleCreateResident}
            className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-slideUp"
          >
            {/* Enhanced Header */}
            <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/10 rounded-full -mr-16 sm:mr-24 md:-mr-32 -mt-16 sm:-mt-24 md:-mt-32"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-18 md:-ml-24 -mb-12 sm:-mb-18 md:-mb-24"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center ring-2 sm:ring-4 ring-white/30 shadow-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1">
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
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-2 ring-white/30"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Enhanced Form Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-white">
              {/* Personal Information Section */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                    Personal Information
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                {/* Name fields in a row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                  {/* First Name */}
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>First Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={newResident.firstName}
                        onChange={(e) =>
                          setNewResident((s) => ({
                            ...s,
                            firstName: e.target.value,
                          }))
                        }
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-sm sm:text-base text-gray-800 font-medium hover:border-gray-400"
                        placeholder="Enter first name"
                      />
                    </div>
                  </label>
                  {/* Last Name */}
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                      <span className="text-red-500">*</span>
                      <span>Last Name</span>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={newResident.lastName}
                        onChange={(e) =>
                          setNewResident((s) => ({
                            ...s,
                            lastName: e.target.value,
                          }))
                        }
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-sm sm:text-base text-gray-800 font-medium hover:border-gray-400"
                        placeholder="Enter last name"
                      />
                    </div>
                  </label>
                  {/* Middle Name */}
                  <label className="block group sm:col-span-2 md:col-span-1">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                      <span>Middle Name</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={newResident.middleName}
                        onChange={(e) =>
                          setNewResident((s) => ({
                            ...s,
                            middleName: e.target.value,
                          }))
                        }
                        className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-sm sm:text-base text-gray-800 font-medium hover:border-gray-400"
                        placeholder="If none put N/A"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                    Additional Details
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
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
                      onChange={(e) =>
                        setNewResident((s) => ({
                          ...s,
                          // allow only digits and limit to 3 chars
                          age: e.target.value.replace(/\D/g, '').slice(0, 3),
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-sm sm:text-base text-gray-800 font-medium hover:border-gray-400"
                      placeholder="0"
                    />
                  </label>

                  <label className="block group">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      <span>Contact</span>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-700 font-bold">
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
                        className="w-full pl-10 sm:pl-12 md:pl-14 border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-sm sm:text-base text-gray-800 font-medium hover:border-gray-400"
                        placeholder="9XXXXXXXX"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                      Contact will be saved as{' '}
                      <span className="font-medium">09XXXXXXXXX</span>. Only
                      numbers allowed.
                    </div>
                  </label>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                    Location
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                <label className="block group">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>Address</span>
                  </div>
                  <textarea
                    rows={3}
                    value={newResident.address}
                    onChange={(e) =>
                      setNewResident((s) => ({ ...s, address: e.target.value }))
                    }
                    className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-100 transition-all outline-none text-sm sm:text-base text-gray-800 font-medium hover:border-gray-400 resize-none"
                    placeholder="Enter complete address..."
                  />
                  {addressError ? (
                    <p className="text-xs sm:text-sm text-red-600 mt-1.5 sm:mt-2">
                      {addressError}
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
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
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={isCreating}
                className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl border-2 border-gray-300 font-bold text-sm sm:text-base text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || !isAddressValid}
                className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
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
    </div>
  );
};

export default ResidentRecords;
