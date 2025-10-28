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
            <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  Trading Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                <div className="space-y-3 sm:space-y-5">
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-[#1b4c2e]/10 to-[#1b4c2e]/5 rounded-lg sm:rounded-xl border-l-4 border-[#1b4c2e] hover:shadow-md transition-shadow duration-200">
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Total Records
                    </span>
                    <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#1b4c2e]">
                      {recordsData?.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-[#2d6b47]/10 to-[#2d6b47]/5 rounded-lg sm:rounded-xl border-l-4 border-[#2d6b47] hover:shadow-md transition-shadow duration-200">
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Records Created Today
                    </span>
                    <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#2d6b47]">
                      {recordsToday?.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-[#3d7b57]/10 to-[#3d7b57]/5 rounded-lg sm:rounded-xl border-l-4 border-[#3d7b57] hover:shadow-md transition-shadow duration-200">
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Total Points
                    </span>
                    <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#3d7b57]">
                      {totalPoints}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top 5 Points Holders with Record IDs */}
            <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                  Top 5 Points Holders
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                <div className="w-full overflow-x-auto">
                  {topLoading ? (
                    <div className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
                      Loading...
                    </div>
                  ) : topList.length > 0 ? (
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b-2 border-[#1b4c2e]/30">
                          <th className="text-left p-2 sm:p-3 font-bold text-[#1b4c2e] text-xs sm:text-base">
                            Rank
                          </th>
                          <th className="text-left p-2 sm:p-3 font-bold text-[#1b4c2e] text-xs sm:text-base">
                            Record ID
                          </th>
                          <th className="text-left p-2 sm:p-3 font-bold text-[#1b4c2e] text-xs sm:text-base">
                            Name
                          </th>
                          <th className="text-right p-2 sm:p-3 font-bold text-[#1b4c2e] text-xs sm:text-base">
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
                              <td className="p-2 sm:p-3">
                                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#1b4c2e] text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-lg">
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="p-2 sm:p-3">
                                <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white shadow-md">
                                  {holder.recordId}
                                </span>
                              </td>
                              <td className="p-2 sm:p-3 text-gray-800 font-semibold text-xs sm:text-sm">
                                <div
                                  className="truncate max-w-[120px] sm:max-w-none"
                                  title={`${holder.firstName} ${holder.middleName ? holder.middleName + ' ' : ''}${holder.lastName}`}
                                >
                                  {holder.firstName}{' '}
                                  {holder.middleName
                                    ? holder.middleName + ' '
                                    : ''}
                                  {holder.lastName}
                                </div>
                              </td>
                              <td className="p-2 sm:p-3 text-right">
                                <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#1b4c2e]/20 to-[#1b4c2e]/10 text-[#1b4c2e] border border-[#1b4c2e]/30">
                                  {points} pts
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
                      No records found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
