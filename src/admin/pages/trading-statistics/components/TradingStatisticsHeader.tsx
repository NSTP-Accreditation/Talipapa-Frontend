import { useToast } from '@/hooks/useToast';
import { LogInterface, RecordInterface } from '@/types/global.types';
import { PaginationInterface } from '@/types/pagination';
import dayjs from 'dayjs';
import { BarChart3, Download } from 'lucide-react';

type TradingStatisticsHeaderProps = {
  logsData: PaginationInterface<LogInterface>,
  recordsData: RecordInterface[],
  recordsToday: RecordInterface[],   
  totalPoints: number,
  topList: any[]
  
}

const TradingStatisticsHeader = ({ recordsData, logsData, recordsToday, totalPoints, topList } : TradingStatisticsHeaderProps ) => {

  const { error: showError } = useToast();


  const downloadPDFReport = async () => {
    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF();
      // Now doc.autoTable should work

      // Set font
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);

      // Title
      doc.text('Trading Statistics Report', 20, 25);

      // Date
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

      // Create table data
      const tableData = topList.map((holder: any, idx: number) => [
        idx + 1,
        holder.recordId,
        `${holder.firstName} ${holder.middleName ? holder.middleName + ' ' : ''}${holder.lastName}`,
        `${holder.points || 0} pts`,
      ]);

      // Add table
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
        head: [['Time', 'User', 'Descriptionn', 'Points']],
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

      // Save the PDF
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
          onClick={downloadPDFReport}
          className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] hover:from-[#2d6b47] hover:to-[#1b4c2e] text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:ring-offset-2"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Download PDF</span>
          <span className="xs:hidden">PDF</span>
        </button>
      </div>
    </header>
  );
};

export default TradingStatisticsHeader;
