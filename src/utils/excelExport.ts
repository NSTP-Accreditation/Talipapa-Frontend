/**
 * Excel Export Utility
 * 
 * Provides comprehensive Excel file generation with professional styling,
 * password protection, and support for multiple record types.
 * 
 * @module excelExport
 */

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

// ==================== TYPES ====================

/**
 * Type of record to export
 */
export type RecordType = 'resident' | 'non-resident' | 'establishment';

export interface ResidentRecord {
  _id: string;
  record_id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender?: string;
  age: number | string;
  points: number;
  contact_number?: string;
  address?: string;
  createdAt: string;
}

export interface EstablishmentRecord {
  _id: string;
  record_id?: string;
  name: string;
  type: string;
  ownerName: string;
  contactNumber?: string;
  address?: string;
  createdAt?: string;
}

export interface ExcelExportOptions {
  password?: string;
  showLoadingState?: (loading: boolean) => void;
}

// ==================== STYLING CONSTANTS ====================

const COLORS = {
  primary: 'FF1B5E20',
  primaryLight: 'FFE8F5E9',
  primaryMedium: 'FF2E7D32',
  accent: 'FF43A047',
  accentLight: 'FFF1F8E9',
  white: 'FFFFFFFF',
  gray: 'FF757575',
  lightGray: 'FFCCCCCC',
  warning: 'FFFFF3E0',
  warningText: 'FF795548',
  highlight: 'FFFFD54F',
  backgroundAlt: 'FFF1F8E9',
};

// ==================== HELPER FUNCTIONS ====================

const styleCoverSheet = (
  sheet: ExcelJS.Worksheet,
  recordCount: number,
  recordType: string
) => {
  sheet.pageSetup.orientation = 'portrait';
  sheet.pageSetup.fitToPage = true;

  // Logo/Header area
  sheet.mergeCells('A1:E8');
  const coverTitle = sheet.getCell('A1');
  coverTitle.value = `🏛️\n\nBARANGAY TALIPAPA\n${recordType.toUpperCase()} RECORDS\n\nCrystallized Report`;
  coverTitle.alignment = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
  };
  coverTitle.font = { size: 24, bold: true, color: { argb: COLORS.primary } };
  coverTitle.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLORS.primaryLight },
  };
  coverTitle.border = {
    top: { style: 'thick', color: { argb: COLORS.primaryMedium } },
    left: { style: 'thick', color: { argb: COLORS.primaryMedium } },
    bottom: { style: 'thick', color: { argb: COLORS.primaryMedium } },
    right: { style: 'thick', color: { argb: COLORS.primaryMedium } },
  };

  // Report metadata
  sheet.getRow(10).values = [
    'Report Type:',
    `${recordType} Records Crystallized Report`,
  ];
  sheet.getRow(11).values = [
    'Generated On:',
    dayjs().format('MMMM DD, YYYY | h:mm A'),
  ];

  // Set column widths to prevent label overflow
  sheet.getColumn(1).width = 18;
  sheet.getColumn(2).width = 35;
  sheet.getRow(12).values = ['Total Records:', recordCount];
  sheet.getRow(13).values = ['Status:', '✓ Protected & Read-Only'];
  sheet.getRow(14).values = ['Department:', 'Barangay Records Management'];

  // Style metadata rows
  for (let i = 10; i <= 14; i++) {
    const row = sheet.getRow(i);
    row.height = 25;
    row.getCell(1).font = { bold: true, size: 12 };
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.primaryLight },
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
  sheet.mergeCells('A16:E17');
  const footerNote = sheet.getCell('A16');
  footerNote.value =
    '⚠️ NOTICE: This report is protected and read-only.\nAll sheets are locked to maintain data integrity for official records.';
  footerNote.alignment = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
  };
  footerNote.font = {
    size: 11,
    italic: true,
    color: { argb: COLORS.warningText },
  };
  footerNote.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLORS.warning },
  };

  sheet.columns = [
    { width: 25 },
    { width: 35 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];
};

