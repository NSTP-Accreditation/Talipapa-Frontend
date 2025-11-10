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
import { useRBAC } from '@/hooks/useRBAC';
import { Permission } from '@/types/rbac.types';

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
  const { hasPermission } = useRBAC();

  // Only fetch data if user has permissions
  const canViewLogs = hasPermission(Permission.VIEW_ACTIVITY_LOGS);
  const canViewRecords = hasPermission(Permission.VIEW_RECORDS);

  const { data: visitLogs } = useFetchData<LogEntry[]>(
    canViewLogs ? `/logs/all?category=AUTHENTICATION&action=LOGIN` : null
  );
  const { data: recordsData } = useFetchData<User[]>(
    canViewRecords ? `/records` : null
  );

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
      {/* Today's Visits Card - Only for users with VIEW_ACTIVITY_LOGS permission */}
      {canViewLogs && (
        <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-green-50 rounded-2xl overflow-hidden hover:border-green-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6 bg-gradient-to-r from-green-50/50 to-transparent">
            <CardTitle className="text-xs sm:text-sm font-bold text-gray-800">
              Today's Visits
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors w-fit">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {dashboardData.todaysVisits}
            </div>
            <p
              className={`text-[10px] sm:text-xs font-semibold ${dashboardData.todaysVisitsChange.includes('+') ? 'text-green-600' : 'text-red-600'}`}
            >
              {dashboardData.todaysVisitsChange} from yesterday
            </p>
          </CardContent>
        </Card>
      )}

      {/* Total Visits Card - Only for users with VIEW_ACTIVITY_LOGS permission */}
      {canViewLogs && (
        <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden hover:border-blue-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6 bg-gradient-to-r from-blue-50/50 to-transparent">
            <CardTitle className="text-xs sm:text-sm font-bold text-gray-800">
              Total Visits
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors w-fit">
              <SquareMousePointer className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {dashboardData.totalVisits}
            </div>
            <p
              className={`text-[10px] sm:text-xs font-semibold ${dashboardData.totalVisitsChange.includes('+') ? 'text-green-600' : 'text-red-600'}`}
            >
              {dashboardData.totalVisitsChange} from last month
            </p>
          </CardContent>
        </Card>
      )}

      {/* Total Records Card - Only for users with VIEW_RECORDS permission */}
      {canViewRecords && (
        <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-purple-50 rounded-2xl overflow-hidden hover:border-purple-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6 bg-gradient-to-r from-purple-50/50 to-transparent">
            <CardTitle className="text-xs sm:text-sm font-bold text-gray-800">
              Total Records
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors w-fit">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {dashboardData.totalRecords}
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-green-600">
              {dashboardData.totalRecordsChange} from last month
            </p>
          </CardContent>
        </Card>
      )}

      {/* Placeholder Card - visible to all */}
      <Card className="border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl overflow-hidden hover:border-orange-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6 bg-gradient-to-r from-orange-100/50 to-transparent">
          <CardTitle className="text-xs sm:text-sm font-bold text-orange-700">
            Coming Soon
          </CardTitle>
          <div className="p-2 rounded-lg bg-orange-200 group-hover:bg-orange-300 transition-colors w-fit">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-orange-600" />
          </div>
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
