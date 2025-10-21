import React from 'react';
import { BarChart3, Download } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import { TradingStatisticsSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';

export default function TradingStatisticsPage() {
  // Add loading state with 1 second display
  // const { isLoading } = useLoadingState(1000);

  const { data, loading, error } = useFetchData(
    '/logs?category=RECORD%20MANAGEMENT'
  );

  // Show loading skeleton while loading
  if (loading) {
    return <TradingStatisticsSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-green-600" />
            Trading Statistics
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            Overview of recent trading activity and metrics
          </p>
        </div>
        {/* Placeholder for actions (filters/export) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // download report handler
              const downloadReport = async () => {
                if (!data || !Array.isArray(data) || data.length === 0) {
                  alert('No data available to download');
                  return;
                }

                // Build CSV from data (simple flatten)
                const keys = Object.keys(data[0]);
                const csvRows = [keys.join(',')];
                for (const row of data) {
                  const values = keys.map((k) => {
                    const v = row[k];
                    if (v === null || v === undefined) return '';
                    // escape quotes
                    const s = String(v).replace(/"/g, '""');
                    // wrap if contains comma or quote
                    return s.includes(',') || s.includes('"') ? `"${s}"` : s;
                  });
                  csvRows.push(values.join(','));
                }

                const csvString = csvRows.join('\n');
                const blob = new Blob([csvString], {
                  type: 'text/csv;charset=utf-8;',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'trading_statistics_report.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              };
              downloadReport();
            }}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <Download className="w-4 h-4" />
            <span className="pl-1">Download Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Trading Summary</CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-20rem)] lg:max-h-[740px]">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Trades</span>
                      <span className="font-bold text-2xl text-green-600">
                        24
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Points Distributed</span>
                      <span className="font-bold text-2xl text-blue-600">
                        1,240
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Weight (kg)</span>
                      <span className="font-bold text-2xl text-purple-600">
                        124
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Material Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span>Plastic Bottles</span>
                      <span className="font-medium">45 kg</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span>Cardboard</span>
                      <span className="font-medium">32 kg</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span>Glass Containers</span>
                      <span className="font-medium">28 kg</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span>Metal Cans</span>
                      <span className="font-medium">19 kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto sm:overflow-visible">
                    <table className="w-full text-sm min-w-[600px] sm:min-w-0">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Time</th>
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Material</th>
                          <th className="text-left p-2">Weight</th>
                          <th className="text-left p-2">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">09:15 AM</td>
                          <td className="p-2">Juan Santos</td>
                          <td className="p-2">Plastic Bottles</td>
                          <td className="p-2">2.5 kg</td>
                          <td className="p-2 text-green-600">+25 pts</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">09:30 AM</td>
                          <td className="p-2">Maria Cruz</td>
                          <td className="p-2">Cardboard</td>
                          <td className="p-2">4.0 kg</td>
                          <td className="p-2 text-green-600">+40 pts</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">09:45 AM</td>
                          <td className="p-2">Pedro Garcia</td>
                          <td className="p-2">Glass Containers</td>
                          <td className="p-2">1.8 kg</td>
                          <td className="p-2 text-green-600">+18 pts</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="block sm:hidden text-xs text-gray-400 mt-2 text-center">
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