const addSummarySheet = (
  sheet: ExcelJS.Worksheet,
  stats: {
    totalRecords: number;
    totalPoints?: number;
    avgAge?: string;
    avgPoints?: string;
    maxPoints?: number;
    minPoints?: number;
    ageGroups?: Record<string, number>;
    genderCount?: Record<string, number>;
  }
) => {
  sheet.mergeCells('A1:D1');
  const summaryTitle = sheet.getCell('A1');
  summaryTitle.value = '📊 EXECUTIVE SUMMARY';
  summaryTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  summaryTitle.font = { size: 16, bold: true, color: { argb: COLORS.white } };
  summaryTitle.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLORS.primary },
  };
  sheet.getRow(1).height = 30;

  // Key Performance Indicators
  sheet.addRow([]);
  sheet.mergeCells('A3:D3');
  sheet.getCell('A3').value = 'KEY PERFORMANCE INDICATORS';
  sheet.getCell('A3').font = {
    size: 14,
    bold: true,
    color: { argb: COLORS.primaryMedium },
  };
  sheet.getCell('A3').alignment = { horizontal: 'center' };

  sheet.addRow([]);
  const kpiData = [
    ['Metric', 'Value', 'Category', 'Status'],
    ['Total Records', stats.totalRecords, 'Population', '✓ Active'],
  ];

  if (stats.avgAge) {
    kpiData.push([
      'Average Age',
      stats.avgAge + ' years',
      'Demographics',
      '✓ Recorded',
    ]);
  }

  if (stats.totalPoints !== undefined) {
    kpiData.push(
      [
        'Total Points Accumulated',
        stats.totalPoints.toLocaleString(),
        'Rewards',
        '✓ Tracked',
      ],
      [
        'Average Points per Record',
        stats.avgPoints || '0',
        'Rewards',
        '✓ Calculated',
      ],
      [
        'Highest Points',
        (stats.maxPoints || 0).toLocaleString(),
        'Rewards',
        '✓ Identified',
      ],
      [
        'Lowest Points',
        (stats.minPoints || 0).toLocaleString(),
        'Rewards',
        '✓ Identified',
      ]
    );
  }

  kpiData.forEach((row, idx) => {
    const excelRow = sheet.addRow(row);
    excelRow.height = idx === 0 ? 25 : 22;

    // Only style columns A-D (1-4) for Executive Summary
    for (let colNum = 1; colNum <= 4; colNum++) {
      const cell = excelRow.getCell(colNum);

      if (idx === 0) {
        // Header row styling
        cell.font = { bold: true, color: { argb: COLORS.white } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: COLORS.accent },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        // Data row styling
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        if (colNum === 1) {
          cell.font = { bold: true };
        }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: idx % 2 === 0 ? COLORS.accentLight : COLORS.white },
        };
      }

      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.lightGray } },
        left: { style: 'thin', color: { argb: COLORS.lightGray } },
        bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
        right: { style: 'thin', color: { argb: COLORS.lightGray } },
      };
    }
  });

  sheet.columns = [{ width: 35 }, { width: 25 }, { width: 20 }, { width: 20 }];
};

