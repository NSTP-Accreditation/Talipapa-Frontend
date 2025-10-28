import useFetchData from '@/admin/hooks/useFetchData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import dayjs from 'dayjs';
import {
  Eye,
  FileText,
  SquareMousePointer,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';

interface PerformedBy {
  _id: string;
  username: string;
  roles: Record<string, number>;
}

interface LogEntry {
  _id: string;
  action: string;
  title: string;
  description: string;
  category: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  performedBy?: PerformedBy;
  created_at: string;
  __v?: number;
}

interface User {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  age: number;
  points: number;
  createdAt: string;
  updatedAt: string;
}

const DashboardStatCards = () => {
  const { data: visitLogs } = useFetchData<LogEntry[]>(
    `/logs/all?category=AUTHENTICATION&action=LOGIN`
  );
  const { data: recordsData } = useFetchData<User[]>(`/records`);

  const calculatePercentageChange = (
    current: number,
    previous: number
  ): string => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    const cappedChange = Math.min(Math.max(change, -100), 100);
    return `${cappedChange >= 0 ? '+' : ''}${Math.round(cappedChange)}%`;
  };

  const dashboardData = useMemo(() => {
    const totalRecords = recordsData?.length || 0;
    const lastMonthRecordCount = recordsData?.filter((record) =>
      dayjs(record.createdAt).isSame(dayjs().subtract(1, 'month'), 'month')
    ).length;

    const todaysVisits =
      visitLogs?.filter((log) => dayjs(log.created_at).isSame(dayjs(), 'day'))
        .length || 0;
    const yesterdaysVisits =
      visitLogs?.filter((log) =>
        dayjs(log.created_at).isSame(dayjs().subtract(1, 'day'), 'day')
      ).length || 0;

    const totalVisits = visitLogs?.length || 0;
    const lastMonthTotalVisits = visitLogs?.filter((log) =>
      dayjs(log.created_at).isSame(dayjs().subtract(1, 'month'), 'month')
    ).length;

    return {
      totalRecords,
      todaysVisits,
      totalVisits,
      todaysVisitsChange: calculatePercentageChange(
        todaysVisits,
        yesterdaysVisits
      ),
      totalVisitsChange: calculatePercentageChange(
        totalVisits,
        lastMonthTotalVisits
      ),
      totalRecordsChange: calculatePercentageChange(
        totalRecords,
        lastMonthRecordCount
      ),
    };
  }, [recordsData, visitLogs]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {/* Today's Visits Card */}
      <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6">
          <CardTitle className="text-xs sm:text-sm font-bold text-gray-800">
            Today's Visits
          </CardTitle>
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-500" />
        </CardHeader>
        <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            {dashboardData.todaysVisits}
          </div>
          <p
            className={`text-[10px] sm:text-xs ${dashboardData.todaysVisitsChange.includes('+') ? 'text-blue-600' : 'text-red-600'}`}
          >
            {dashboardData.todaysVisitsChange} from yesterday
          </p>
        </CardContent>
      </Card>

      {/* Total Visits Card */}
      <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6">
          <CardTitle className="text-xs sm:text-sm font-bold text-gray-800">
            Total Visits
          </CardTitle>
          <SquareMousePointer className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-500" />
        </CardHeader>
        <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            {dashboardData.totalVisits}
          </div>
          <p
            className={`text-[10px] sm:text-xs ${dashboardData.totalVisitsChange.includes('+') ? 'text-blue-600' : 'text-red-600'}`}
          >
            {dashboardData.totalVisitsChange} from last month
          </p>
        </CardContent>
      </Card>

      {/* Total Users Card */}
      <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6">
          <CardTitle className="text-xs sm:text-sm font-bold text-gray-800">
            Total Records
          </CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-500" />
        </CardHeader>
        <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            {dashboardData.totalRecords}
          </div>
          <p className="text-[10px] sm:text-xs text-blue-600">
            {dashboardData.totalRecordsChange} from last month
          </p>
        </CardContent>
      </Card>

      {/* Placeholder Card */}
      <Card className="border border-orange-200 shadow-md hover:shadow-lg transition-shadow bg-orange-50 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6">
          <CardTitle className="text-xs sm:text-sm font-bold text-orange-700">
            Coming Soon
          </CardTitle>
          <FileText className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-orange-600" />
        </CardHeader>
        <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-600 mb-1" />
          <p className="text-[10px] sm:text-xs text-orange-700 font-medium">
            Feature in development
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatCards;
