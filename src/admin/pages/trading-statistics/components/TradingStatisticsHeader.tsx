import { useToast } from '@/hooks/useToast';
import dayjs from 'dayjs';
import { BarChart3, Download, Calendar, X } from 'lucide-react';
import { TradingStatisticsProps } from '../TradingStatistics.types';
import { useState } from 'react';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { createPortal } from 'react-dom';

const TradingStatisticsHeader = ({
  recordsData,
  logsData,
  recordsToday,
  totalPoints,
  topList,
}: TradingStatisticsProps) => {
  const { error: showError, success } = useToast();
  const authFetch = useAuthFetch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadSpecificDateReport = async () => {
    if (!selectedDate) {
      showError('Please select a date first', { title: 'Error' });
      return;
    }

    setIsGenerating(true);

    try {
      // Fetch logs for the specific date
      const startOfDay = dayjs(selectedDate).startOf('day').toISOString();
      const endOfDay = dayjs(selectedDate).endOf('day').toISOString();

      const logsResponse = await authFetch(
        `/logs?category=RECORD%20MANAGEMENT&action=UPDATE%20RECORD&startDate=${startOfDay}&endDate=${endOfDay}&limit=1000`
      );

      // Fetch materials data to get material names
      const materialsResponse = await authFetch('/materials');
      const materials = materialsResponse || [];

      // Fetch products data
      const productsResponse = await authFetch('/products');
      const products = productsResponse || [];

      const dateLogsData = logsResponse?.data || [];

      // Process material trading data
      const materialStats: any = {};
      let totalPointsAdded = 0;
      let totalPointsDeducted = 0;
      let totalTransactions = dateLogsData.length;

      dateLogsData.forEach((log: any) => {
        // Count points
        if (log.details?.pointsAdded) {
          totalPointsAdded += log.details.pointsAdded;
        }
        if (log.details?.pointsDeducted) {
          totalPointsDeducted += log.details.pointsDeducted;
        }

        // Process material trading (points added = materials traded in)
        if (log.details?.pointsAdded && log.details?.materials) {
          log.details.materials.forEach((mat: any) => {
            const materialName = mat.name || 'Unknown Material';
            const weight = parseFloat(mat.weight) || 0;

            if (!materialStats[materialName]) {
              materialStats[materialName] = {
                totalKg: 0,
                pointsPerKg: mat.pointsPerKg || 0,
              };
            }
            materialStats[materialName].totalKg += weight;
          });
        }
      });

      // Generate PDF
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Trading Statistics Report', 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Date: ${dayjs(selectedDate).format('MMMM DD, YYYY')}`, 20, 35);
      doc.text(
        `Generated: ${dayjs().format('MMMM DD, YYYY - h:mm A')}`,
        20,
        42
      );

      let yPosition = 55;

      // Daily Summary Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Daily Summary', 20, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Total Transactions: ${totalTransactions}`, 20, yPosition);
      yPosition += 8;
      doc.text(
        `Total Points Added (Materials Traded In): ${totalPointsAdded}`,
        20,
        yPosition
      );
      yPosition += 8;
      doc.text(
        `Total Points Deducted (Products Traded Out): ${totalPointsDeducted}`,
        20,
        yPosition
      );
      yPosition += 8;
      doc.text(
        `Net Points Flow: ${totalPointsAdded - totalPointsDeducted}`,
        20,
        yPosition
      );
      yPosition += 20;

      // Materials Traded Summary
      const materialEntries = Object.entries(materialStats);
      if (materialEntries.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Materials Traded (Inflow)', 20, yPosition);
        yPosition += 15;

        const materialTableData = materialEntries.map(
          ([name, stats]: [string, any]) => [
            name,
            `${stats.totalKg.toFixed(2)} kg`,
            `${stats.pointsPerKg} pts/kg`,
            `${(stats.totalKg * stats.pointsPerKg).toFixed(0)} pts`,
          ]
        );

        autoTable(doc, {
          head: [['Material Type', 'Weight (kg)', 'Points/kg', 'Total Points']],
          body: materialTableData,
          startY: yPosition,
          theme: 'grid',
          headStyles: {
            fillColor: [27, 76, 46],
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: 10,
            textColor: [0, 0, 0],
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(11);
        doc.text('No materials traded on this date.', 20, yPosition);
        yPosition += 20;
      }

      // Products Trading Statistics (Outflow)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Product Trading Statistics (Outflow)', 20, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(
        `Total products redeemed: ${totalPointsDeducted > 0 ? 'Yes' : 'No'}`,
        20,
        yPosition
      );
      yPosition += 8;
      doc.text(
        `Points used for products: ${totalPointsDeducted} pts`,
        20,
        yPosition
      );
      yPosition += 20;

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Transactions Detail Section
      if (dateLogsData.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Transaction Details', 20, yPosition);
        yPosition += 15;

        const transactionData = dateLogsData
          .slice(0, 20)
          .map((log: any) => [
            `${dayjs(log?.created_at).format('h:mm A')}`,
            `${log?.targetName || 'N/A'}`,
            `${log?.title || 'N/A'}`,
            `${log?.details?.pointsAdded ? '+' + log?.details?.pointsAdded : log?.details?.pointsDeducted ? '-' + log?.details?.pointsDeducted : '0'} pts`,
          ]);

        autoTable(doc, {
          head: [['Time', 'User', 'Description', 'Points']],
          body: transactionData,
          startY: yPosition,
          theme: 'grid',
          headStyles: {
            fillColor: [27, 76, 46],
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: 10,
            textColor: [0, 0, 0],
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          margin: { left: 20, right: 20 },
        });
      }

      // Save the PDF
      doc.save(
        `trading_report_${dayjs(selectedDate).format('YYYY-MM-DD')}.pdf`
      );

      success(
        `Report for ${dayjs(selectedDate).format('MMMM DD, YYYY')} downloaded successfully!`,
        {
          title: 'Success',
        }
      );

      setShowDatePicker(false);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      showError('Failed to generate PDF report. Please try again.', {
        title: 'Error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDFReport = async () => {
    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Trading Statistics Report', 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);

      let yPosition = 50;

      // Summary Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Summary', 20, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Total Records: ${recordsData?.length}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Records Created Today: ${recordsToday?.length}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Total Points: ${totalPoints}`, 20, yPosition);
      yPosition += 20;

      // Top 5 Points Holders Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Top 5 Points Holders', 20, yPosition);
      yPosition += 15;

      const tableData = topList.map((holder: any, idx: number) => [
        idx + 1,
        holder.recordId,
        `${holder.firstName} ${holder.middleName ? holder.middleName + ' ' : ''}${holder.lastName}`,
        `${holder.points || 0} pts`,
      ]);

      autoTable(doc, {
        head: [['Rank', 'Record ID', 'Name', 'Points']],
        body: tableData,
        startY: yPosition,
        theme: 'grid',
        headStyles: {
          fillColor: [27, 76, 46],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 11,
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { left: 20, right: 20 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // Recent Transactions Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Recent Transactions', 20, yPosition);
      yPosition += 15;

      const transactionData = logsData?.data.map((log) => [
        `${dayjs(log?.created_at).format('MMM/DD/YYYY - h:mm A')}`,
        `${log?.targetName}`,
        `${log?.title}`,
        `${log?.details?.pointsDeducted ? log?.details?.pointsDeducted : log?.details?.pointsAdded ? log?.details?.pointsAdded : ''} `,
      ]);

      autoTable(doc, {
        head: [['Time', 'User', 'Description', 'Points']],
        body: transactionData,
        startY: yPosition,
        theme: 'grid',
        headStyles: {
          fillColor: [27, 76, 46],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 11,
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { left: 20, right: 20 },
      });

      doc.save(
        `trading_statistics_${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (err) {
      console.error('Error generating PDF report:', err);
      showError('Failed to generate PDF report. Please try again.', {
        title: 'Export',
      });
    }
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b4c2e] flex items-center gap-2 sm:gap-3">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#1b4c2e]" />
            Trading Statistics
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2 font-medium">
            Overview of recent trading activity and metrics
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowDatePicker(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Date Report</span>
            <span className="xs:hidden">Date</span>
          </button>
          <button
            onClick={downloadPDFReport}
            className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] hover:from-[#2d6b47] hover:to-[#1b4c2e] text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:ring-offset-2"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Full Report</span>
            <span className="xs:hidden">PDF</span>
          </button>
        </div>
      </header>

      {/* Date Picker Modal */}
      {showDatePicker &&
        createPortal(
          <div className="fixed inset-0 z-[1005] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">
                    Select Date for Report
                  </h2>
                </div>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Choose Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={dayjs().format('YYYY-MM-DD')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b4c2e] focus:border-transparent transition-all text-base"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Select a date to generate a detailed trading report
                    including materials traded, products redeemed, and
                    transaction summary.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2 text-sm">
                    Report will include:
                  </h3>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>
                        Material trading summary (kg per material type)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Product trading statistics (inflow & outflow)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Points added and deducted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Transaction details for the selected date</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={downloadSpecificDateReport}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] hover:from-[#2d6b47] hover:to-[#1b4c2e] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TradingStatisticsHeader;