const addStatisticsSheet = (
  sheet: ExcelJS.Worksheet,
  stats: {
    totalRecords: number;
    ageGroups?: Record<string, number>;
    genderCount?: Record<string, number>;
    addressCount?: Record<string, number>;
    typeCount?: Record<string, number>;
  }
) => {
  sheet.mergeCells('A1:D1');
  const statsTitle = sheet.getCell('A1');
  statsTitle.value = '📈 DETAILED STATISTICS';
  statsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  statsTitle.font = { size: 16, bold: true, color: { argb: COLORS.white } };
  statsTitle.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLORS.primary },
  };
  sheet.getRow(1).height = 30;

  // Add statistics based on what's available
  const sections: Array<{ title: string; data: Record<string, number> }> = [];

  if (stats.ageGroups) {
    sections.push({ title: 'AGE DISTRIBUTION', data: stats.ageGroups });
  }

  if (stats.genderCount) {
    sections.push({ title: 'GENDER DISTRIBUTION', data: stats.genderCount });
  }

  if (stats.typeCount) {
    sections.push({ title: 'TYPE DISTRIBUTION', data: stats.typeCount });
  }

  sections.forEach((section, sectionIdx) => {
    if (sectionIdx > 0) sheet.addRow([]);

    sheet.addRow([]);
    sheet.addRow([section.title]);
    sheet.getRow(sheet.lastRow!.number).font = {
      bold: true,
      size: 13,
      color: { argb: COLORS.primaryMedium },
    };
    sheet.addRow(['Category', 'Count', 'Percentage']);

    const headerRow = sheet.getRow(sheet.lastRow!.number);
    // Only style columns A-C (1-3) for Statistics header
    for (let colNum = 1; colNum <= 3; colNum++) {
      const cell = headerRow.getCell(colNum);
      cell.font = { bold: true, color: { argb: COLORS.white } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: COLORS.accent },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    Object.entries(section.data).forEach(([category, count]) => {
      const percentage = ((count / stats.totalRecords) * 100).toFixed(1) + '%';
      const row = sheet.addRow([category, count, percentage]);
      // Only style columns A-C (1-3) for Statistics data rows
      for (let colNum = 1; colNum <= 3; colNum++) {
        const cell = row.getCell(colNum);
        // Center align count and percentage columns
        if (colNum === 2 || colNum === 3) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else {
          cell.alignment = { vertical: 'middle' };
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
      const barLength = Math.floor((count / stats.totalRecords) * 20);
      row.getCell(4).value = '█'.repeat(barLength);
      row.getCell(4).font = { color: { argb: COLORS.accent } };
    });
  });

  sheet.columns = [{ width: 25 }, { width: 15 }, { width: 15 }, { width: 30 }];
};

// ==================== EXPORT FUNCTIONS ====================

/**
 * Exports resident records to a professionally styled Excel file
 * 
 * Creates a comprehensive Excel workbook with:
 * - Cover sheet with report metadata
 * - Complete data sheet with all records
 * - Summary sheet with statistics and charts
 * - Professional styling and formatting
 * - Optional password protection
 * 
 * @param records - Array of resident records to export
 * @param options - Export options including password and loading state callback
 * @param options.password - Password to protect the Excel file (default: 'BarangayTalipapa2024')
 * @param options.showLoadingState - Optional callback to show loading state
 * @returns Promise that resolves when file download starts
 * 
 * @example
 * await exportResidentRecords(residents, {
 *   password: 'MyPassword123',
 *   showLoadingState: (loading) => setIsLoading(loading)
 * });
 * 
 * @throws Will throw an error if Excel generation fails
 */
export const exportResidentRecords = async (
  records: ResidentRecord[],
  options: ExcelExportOptions = {}
): Promise<void> => {
  const { password = 'BarangayTalipapa2024', showLoadingState } = options;

  if (showLoadingState) showLoadingState(true);

  try {
    // Create Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Barangay Talipapa Admin';
    workbook.lastModifiedBy = 'Barangay Talipapa CMS';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.company = 'Barangay Talipapa';
    workbook.subject = 'Resident Records Report';
    workbook.title = 'Crystallized Resident Report';
    workbook.description =
      'Professional report of resident records - Read-only protected';

    // Add sheets
    const coverSheet = workbook.addWorksheet('Cover Page');
    const summarySheet = workbook.addWorksheet('Executive Summary');
    const recordsSheet = workbook.addWorksheet('Resident Records');
    const statisticsSheet = workbook.addWorksheet('Statistics');
    const rawDataSheet = workbook.addWorksheet('Raw Data');

    // Calculate statistics
    const totalResidents = records.length;
    const totalPoints = records.reduce((sum, r) => sum + (r.points || 0), 0);
    const avgAge = (
      records.reduce((sum, r) => sum + (Number(r.age) || 0), 0) / totalResidents
    ).toFixed(1);
    const avgPoints = (totalPoints / totalResidents).toFixed(1);
    const maxPoints_resident = Math.max(...records.map((r) => r.points || 0));
    const minPoints = Math.min(...records.map((r) => r.points || 0));

    const ageGroups: Record<string, number> = {
      '0–17': 0,
      '18–35': 0,
      '36–59': 0,
      '60+': 0,
    };
    const genderCount: Record<string, number> = {};

    records.forEach((r) => {
      const age = Number(r.age);
      if (age <= 17) ageGroups['0–17']++;
      else if (age <= 35) ageGroups['18–35']++;
      else if (age <= 59) ageGroups['36–59']++;
      else ageGroups['60+']++;

      const gender = r.gender || 'Not Specified';
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });

    // Style sheets
    styleCoverSheet(coverSheet, totalResidents, 'Resident');

    addSummarySheet(summarySheet, {
      totalRecords: totalResidents,
      totalPoints,
      avgAge,
      avgPoints,
      maxPoints: maxPoints_resident,
      minPoints,
      ageGroups,
      genderCount,
    });

    addStatisticsSheet(statisticsSheet, {
      totalRecords: totalResidents,
      ageGroups,
      genderCount,
    });

    // Records Sheet
    recordsSheet.mergeCells('A1:I1');
    const recordsTitle = recordsSheet.getCell('A1');
    recordsTitle.value = '📋 COMPLETE RESIDENT RECORDS';
    recordsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    recordsTitle.font = { size: 16, bold: true, color: { argb: COLORS.white } };
    recordsTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.primary },
    };
    recordsSheet.getRow(1).height = 30;

    // Add metadata row with proper cell merging
    recordsSheet.getCell('A2').value = 'Generated:';
    recordsSheet.getCell('A2').alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };
    recordsSheet.getColumn(1).width = 12; // Ensure "Generated:" fits
    recordsSheet.getCell('B2').value = dayjs().format('MMMM DD, YYYY | h:mm A');
    recordsSheet.mergeCells('B2:G2');
    recordsSheet.getCell('H2').value = 'Total Records:';
    recordsSheet.getCell('I2').value = totalResidents;
    recordsSheet.getRow(2).font = { bold: true, size: 10 };
    recordsSheet.getRow(2).height = 20;
    recordsSheet.getRow(2).alignment = { vertical: 'middle' };

    recordsSheet.addRow([]);

    // Set column widths first
    recordsSheet.getColumn(1).width = 6;
    recordsSheet.getColumn(2).width = 22;
    recordsSheet.getColumn(3).width = 30;
    recordsSheet.getColumn(4).width = 12;
    recordsSheet.getColumn(5).width = 8;
    recordsSheet.getColumn(6).width = 12;
    recordsSheet.getColumn(7).width = 18;
    recordsSheet.getColumn(8).width = 40;
    recordsSheet.getColumn(9).width = 22;

    // Manually add header row at row 4
    const headerRow = recordsSheet.getRow(4);
    headerRow.values = [
      '#',
      'Record ID',
      'Full Name',
      'Gender',
      'Age',
      'Points',
      'Contact',
      'Address',
      'Created At',
    ];
    headerRow.height = 28;
    // Only style the 9 columns that have data
    for (let colNum = 1; colNum <= 9; colNum++) {
      const cell = headerRow.getCell(colNum);
      cell.font = { bold: true, color: { argb: COLORS.white }, size: 11 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: COLORS.primaryMedium },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.lightGray } },
        left: { style: 'thin', color: { argb: COLORS.lightGray } },
        bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
        right: { style: 'thin', color: { argb: COLORS.lightGray } },
      };
    }

    // Add data rows starting from row 5
    records.forEach((r, i) => {
      const suffix = r.suffix ? ` ${r.suffix}` : '';
      const dataRow = recordsSheet.addRow([
        i + 1,
        r.record_id || r._id,
        `${r.firstName} ${r.middleName || ''} ${r.lastName}${suffix}`.trim(),
        r.gender || 'N/A',
        r.age,
        r.points,
        r.contact_number || 'N/A',
        r.address || 'N/A',
        dayjs(r.createdAt).format('YYYY-MM-DD | h:mm A'),
      ]);
    });

    // Style data rows - only iterate through rows with actual data
    const lastDataRow = 4 + records.length;
    for (let rowNumber = 1; rowNumber <= lastDataRow; rowNumber++) {
      const row = recordsSheet.getRow(rowNumber);

      if (rowNumber > 4) {
        // Data rows - only apply styles to cells with actual data (columns 1-9)
        for (let colNum = 1; colNum <= 9; colNum++) {
          const cell = row.getCell(colNum);
          // Center align #, Gender, Age, Points columns
          if (colNum === 1 || colNum === 4 || colNum === 5 || colNum === 6) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'middle', wrapText: true };
          }

          // Alternate row coloring
          if ((rowNumber - 4) % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: COLORS.accentLight },
            };
          }

          // Highlight high points
          if (colNum === 6) {
            const points = Number(cell.value);
            if (points >= maxPoints_resident * 0.8) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: COLORS.highlight },
              };
              cell.font = { bold: true, color: { argb: COLORS.primary } };
            }
          }

          cell.border = {
            top: { style: 'thin', color: { argb: COLORS.lightGray } },
            left: { style: 'thin', color: { argb: COLORS.lightGray } },
            bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
            right: { style: 'thin', color: { argb: COLORS.lightGray } },
          };
        }
      } else if (rowNumber <= 4) {
        // Header and title rows - limit to 9 columns
        for (let colNum = 1; colNum <= 9; colNum++) {
          const cell = row.getCell(colNum);
          if (!cell.border) {
            cell.border = {
              top: { style: 'thin', color: { argb: COLORS.lightGray } },
              left: { style: 'thin', color: { argb: COLORS.lightGray } },
              bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
              right: { style: 'thin', color: { argb: COLORS.lightGray } },
            };
          }
        }
      }
    }

    recordsSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];

    // Explicitly set the print area to prevent extra columns
    recordsSheet.pageSetup.printArea = 'A1:I' + (records.length + 4);

    // Raw Data Sheet
    rawDataSheet.mergeCells('A1:E1');
    const rawTitle = rawDataSheet.getCell('A1');
    rawTitle.value = '🗄️ RAW DATA (Technical Reference)';
    rawTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    rawTitle.font = { size: 14, bold: true, color: { argb: COLORS.white } };
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
      color: { argb: COLORS.gray },
    };
    rawDataSheet.addRow([]);

    const allKeys = Object.keys(records[0] || {}).filter(
      (key) => !key.startsWith('__') && key !== '_V'
    );
    const rawHeaders = rawDataSheet.addRow(allKeys);
    rawHeaders.height = 25;
    // Apply styling only to columns with data to prevent horizontal bleeding
    for (let colNum = 1; colNum <= allKeys.length; colNum++) {
      const cell = rawHeaders.getCell(colNum);
      cell.font = { bold: true, color: { argb: COLORS.white } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF546E7A' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }

    records.forEach((r) => {
      const rowData = allKeys.map((key) => {
        const value = (r as any)[key];
        // Format date fields to be more readable (replace T with |)
        if (
          typeof value === 'string' &&
          value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        ) {
          return value.replace('T', ' | ').replace(/\.\d{3}Z?$/, '');
        }
        return value;
      });
      rawDataSheet.addRow(rowData);
    });

    rawDataSheet.columns = allKeys.map(() => ({ width: 20 }));

    // Only style rows with actual data (header at row 5, then data rows)
    const lastRawDataRow = 5 + records.length;
    const numColumns = allKeys.length;

    // Determine which columns to center based on their keys
    const centerAlignKeys = [
      'residentStatus',
      'gender',
      'age',
      'isResident',
      'points',
      'contact_number',
    ];
    const centerAlignIndices = allKeys
      .map((key, idx) => (centerAlignKeys.includes(key) ? idx + 1 : -1))
      .filter((idx) => idx > 0);

    for (let rowNumber = 5; rowNumber <= lastRawDataRow; rowNumber++) {
      const row = rawDataSheet.getRow(rowNumber);
      // Only style columns that have actual data
      for (let colNum = 1; colNum <= numColumns; colNum++) {
        const cell = row.getCell(colNum);
        // Center align specific columns
        if (centerAlignIndices.includes(colNum)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        };
      }
    }

    // Protect sheets
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

    await coverSheet.protect(password, protectionOptions);
    await summarySheet.protect(password, protectionOptions);
    await recordsSheet.protect(password, protectionOptions);
    await statisticsSheet.protect(password, protectionOptions);
    await rawDataSheet.protect(password, protectionOptions);

    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const filename = `Barangay_Talipapa_Resident_Report_${dayjs().format('YYYY-MM-DD_HHmm')}.xlsx`;
    saveAs(blob, filename);
  } finally {
    if (showLoadingState) showLoadingState(false);
  }
};

