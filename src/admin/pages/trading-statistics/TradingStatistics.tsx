import { useMemo } from 'react';
import { TradingStatisticsSkeleton } from '../../../components/LoadingSkeletons';
import useFetchData from '../../hooks/useFetchData';
import dayjs from 'dayjs';
import TradingStatisticsHeader from './components/TradingStatisticsHeader';
import {
  LogInterface,
  ProductInterface,
  RecordInterface,
} from '@/types/global.types';
import { PaginationInterface } from '@/types/pagination';
import TradingSummaryCard from './components/TradingSummaryCard';
import Top5RecordCard from './components/Top5RecordCard';
import RecentTradingTransaction from './components/RecentTradingTransaction';
import TotalProductStocksCard from './components/TotalProductStocksCard';

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
            <TradingSummaryCard
              recordsData={recordsData}
              recordsToday={recordsData}
              totalPoints={totalPoints}
            />

            {/* Top 5 Points Holders with Record IDs */}
            <Top5RecordCard topList={topList} topLoading={topLoading} />

            {/* Recent Transactions Table */}
            <RecentTradingTransaction logsData={logsData} />

            {/* Total Stocks/Products (NEW card) */}
            <TotalProductStocksCard />
          </div>
        </div>
      </div>
    </div>
  );
}
