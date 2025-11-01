import { Button } from '@/components/ui';
import { Download, UserRoundPen } from 'lucide-react';
import { RecordInterface } from '@/types/global.types';
import { useToast } from '@/hooks/useToast';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction } from 'react';

type RecordHeaderProps = {
  recordsData: RecordInterface[];
  setOpenAddRecordModal: Dispatch<SetStateAction<boolean>>;
};

const RecordHeader = ({
  recordsData,
  setOpenAddRecordModal,
}: RecordHeaderProps) => {
  const { error: showError } = useToast();

  const handleExportToExcel = async () => {
    if (!recordsData || recordsData.length === 0) {
      showError('No records available to export.', { title: 'Export' });
      return;
    }

    // --- Create Workbook & Sheets ---
    const workbook = new ExcelJS.Workbook();

    // Set workbook properties for professional appearance
    workbook.creator = 'Barangay Talipapa Admin';
    workbook.lastModifiedBy = 'Barangay Talipapa CMS';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.company = 'Barangay Talipapa';
    workbook.subject = 'Resident Records Report';
    workbook.title = 'Crystallized Resident Report';
    workbook.description =
      'Professional report of resident records - Read-only protected';

    // Add sheets in proper order
    const coverSheet = workbook.addWorksheet('Cover Page');
    const summarySheet = workbook.addWorksheet('Executive Summary');
    const recordsSheet = workbook.addWorksheet('Resident Records');
    const statisticsSheet = workbook.addWorksheet('Statistics');
    const rawDataSheet = workbook.addWorksheet('Raw Data');

    // --- COVER PAGE ---
    coverSheet.pageSetup.orientation = 'portrait';
    coverSheet.pageSetup.fitToPage = true;

    // Logo/Header area
    coverSheet.mergeCells('A1:E8');
    const coverTitle = coverSheet.getCell('A1');
    coverTitle.value =
      '🏛️\n\nBARANGAY TALIPAPA\nOFFICIAL RESIDENT RECORDS\n\nCrystallized Report';
    coverTitle.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    coverTitle.font = { size: 24, bold: true, color: { argb: 'FF1B5E20' } };
    coverTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8F5E9' },
    };
    coverTitle.border = {
      top: { style: 'thick', color: { argb: 'FF2E7D32' } },
      left: { style: 'thick', color: { argb: 'FF2E7D32' } },
      bottom: { style: 'thick', color: { argb: 'FF2E7D32' } },
      right: { style: 'thick', color: { argb: 'FF2E7D32' } },
    };

    // Report metadata
    coverSheet.getRow(10).values = [
      'Report Type:',
      'Resident Records Crystallized Report',
    ];
    coverSheet.getRow(11).values = [
      'Generated On:',
      dayjs().format('MMMM DD, YYYY | h:mm A'),
    ];
    coverSheet.getRow(12).values = ['Total Records:', recordsData.length];
    coverSheet.getRow(13).values = ['Status:', '✓ Protected & Read-Only'];
    coverSheet.getRow(14).values = [
      'Department:',
      'Barangay Records Management',
    ];

    // Style metadata rows
    for (let i = 10; i <= 14; i++) {
      const row = coverSheet.getRow(i);
      row.height = 25;
      row.getCell(1).font = { bold: true, size: 12 };
      row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8F5E9' },
      };
      row.getCell(2).font = { size: 12 };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    // Footer note
    coverSheet.mergeCells('A16:E17');
    const footerNote = coverSheet.getCell('A16');
    footerNote.value =
      '⚠️ NOTICE: This report is protected and read-only.\nAll sheets are locked to maintain data integrity for official records.';
    footerNote.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    footerNote.font = { size: 11, italic: true, color: { argb: 'FF795548' } };
    footerNote.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFF3E0' },
    };

    coverSheet.columns = [
      { width: 25 },
      { width: 35 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];

    // --- SUMMARY CALCULATIONS ---
    const totalResidents = recordsData.length;
    const totalPoints = recordsData.reduce(
      (sum, r) => sum + (r.points || 0),
      0
    );
    const avgAge = (
      recordsData.reduce((sum, r) => sum + (Number(r.age) || 0), 0) /
      totalResidents
    ).toFixed(1);

    const avgPoints = (totalPoints / totalResidents).toFixed(1);
    const maxPoints = Math.max(...recordsData.map((r) => r.points || 0));
    const minPoints = Math.min(...recordsData.map((r) => r.points || 0));

    const ageGroups = { '0–17': 0, '18–35': 0, '36–59': 0, '60+': 0 };
    const genderCount: any = {};
    const addressCount: any = {};

    recordsData.forEach((r) => {
      const age = Number(r.age);
      if (age <= 17) ageGroups['0–17']++;
      else if (age <= 35) ageGroups['18–35']++;
      else if (age <= 59) ageGroups['36–59']++;
      else ageGroups['60+']++;

      // Gender distribution
      const gender = (r as any).gender || 'Not Specified';
      genderCount[gender] = (genderCount[gender] || 0) + 1;

      // Address distribution (limit to avoid too many)
      const addr = r.address || 'Not Specified';
      addressCount[addr] = (addressCount[addr] || 0) + 1;
    });

    // --- EXECUTIVE SUMMARY ---
    summarySheet.mergeCells('A1:D1');
    const summaryTitle = summarySheet.getCell('A1');
    summaryTitle.value = '📊 EXECUTIVE SUMMARY';
    summaryTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    summaryTitle.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    summaryTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1B5E20' },
    };
    summarySheet.getRow(1).height = 30;

    // Key Performance Indicators
    summarySheet.addRow([]);
    summarySheet.mergeCells('A3:D3');
    summarySheet.getCell('A3').value = 'KEY PERFORMANCE INDICATORS';
    summarySheet.getCell('A3').font = {
      size: 14,
      bold: true,
      color: { argb: 'FF2E7D32' },
    };
    summarySheet.getCell('A3').alignment = { horizontal: 'center' };

    summarySheet.addRow([]);
    const kpiData = [
      ['Metric', 'Value', 'Category', 'Status'],
      ['Total Residents', totalResidents, 'Population', '✓ Active'],
      ['Average Age', avgAge + ' years', 'Demographics', '✓ Recorded'],
      [
        'Total Points Accumulated',
        totalPoints.toLocaleString(),
        'Rewards',
        '✓ Tracked',
      ],
      ['Average Points per Resident', avgPoints, 'Rewards', '✓ Calculated'],
      ['Highest Points', maxPoints.toLocaleString(), 'Rewards', '✓ Identified'],
      ['Lowest Points', minPoints.toLocaleString(), 'Rewards', '✓ Identified'],
    ];

    kpiData.forEach((row, idx) => {
      const excelRow = summarySheet.addRow(row);
      if (idx === 0) {
        // Header row
        excelRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        excelRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF43A047' },
        };
        excelRow.height = 25;
        excelRow.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        excelRow.height = 22;
        excelRow.alignment = { horizontal: 'left', vertical: 'middle' };
        excelRow.getCell(1).font = { bold: true };
        excelRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: idx % 2 === 0 ? 'FFF1F8E9' : 'FFFFFFFF' },
        };
      }
      excelRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      });
    });

    summarySheet.columns = [
      { width: 35 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
    ];

    // --- STATISTICS SHEET ---
    statisticsSheet.mergeCells('A1:C1');
    const statsTitle = statisticsSheet.getCell('A1');
    statsTitle.value = '📈 DETAILED STATISTICS';
    statsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    statsTitle.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    statsTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1B5E20' },
    };
    statisticsSheet.getRow(1).height = 30;

    // Age Distribution
    statisticsSheet.addRow([]);
    statisticsSheet.addRow(['AGE DISTRIBUTION']);
    statisticsSheet.getRow(3).font = {
      bold: true,
      size: 13,
      color: { argb: 'FF2E7D32' },
    };
    statisticsSheet.addRow(['Age Group', 'Count', 'Percentage']);

    const ageHeaderRow = statisticsSheet.getRow(4);
    ageHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ageHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF43A047' },
    };
    ageHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };

    Object.entries(ageGroups).forEach(([group, count]) => {
      const percentage = ((count / totalResidents) * 100).toFixed(1) + '%';
      const row = statisticsSheet.addRow([group, count, percentage]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      // Visual bar
      const barLength = Math.floor((count / totalResidents) * 20);
      row.getCell(4).value = '█'.repeat(barLength);
      row.getCell(4).font = { color: { argb: 'FF43A047' } };
    });

    // Gender Distribution
    statisticsSheet.addRow([]);
    statisticsSheet.addRow(['GENDER DISTRIBUTION']);
    statisticsSheet.getRow(statisticsSheet.lastRow.number).font = {
      bold: true,
      size: 13,
      color: { argb: 'FF2E7D32' },
    };
    statisticsSheet.addRow(['Gender', 'Count', 'Percentage']);

    const genderHeaderRow = statisticsSheet.getRow(
      statisticsSheet.lastRow.number
    );
    genderHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    genderHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF43A047' },
    };

    Object.entries(genderCount).forEach(([gender, count]: [string, any]) => {
      const percentage = ((count / totalResidents) * 100).toFixed(1) + '%';
      const row = statisticsSheet.addRow([gender, count, percentage]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    statisticsSheet.columns = [
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 30 },
    ];

    // --- RESIDENT RECORDS SHEET ---
    // Add title
    recordsSheet.mergeCells('A1:I1');
    const recordsTitle = recordsSheet.getCell('A1');
    recordsTitle.value = '📋 COMPLETE RESIDENT RECORDS';
    recordsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    recordsTitle.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    recordsTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1B5E20' },
    };
    recordsSheet.getRow(1).height = 30;

    // Add metadata row
    recordsSheet.addRow([
      'Generated:',
      dayjs().format('MMMM DD, YYYY | h:mm A'),
      '',
      '',
      '',
      '',
      '',
      'Total Records:',
      totalResidents,
    ]);
    recordsSheet.getRow(2).font = { bold: true, size: 10 };
    recordsSheet.getRow(2).height = 20;

    recordsSheet.addRow([]); // Empty row

    // Column headers
    recordsSheet.columns = [
      { header: '#', key: 'num', width: 6 },
      { header: 'Record ID', key: 'record_id', width: 22 },
      { header: 'Full Name', key: 'name', width: 30 },
      { header: 'Gender', key: 'gender', width: 12 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Points', key: 'points', width: 12 },
      { header: 'Contact', key: 'contact', width: 18 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 22 },
    ];

    // Add data rows starting from row 4
    recordsData.forEach((r, i) => {
      const suffix = (r as any).suffix ? ` ${(r as any).suffix}` : '';
      recordsSheet.addRow({
        num: i + 1,
        record_id: r._id,
        name: `${r.firstName} ${r.middleName || ''} ${r.lastName}${suffix}`.trim(),
        gender: (r as any).gender || 'N/A',
        age: r.age,
        points: r.points,
        contact: r.contact_number || 'N/A',
        address: r.address || 'N/A',
        createdAt: dayjs(r.createdAt).format('YYYY-MM-DD | h:mm A'),
      });
    });

    // Style header row (row 4)
    const headerRow = recordsSheet.getRow(4);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2E7D32' },
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 28;

    // Apply alternating row colors and borders
    recordsSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 4) {
        // Data rows
        row.height = 20;
        row.alignment = { vertical: 'middle', wrapText: true };

        // Alternating colors
        if ((rowNumber - 4) % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF1F8E9' },
          };
        }

        // Highlight high performers
        const pointsCell = row.getCell(6);
        const points = Number(pointsCell.value);
        if (points >= maxPoints * 0.8) {
          pointsCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFD54F' },
          };
          pointsCell.font = { bold: true, color: { argb: 'FF1B5E20' } };
        }
      }

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      });
    });

    // Freeze header rows
    recordsSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];

    // --- RAW DATA SHEET ---
    rawDataSheet.mergeCells('A1:E1');
    const rawTitle = rawDataSheet.getCell('A1');
    rawTitle.value = '🗄️ RAW DATA (Technical Reference)';
    rawTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    rawTitle.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    rawTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF455A64' },
    };
    rawDataSheet.getRow(1).height = 28;

    rawDataSheet.addRow([]);
    rawDataSheet.addRow([
      'Note: This sheet contains unformatted raw data for technical reference only.',
    ]);
    rawDataSheet.getRow(3).font = {
      italic: true,
      size: 10,
      color: { argb: 'FF757575' },
    };
    rawDataSheet.addRow([]);

    const allKeys = Object.keys(recordsData[0] || {});
    const startRow = 5;

    // Add headers manually
    const rawHeaders = rawDataSheet.addRow(allKeys);
    rawHeaders.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    rawHeaders.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF546E7A' },
    };
    rawHeaders.alignment = { horizontal: 'center', vertical: 'middle' };
    rawHeaders.height = 25;

    // Add data
    recordsData.forEach((r) => {
      const rowData = allKeys.map((key) => (r as any)[key]);
      rawDataSheet.addRow(rowData);
    });

    // Set column widths
    rawDataSheet.columns = allKeys.map(() => ({ width: 20 }));

    // Add borders
    rawDataSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber >= startRow) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          };
        });
      }
    });

    // Add timestamp footer
    rawDataSheet.addRow([]);
    const timestampRow = rawDataSheet.addRow([
      'Generated on:',
      dayjs().format('MMMM DD, YYYY | h:mm:ss A'),
    ]);
    timestampRow.font = { italic: true, size: 9, color: { argb: 'FF9E9E9E' } };

    // --- PROTECT ALL SHEETS (READ-ONLY) ---
    const protectionOptions = {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      insertHyperlinks: false,
      deleteColumns: false,
      deleteRows: false,
      sort: false,
      autoFilter: false,
      pivotTables: false,
    };

    // Protect each sheet with a password
    const password = 'BarangayTalipapa2024'; // You can change this or make it configurable

    await coverSheet.protect(password, protectionOptions);
    await summarySheet.protect(password, protectionOptions);
    await recordsSheet.protect(password, protectionOptions);
    await statisticsSheet.protect(password, protectionOptions);
    await rawDataSheet.protect(password, protectionOptions);

    // --- EXPORT FILE ---
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const filename = `Barangay_Talipapa_Resident_Report_${dayjs().format('YYYY-MM-DD_HHmm')}.xlsx`;
    saveAs(blob, filename);
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <UserRoundPen className="w-7 h-7 sm:w-10 sm:h-10 text-green-600" />
          Resident Records
        </h1>
        <p className="text-xs sm:text-base text-gray-700 font-medium">
          List of the resident records created
          <span className="ml-2 sm:ml-3 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
            {recordsData?.length}{' '}
            {recordsData?.length === 1 ? 'Record' : 'Records'}
          </span>
        </p>
      </div>

      {/* Right side: Add Residents and Download button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <Button
          onClick={() => setOpenAddRecordModal(true)}
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
    </header>
  );
};

export default RecordHeader;