/**
 * Exports non-resident records to a professionally styled Excel file
 * 
 * Similar to exportResidentRecords but tailored for non-resident data,
 * with appropriate styling and summary statistics.
 * 
 * @param records - Array of non-resident records to export
 * @param options - Export options including password and loading state callback
 * @returns Promise that resolves when file download starts
 * 
 * @example
 * await exportNonResidentRecords(nonResidents, {
 *   password: 'SecurePassword123'
 * });
 * 
 * @see exportResidentRecords
 */
export const exportNonResidentRecords = async (
  records: ResidentRecord[],
  options: ExcelExportOptions = {}
): Promise<void> => {
  const { password = 'BarangayTalipapa2024', showLoadingState } = options;

  if (showLoadingState) showLoadingState(true);

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Barangay Talipapa Admin';
    workbook.lastModifiedBy = 'Barangay Talipapa CMS';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.company = 'Barangay Talipapa';
    workbook.subject = 'Non-Resident Records Report';
    workbook.title = 'Crystallized Non-Resident Report';
    workbook.description =
      'Professional report of non-resident records - Read-only protected';

    const coverSheet = workbook.addWorksheet('Cover Page');
    const summarySheet = workbook.addWorksheet('Executive Summary');
    const recordsSheet = workbook.addWorksheet('Non-Resident Records');
    const statisticsSheet = workbook.addWorksheet('Statistics');
    const rawDataSheet = workbook.addWorksheet('Raw Data');

    // Calculate statistics
    const totalRecords = records.length;
    const totalPoints = records.reduce((sum, r) => sum + (r.points || 0), 0);
    const avgAge = (
      records.reduce((sum, r) => sum + (Number(r.age) || 0), 0) / totalRecords
    ).toFixed(1);
    const avgPoints = (totalPoints / totalRecords).toFixed(1);
    const maxPoints_nonresident = Math.max(
      ...records.map((r) => r.points || 0)
    );
    const minPoints = Math.min(...records.map((r) => r.points || 0));

    const ageGroups: Record<string, number> = {
      '0–17': 0,
      '18–35': 0,
      '36–59': 0,
      '60+': 0,
    };
    const genderCount: Record<string, number> = {};

    records.forEach((r) => {
      const age = Number(r.age);
      if (age <= 17) ageGroups['0–17']++;
      else if (age <= 35) ageGroups['18–35']++;
      else if (age <= 59) ageGroups['36–59']++;
      else ageGroups['60+']++;

      const gender = r.gender || 'Not Specified';
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });

    styleCoverSheet(coverSheet, totalRecords, 'Non-Resident');

    addSummarySheet(summarySheet, {
      totalRecords,
      totalPoints,
      avgAge,
      avgPoints,
      maxPoints: maxPoints_nonresident,
      minPoints,
      ageGroups,
      genderCount,
    });

    addStatisticsSheet(statisticsSheet, {
      totalRecords,
      ageGroups,
      genderCount,
    });

    // Records Sheet
    recordsSheet.mergeCells('A1:I1');
    const recordsTitle = recordsSheet.getCell('A1');
    recordsTitle.value = '📋 COMPLETE NON-RESIDENT RECORDS';
    recordsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    recordsTitle.font = { size: 16, bold: true, color: { argb: COLORS.white } };
    recordsTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.primary },
    };
    recordsSheet.getRow(1).height = 30;

    // Add metadata row with proper cell merging
    recordsSheet.getCell('A2').value = 'Generated:';
    recordsSheet.getCell('B2').value = dayjs().format('MMMM DD, YYYY | h:mm A');
    recordsSheet.mergeCells('B2:G2');
    recordsSheet.getCell('H2').value = 'Total Records:';
    recordsSheet.getCell('I2').value = totalRecords;
    recordsSheet.getRow(2).font = { bold: true, size: 10 };
    recordsSheet.getRow(2).height = 20;
    recordsSheet.getRow(2).alignment = { vertical: 'middle' };

    recordsSheet.addRow([]);

    // Set column widths first
    recordsSheet.getColumn(1).width = 6;
    recordsSheet.getColumn(2).width = 22;
    recordsSheet.getColumn(3).width = 30;
    recordsSheet.getColumn(4).width = 12;
    recordsSheet.getColumn(5).width = 8;
    recordsSheet.getColumn(6).width = 12;
    recordsSheet.getColumn(7).width = 18;
    recordsSheet.getColumn(8).width = 40;
    recordsSheet.getColumn(9).width = 22;

    // Manually add header row at row 4
    const headerRow = recordsSheet.getRow(4);
    headerRow.values = [
      '#',
      'Record ID',
      'Full Name',
      'Gender',
      'Age',
      'Points',
      'Contact',
      'Address',
      'Created At',
    ];
    headerRow.height = 28;
    // Only style the 9 columns that have data
    for (let colNum = 1; colNum <= 9; colNum++) {
      const cell = headerRow.getCell(colNum);
      cell.font = { bold: true, color: { argb: COLORS.white }, size: 11 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: COLORS.primaryMedium },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.lightGray } },
        left: { style: 'thin', color: { argb: COLORS.lightGray } },
        bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
        right: { style: 'thin', color: { argb: COLORS.lightGray } },
      };
    }

    // Add data rows starting from row 5
    records.forEach((r, i) => {
      const suffix = r.suffix ? ` ${r.suffix}` : '';
      const dataRow = recordsSheet.addRow([
        i + 1,
        r.record_id || r._id,
        `${r.firstName} ${r.middleName || ''} ${r.lastName}${suffix}`.trim(),
        r.gender || 'N/A',
        r.age,
        r.points,
        r.contact_number || 'N/A',
        r.address || 'N/A',
        dayjs(r.createdAt).format('YYYY-MM-DD | h:mm A'),
      ]);
    });

    // Style data rows - only iterate through rows with actual data
    const lastDataRow = 4 + records.length;
    for (let rowNumber = 1; rowNumber <= lastDataRow; rowNumber++) {
      const row = recordsSheet.getRow(rowNumber);

      if (rowNumber > 4) {
        // Data rows - only apply styles to cells with actual data (columns 1-9)
        for (let colNum = 1; colNum <= 9; colNum++) {
          const cell = row.getCell(colNum);
          // Center align #, Gender, Age, Points columns
          if (colNum === 1 || colNum === 4 || colNum === 5 || colNum === 6) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'middle', wrapText: true };
          }

          // Alternate row coloring
          if ((rowNumber - 4) % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: COLORS.accentLight },
            };
          }

          // Highlight high points
          if (colNum === 6) {
            const points = Number(cell.value);
            if (points >= maxPoints_nonresident * 0.8) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: COLORS.highlight },
              };
              cell.font = { bold: true, color: { argb: COLORS.primary } };
            }
          }

          cell.border = {
            top: { style: 'thin', color: { argb: COLORS.lightGray } },
            left: { style: 'thin', color: { argb: COLORS.lightGray } },
            bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
            right: { style: 'thin', color: { argb: COLORS.lightGray } },
          };
        }
      } else if (rowNumber <= 4) {
        // Header and title rows - limit to 9 columns
        for (let colNum = 1; colNum <= 9; colNum++) {
          const cell = row.getCell(colNum);
          if (!cell.border) {
            cell.border = {
              top: { style: 'thin', color: { argb: COLORS.lightGray } },
              left: { style: 'thin', color: { argb: COLORS.lightGray } },
              bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
              right: { style: 'thin', color: { argb: COLORS.lightGray } },
            };
          }
        }
      }
    }

    recordsSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];

    // Explicitly set the print area to prevent extra columns
    recordsSheet.pageSetup.printArea = 'A1:I' + (records.length + 4);

    // Raw Data Sheet (Non-Resident)
    rawDataSheet.mergeCells('A1:E1');
    const rawTitle = rawDataSheet.getCell('A1');
    rawTitle.value = '🗄️ RAW DATA (Technical Reference)';
    rawTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    rawTitle.font = { size: 14, bold: true, color: { argb: COLORS.white } };
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
      color: { argb: COLORS.gray },
    };
    rawDataSheet.addRow([]);

    const allKeys = Object.keys(records[0] || {}).filter(
      (key) => !key.startsWith('__') && key !== '_V'
    );
    const rawHeaders = rawDataSheet.addRow(allKeys);
    rawHeaders.height = 25;
    // Apply styling only to columns with data to prevent horizontal bleeding
    for (let colNum = 1; colNum <= allKeys.length; colNum++) {
      const cell = rawHeaders.getCell(colNum);
      cell.font = { bold: true, color: { argb: COLORS.white } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF546E7A' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }

    records.forEach((r) => {
      const rowData = allKeys.map((key) => {
        const value = (r as any)[key];
        // Format date fields to be more readable (replace T with |)
        if (
          typeof value === 'string' &&
          value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        ) {
          return value.replace('T', ' | ').replace(/\.\d{3}Z?$/, '');
        }
        return value;
      });
      rawDataSheet.addRow(rowData);
    });

    rawDataSheet.columns = allKeys.map(() => ({ width: 20 }));

    // Only style rows with actual data (header at row 5, then data rows) - Non-Resident
    const lastRawDataRow2 = 5 + records.length;
    const numColumns2 = allKeys.length;

    // Determine which columns to center based on their keys
    const centerAlignKeys2 = [
      'residentStatus',
      'gender',
      'age',
      'isResident',
      'points',
      'contact_number',
    ];
    const centerAlignIndices2 = allKeys
      .map((key, idx) => (centerAlignKeys2.includes(key) ? idx + 1 : -1))
      .filter((idx) => idx > 0);

    for (let rowNumber = 5; rowNumber <= lastRawDataRow2; rowNumber++) {
      const row = rawDataSheet.getRow(rowNumber);
      // Only style columns that have actual data
      for (let colNum = 1; colNum <= numColumns2; colNum++) {
        const cell = row.getCell(colNum);
        // Center align specific columns
        if (centerAlignIndices2.includes(colNum)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        };
      }
    }

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

    await coverSheet.protect(password, protectionOptions);
    await summarySheet.protect(password, protectionOptions);
    await recordsSheet.protect(password, protectionOptions);
    await statisticsSheet.protect(password, protectionOptions);
    await rawDataSheet.protect(password, protectionOptions);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const filename = `Barangay_Talipapa_NonResident_Report_${dayjs().format('YYYY-MM-DD_HHmm')}.xlsx`;
    saveAs(blob, filename);
  } finally {
    if (showLoadingState) showLoadingState(false);
  }
};

