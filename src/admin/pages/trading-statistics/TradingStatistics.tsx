import { useMemo } from 'react';
import { TrendingUp, Users, Award } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { TradingStatisticsSkeleton } from '../../../components/LoadingSkeletons';
import useFetchData from '../../hooks/useFetchData';
import dayjs from 'dayjs';
import { ImageInt } from '../../components/OfficialsPanel';
import TradingStatisticsHeader from './components/TradingStatisticsHeader';
import {
  LogInterface,
  ProductInteface,
  RecordInterface,
} from '@/types/global.types';
import { PaginationInterface } from '@/types/pagination';
import TradingSummaryCard from './components/TradingSummaryCard';
import Top5Record from './components/Top5Record';

declare const jsPDF: any;

export default function TradingStatisticsPage() {
  const { data, loading, error } = useFetchData(
    '/logs?category=RECORD%20MANAGEMENT'
  );

  const { data: recordsData, loading: topLoading } =
    useFetchData<RecordInterface[]>('/records');

  const { data: logsData, loading: logsDataLoading } = useFetchData<
    PaginationInterface<LogInterface>
  >('/logs?category=RECORD%20MANAGEMENT&action=UPDATE%20RECORD&limit=5');

  const { data: products, loading: loadingProducts } =
    useFetchData<ProductInteface[]>('/products');

  const recordsToday = useMemo(() => {
    return recordsData?.filter((rec) =>
      dayjs(rec?.createdAt).isSame(dayjs(), 'day')
    );
  }, [recordsData]);

  const totalPoints = useMemo(() => {
    return recordsData?.reduce((acc, cur) => cur?.points + acc, 0);
  }, [recordsData]);

  // Process and sort to get top 5 points holders with Record IDs
  const topList = useMemo(() => {
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

  return (
    <div className="p-5">
      {/* Enhanced Header */}
      <TradingStatisticsHeader
        logsData={logsData}
        recordsData={recordsData}
        recordsToday={recordsToday}
        totalPoints={totalPoints}
        topList={topList}
      />

      <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-[#1b4c2e]/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Trading Summary Card */}
            <TradingSummaryCard />

            {/* Top 5 Points Holders with Record IDs */}
            <Top5Record topList={topList} topLoading={topLoading}/>

            {/* Recent Transactions Table */}
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
                              {dayjs(log?.created_at).format(
                                'MMM/DD/YY - h:mm A'
                              )}
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
                                  : ''}
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

            {/* Total Stocks/Products (NEW card) */}
            <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  Total Stocks / Products
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                <div className="w-full overflow-x-auto max-h-96">
                  <table className="w-full text-xs sm:text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b-2 border-[#1b4c2e]/30">
                        <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                          Product Name
                        </th>
                        <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                          Category
                        </th>
                        <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                          Total Stocks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Example row (replace with dynamic data later) */}
                      {products.map((product) => (
                        <tr className="border-b border-gray-200 hover:bg-[#1b4c2e]/5 transition-colors duration-200">
                          <td className="p-2 sm:p-4 text-gray-800 font-semibold text-xs sm:text-sm">
                            {product.name}
                          </td>
                          <td className="p-2 sm:p-4 text-gray-700 text-xs sm:text-sm">
                            {product.category}
                          </td>
                          <td className="p-2 sm:p-4 text-gray-800 font-semibold text-xs sm:text-sm">
                            {product.stocks}
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
          </div>
        </div>
      </div>
    </div>
  );
}
