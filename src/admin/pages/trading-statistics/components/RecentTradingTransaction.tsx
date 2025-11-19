import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Users } from 'lucide-react';
import { TradingStatisticsProps } from '../TradingStatistics.types';
import dayjs from 'dayjs';

const RecentTradingTransaction = ({ logsData }: TradingStatisticsProps) => {
  return (
    <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#1b4c2e]/30">
                <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                  Time
                </th>
                <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                  User
                </th>
                <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                  Description
                </th>
                <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {logsData?.data.map((log) => (
                <tr
                  key={log?._id}
                  className="border-b border-gray-200 hover:bg-[#1b4c2e]/5 transition-colors duration-200"
                >
                  <td className="p-2 sm:p-4 text-gray-700 font-medium text-xs sm:text-sm">
                    <div className="whitespace-nowrap">
                      {dayjs(log?.created_at).format('MMM/DD/YY - h:mm A')}
                    </div>
                  </td>
                  <td className="p-2 sm:p-4 text-gray-800 font-semibold text-xs sm:text-sm">
                    <div
                      className="truncate max-w-[100px] sm:max-w-none"
                      title={log?.targetName}
                    >
                      {log?.targetName}
                    </div>
                  </td>
                  <td className="p-2 sm:p-4 text-gray-600 text-xs sm:text-sm">
                    <div
                      className="truncate max-w-[120px] sm:max-w-none"
                      title={log?.title}
                    >
                      {log?.title}
                    </div>
                  </td>
                  <td className="p-2 sm:p-4">
                    <span className="inline-flex items-center px-2 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#1b4c2e]/20 to-[#1b4c2e]/10 text-[#1b4c2e] border border-[#1b4c2e]/30 whitespace-nowrap">
                      {log?.details?.pointsDeducted
                        ? log?.details?.pointsDeducted
                        : log?.details?.pointsAdded
                          ? log?.details?.pointsAdded
                          : log?.details?.newPoints}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="block sm:hidden text-xs text-gray-400 mt-2 sm:mt-3 text-center">
            Swipe left/right to see more columns
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTradingTransaction;
