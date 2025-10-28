import { Button } from '@/components/ui';
import { Download, UserRoundPen } from 'lucide-react';
import { RecordInterface } from '../Record.types';
import { useToast } from '@/hooks/useToast';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction } from 'react';

type RecordHeaderProps = {
  recordsData: RecordInterface[]
  setOpenAddRecordModal: Dispatch<SetStateAction<boolean>>
}

const RecordHeader = ({ recordsData, setOpenAddRecordModal } : RecordHeaderProps ) => {

  const handleExportToExcel = async () => {
    const { error: showError } = useToast();

    if (!recordsData || recordsData.length === 0) {
      showError('No records available to export.', { title: 'Export' });
      return;
    }

    // --- Create Workbook & Sheets ---
    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Resident Summary');
    const recordsSheet = workbook.addWorksheet('Resident Records');
    const rawDataSheet = workbook.addWorksheet('Raw Data');

    // --- SUMMARY CALCULATIONS ---
    const totalResidents = recordsData.length;
    const totalPoints = recordsData.reduce((sum, r) => sum + (r.points || 0), 0);
    const avgAge = (
      recordsData.reduce((sum, r) => sum + (Number(r.age) || 0), 0) / totalResidents
    ).toFixed(1);

    const ageGroups = { '0–17': 0, '18–35': 0, '36–59': 0, '60+': 0 };
    recordsData.forEach((r) => {
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

    recordsData.forEach((r, i) => {
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

    const allKeys = Object.keys(recordsData[0] || {});
    rawDataSheet.columns = allKeys.map((key) => ({
      header: key,
      key,
      width: 25,
    }));
    recordsData.forEach((r) => rawDataSheet.addRow(r));

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
