import React, { useMemo } from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  Award,
  Logs,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import { TradingStatisticsSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';
import { useToast } from '@/hooks/useToast';
import dayjs from 'dayjs';

declare const jsPDF: any;

export default function TradingStatisticsPage() {
  const { data, loading, error } = useFetchData(
    '/logs?category=RECORD%20MANAGEMENT'
  );

  // Fetch top 5 points holders using the working endpoint
  const { data: recordsData, loading: topLoading } = useFetchData('/records');

  const { data: logsData, loading: logsDataLoading } = useFetchData(
    '/logs?category=RECORD%20MANAGEMENT&action=UPDATE%20RECORD&limit=5'
  );

  const recordsToday = useMemo(() => {
    return recordsData?.filter((rec) =>
      dayjs(rec?.createdAt).isSame(dayjs(), 'day')
    );
  }, [recordsData]);

  const totalPoints = useMemo(() => {
    return recordsData?.reduce((acc, cur) => cur?.points + acc, 0);
  }, [recordsData]);

  // Process and sort to get top 5 points holders with Record IDs
  const topList = React.useMemo(() => {
    if (!Array.isArray(recordsData)) return [];
    return [...recordsData]
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 5)
      .map((holder: any, index: number) => ({
        ...holder,
        recordId: holder._id,
      }));
  }, [recordsData]);

  // Show loading skeleton while loading
  if (loading) {
    return <TradingStatisticsSkeleton />;
  }

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
      const { error: showError } = useToast();
      showError('Failed to generate PDF report. Please try again.', { title: 'Export' });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-[#e8f5e9] via-white to-[#e8f5e9] min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#1b4c2e] flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-[#1b4c2e]" />
            Trading Statistics
          </h1>
          <p className="text-lg text-gray-600 mt-2 font-medium">
            Overview of recent trading activity and metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadPDFReport}
            className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] hover:from-[#2d6b47] hover:to-[#1b4c2e] text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#1b4c2e] focus:ring-offset-2"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border-2 border-[#1b4c2e]/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trading Summary Card */}
              <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="w-6 h-6" />
                    Trading Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#1b4c2e]/10 to-[#1b4c2e]/5 rounded-xl border-l-4 border-[#1b4c2e] hover:shadow-md transition-shadow duration-200">
                      <span className="text-gray-700 font-semibold text-base">
                        Total Records
                      </span>
                      <span className="font-bold text-4xl text-[#1b4c2e]">
                        {recordsData?.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#2d6b47]/10 to-[#2d6b47]/5 rounded-xl border-l-4 border-[#2d6b47] hover:shadow-md transition-shadow duration-200">
                      <span className="text-gray-700 font-semibold text-base">
                        Records Created Today
                      </span>
                      <span className="font-bold text-4xl text-[#2d6b47]">
                        {recordsToday?.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#3d7b57]/10 to-[#3d7b57]/5 rounded-xl border-l-4 border-[#3d7b57] hover:shadow-md transition-shadow duration-200">
                      <span className="text-gray-700 font-semibold text-base">
                        Total Points
                      </span>
                      <span className="font-bold text-4xl text-[#3d7b57]">
                        {totalPoints}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top 5 Points Holders with Record IDs */}
              <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="w-6 h-6" />
                    Top 5 Points Holders
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <div className="w-full overflow-x-auto">
                    {topLoading ? (
                      <div className="text-sm text-gray-500 text-center py-8">
                        Loading...
                      </div>
                    ) : topList.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-[#1b4c2e]/30">
                            <th className="text-left p-3 font-bold text-[#1b4c2e] text-base">
                              Rank
                            </th>
                            <th className="text-left p-3 font-bold text-[#1b4c2e] text-base">
                              Record ID
                            </th>
                            <th className="text-left p-3 font-bold text-[#1b4c2e] text-base">
                              Name
                            </th>
                            <th className="text-right p-3 font-bold text-[#1b4c2e] text-base">
                              Points
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {topList.map((holder: any, idx: number) => {
                            const points = holder.points || 0;
                            return (
                              <tr
                                key={holder._id || idx}
                                className="border-b border-gray-200 hover:bg-[#1b4c2e]/5 transition-colors duration-200"
                              >
                                <td className="p-3">
                                  <span className="w-8 h-8 rounded-full bg-[#1b4c2e] text-white font-bold flex items-center justify-center text-sm shadow-lg">
                                    {idx + 1}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white shadow-md">
                                    {holder.recordId}
                                  </span>
                                </td>
                                <td className="p-3 text-gray-800 font-semibold">
                                  {holder.firstName}{' '}
                                  {holder.middleName
                                    ? holder.middleName + ' '
                                    : ''}
                                  {holder.lastName}
                                </td>
                                <td className="p-3 text-right">
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-[#1b4c2e]/20 to-[#1b4c2e]/10 text-[#1b4c2e] border border-[#1b4c2e]/30">
                                    {points} pts
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-8">
                        No records found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions Table */}
              <Card className="lg:col-span-2 border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="w-6 h-6" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm min-w-[500px]">
                      <thead>
                        <tr className="border-b-2 border-[#1b4c2e]/30">
                          <th className="text-left p-4 font-bold text-[#1b4c2e] text-base">
                            Time
                          </th>
                          <th className="text-left p-4 font-bold text-[#1b4c2e] text-base">
                            User
                          </th>
                          <th className="text-left p-4 font-bold text-[#1b4c2e] text-base">
                            Description
                          </th>
                          <th className="text-left p-4 font-bold text-[#1b4c2e] text-base">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsData?.data.map((log) => (
                          <tr key={log?._id} className="border-b border-gray-200 hover:bg-[#1b4c2e]/5 transition-colors duration-200">
                            <td className="p-4 text-gray-700 font-medium">
                              {dayjs(log?.created_at).format('MMM/DD/YYYY - h:mm A')}
                            </td>
                            <td className="p-4 text-gray-800 font-semibold">
                              {log?.targetName}
                            </td>
                            <td className="p-4 text-gray-600">
                              {log?.title}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-[#1b4c2e]/20 to-[#1b4c2e]/10 text-[#1b4c2e] border border-[#1b4c2e]/30">
                                {log?.details?.pointsDeducted ? log?.details?.pointsDeducted : log?.details?.pointsAdded ? log?.details?.pointsAdded : ''}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {/* <tr className="border-b border-gray-200 hover:bg-[#1b4c2e]/5 transition-colors duration-200">
                          <td className="p-4 text-gray-700 font-medium">
                            09:30 AM
                          </td>
                          <td className="p-4 text-gray-800 font-semibold">
                            Maria Cruz
                          </td>
                          <td className="p-4 text-gray-600">Cardboard</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-[#1b4c2e]/20 to-[#1b4c2e]/10 text-[#1b4c2e] border border-[#1b4c2e]/30">
                              +40 pts
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-[#1b4c2e]/5 transition-colors duration-200">
                          <td className="p-4 text-gray-700 font-medium">
                            09:45 AM
                          </td>
                          <td className="p-4 text-gray-800 font-semibold">
                            Pedro Garcia
                          </td>
                          <td className="p-4 text-gray-600">
                            Glass Containers
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-[#1b4c2e]/20 to-[#1b4c2e]/10 text-[#1b4c2e] border border-[#1b4c2e]/30">
                              +18 pts
                            </span>
                          </td>
                        </tr> */}
                      </tbody>
                    </table>
                    <div className="block sm:hidden text-xs text-gray-400 mt-3 text-center">
                      Swipe left/right to see more columns
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