/**
 * Exports establishment records to a professionally styled Excel file
 * 
 * Tailored specifically for establishment data including business types,
 * owner information, and establishment-specific statistics.
 * 
 * @param records - Array of establishment records to export
 * @param options - Export options including password and loading state callback
 * @returns Promise that resolves when file download starts
 * 
 * @example
 * await exportEstablishmentRecords(establishments, {
 *   password: 'BusinessData2024'
 * });
 * 
 * @see exportResidentRecords
 * @see exportNonResidentRecords
 */
export const exportEstablishmentRecords = async (
  records: EstablishmentRecord[],
  options: ExcelExportOptions = {}
): Promise<void> => {
  const { password = 'BarangayTalipapa2024', showLoadingState } = options;

  if (showLoadingState) showLoadingState(true);

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Barangay Talipapa Admin';
    workbook.lastModifiedBy = 'Barangay Talipapa CMS';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.company = 'Barangay Talipapa';
    workbook.subject = 'Establishment Records Report';
    workbook.title = 'Crystallized Establishment Report';
    workbook.description =
      'Professional report of establishment records - Read-only protected';

    const coverSheet = workbook.addWorksheet('Cover Page');
    const summarySheet = workbook.addWorksheet('Executive Summary');
    const recordsSheet = workbook.addWorksheet('Establishment Records');
    const statisticsSheet = workbook.addWorksheet('Statistics');
    const rawDataSheet = workbook.addWorksheet('Raw Data');

    const totalRecords = records.length;
    const typeCount: Record<string, number> = {};
    const addressCount: Record<string, number> = {};

    records.forEach((r) => {
      const type = r.type || 'Not Specified';
      typeCount[type] = (typeCount[type] || 0) + 1;

      const addr = r.address || 'Not Specified';
      addressCount[addr] = (addressCount[addr] || 0) + 1;
    });

    styleCoverSheet(coverSheet, totalRecords, 'Establishment');

    addSummarySheet(summarySheet, {
      totalRecords,
    });

    addStatisticsSheet(statisticsSheet, {
      totalRecords,
      typeCount,
    });

    // Records Sheet
    recordsSheet.mergeCells('A1:H1');
    const recordsTitle = recordsSheet.getCell('A1');
    recordsTitle.value = '📋 COMPLETE ESTABLISHMENT RECORDS';
    recordsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    recordsTitle.font = { size: 16, bold: true, color: { argb: COLORS.white } };
    recordsTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.primary },
    };
    recordsSheet.getRow(1).height = 30;

    // Add metadata row with proper cell merging
    recordsSheet.getCell('A2').value = 'Generated:';
    recordsSheet.getCell('B2').value = dayjs().format('MMMM DD, YYYY | h:mm A');
    recordsSheet.mergeCells('B2:F2');
    recordsSheet.getCell('G2').value = 'Total Records:';
    recordsSheet.getCell('H2').value = totalRecords;
    recordsSheet.getRow(2).font = { bold: true, size: 10 };
    recordsSheet.getRow(2).height = 20;
    recordsSheet.getRow(2).alignment = { vertical: 'middle' };

    recordsSheet.addRow([]);

    // Set column widths first
    recordsSheet.getColumn(1).width = 6;
    recordsSheet.getColumn(2).width = 22;
    recordsSheet.getColumn(3).width = 30;
    recordsSheet.getColumn(4).width = 20;
    recordsSheet.getColumn(5).width = 30;
    recordsSheet.getColumn(6).width = 18;
    recordsSheet.getColumn(7).width = 40;
    recordsSheet.getColumn(8).width = 22;

    // Manually add header row at row 4
    const headerRow = recordsSheet.getRow(4);
    headerRow.values = [
      '#',
      'Record ID',
      'Business Name',
      'Business Type',
      'Owner Name',
      'Contact',
      'Address',
      'Created At',
    ];
    headerRow.height = 28;
    // Only style the 8 columns that have data
    for (let colNum = 1; colNum <= 8; colNum++) {
      const cell = headerRow.getCell(colNum);
      cell.font = { bold: true, color: { argb: COLORS.white }, size: 11 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: COLORS.primaryMedium },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.lightGray } },
        left: { style: 'thin', color: { argb: COLORS.lightGray } },
        bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
        right: { style: 'thin', color: { argb: COLORS.lightGray } },
      };
    }

    // Add data rows starting from row 5
    records.forEach((r, i) => {
      const dataRow = recordsSheet.addRow([
        i + 1,
        r.record_id || r._id,
        r.name || 'N/A',
        r.type || 'N/A',
        r.ownerName || 'N/A',
        r.contactNumber || 'N/A',
        r.address || 'N/A',
        r.createdAt ? dayjs(r.createdAt).format('YYYY-MM-DD | h:mm A') : 'N/A',
      ]);
    });

    // Style data rows - only iterate through rows with actual data
    const lastDataRow = 4 + records.length;
    for (let rowNumber = 1; rowNumber <= lastDataRow; rowNumber++) {
      const row = recordsSheet.getRow(rowNumber);

      if (rowNumber > 4) {
        // Data rows - only apply styles to cells with actual data (columns 1-8 for establishment)
        for (let colNum = 1; colNum <= 8; colNum++) {
          const cell = row.getCell(colNum);
          // Center align # column
          if (colNum === 1) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'middle', wrapText: true };
          }

          // Alternate row coloring
          if ((rowNumber - 4) % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: COLORS.accentLight },
            };
          }

          cell.border = {
            top: { style: 'thin', color: { argb: COLORS.lightGray } },
            left: { style: 'thin', color: { argb: COLORS.lightGray } },
            bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
            right: { style: 'thin', color: { argb: COLORS.lightGray } },
          };
        }
      } else if (rowNumber <= 4) {
        // Header and title rows - limit to 8 columns
        for (let colNum = 1; colNum <= 8; colNum++) {
          const cell = row.getCell(colNum);
          if (!cell.border) {
            cell.border = {
              top: { style: 'thin', color: { argb: COLORS.lightGray } },
              left: { style: 'thin', color: { argb: COLORS.lightGray } },
              bottom: { style: 'thin', color: { argb: COLORS.lightGray } },
              right: { style: 'thin', color: { argb: COLORS.lightGray } },
            };
          }
        }
      }
    }

    recordsSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];

    // Explicitly set the print area to prevent extra columns
    recordsSheet.pageSetup.printArea = 'A1:H' + (records.length + 4);

    // Raw Data Sheet (Establishment)
    rawDataSheet.mergeCells('A1:E1');
    const rawTitle = rawDataSheet.getCell('A1');
    rawTitle.value = '🗄️ RAW DATA (Technical Reference)';
    rawTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    rawTitle.font = { size: 14, bold: true, color: { argb: COLORS.white } };
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
      color: { argb: COLORS.gray },
    };
    rawDataSheet.addRow([]);

    const allKeys = Object.keys(records[0] || {}).filter(
      (key) => !key.startsWith('__') && key !== '_V'
    );
    const rawHeaders = rawDataSheet.addRow(allKeys);
    rawHeaders.height = 25;
    // Apply styling only to columns with data to prevent horizontal bleeding
    for (let colNum = 1; colNum <= allKeys.length; colNum++) {
      const cell = rawHeaders.getCell(colNum);
      cell.font = { bold: true, color: { argb: COLORS.white } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF546E7A' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }

    records.forEach((r) => {
      const rowData = allKeys.map((key) => {
        const value = (r as any)[key];
        // Format date fields to be more readable (replace T with |)
        if (
          typeof value === 'string' &&
          value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        ) {
          return value.replace('T', ' | ').replace(/\.\d{3}Z?$/, '');
        }
        return value;
      });
      rawDataSheet.addRow(rowData);
    });

    rawDataSheet.columns = allKeys.map(() => ({ width: 20 }));

    // Only style rows with actual data (header at row 5, then data rows) - Establishment
    const lastRawDataRow3 = 5 + records.length;
    const numColumns3 = allKeys.length;

    // Determine which columns to center based on their keys
    const centerAlignKeys3 = [
      'residentStatus',
      'gender',
      'age',
      'isResident',
      'points',
      'contact_number',
    ];
    const centerAlignIndices3 = allKeys
      .map((key, idx) => (centerAlignKeys3.includes(key) ? idx + 1 : -1))
      .filter((idx) => idx > 0);

    for (let rowNumber = 5; rowNumber <= lastRawDataRow3; rowNumber++) {
      const row = rawDataSheet.getRow(rowNumber);
      // Only style columns that have actual data
      for (let colNum = 1; colNum <= numColumns3; colNum++) {
        const cell = row.getCell(colNum);
        // Center align specific columns
        if (centerAlignIndices3.includes(colNum)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        };
      }
    }

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

    await coverSheet.protect(password, protectionOptions);
    await summarySheet.protect(password, protectionOptions);
    await recordsSheet.protect(password, protectionOptions);
    await statisticsSheet.protect(password, protectionOptions);
    await rawDataSheet.protect(password, protectionOptions);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const filename = `Barangay_Talipapa_Establishment_Report_${dayjs().format('YYYY-MM-DD_HHmm')}.xlsx`;
    saveAs(blob, filename);
  } finally {
    if (showLoadingState) showLoadingState(false);
  }
};
