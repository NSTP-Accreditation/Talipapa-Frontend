import React, { useEffect, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import {
  Users,
  SquareMousePointer,
  FileText,
  Eye,
  Trophy,
  Activity,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { DashboardSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

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

interface LogsApiResponse {
  success: boolean;
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: LogEntry[];
}

interface Achievements {
  title: string;
  description: string;
  createdAt: string;
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

const Dashboard: React.FC = () => {
  // Add loading state with 1 second display
  const { isLoading } = useLoadingState(1000);
  const {
    data: logsData,
    loading,
    error,
  } = useFetchData<LogsApiResponse>(`/logs?limit=5`);

  const {
    data: recordsData,
    loading: recordsLoading,
    error: recordsError,
  } = useFetchData<User[]>(`/records`);

  const {
    data: visitLogs,
    loading: visitLoading,
    error: visitErrors,
  } = useFetchData<LogEntry[]>(
    `/logs/all?category=AUTHENTICATION&action=LOGIN`
  );

  const {
    data: achievements,
    loading: achievementsLoading,
    error: achievementsError,
  } = useFetchData<Achievements[]>(`/achievements`);

  const calculatePercentageChange = (
    current: number,
    previous: number
  ): string => {
    if (previous === 0) {
      return current > 0 ? '+100%' : '0%';
    }

    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
  };

  const dashboardData = useMemo(() => {
    const totalRecords = recordsData?.length || 0;

    const lastMonthRecordCount = recordsData.filter((record) => dayjs(record.createdAt).isSame(dayjs().subtract(1, 'month'), 'month')).length;

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

    const recentActivity = logsData?.data || [];
    const recentAchievements = achievements?.slice(0, 5) || [];

    const todaysVisitsChange = calculatePercentageChange(
      todaysVisits,
      yesterdaysVisits
    );
    const totalVisitsChange = calculatePercentageChange(
      totalVisits,
      lastMonthTotalVisits
    );
    const totalRecordsChange = calculatePercentageChange(
      totalRecords,
      lastMonthRecordCount
    );

    return {
      totalRecords,
      todaysVisits,
      totalVisits,
      recentActivity,
      recentAchievements,
      todaysVisitsChange,
      totalVisitsChange,
      totalRecordsChange,
    };
  }, [recordsData, visitLogs, logsData, achievements]);

  // Show loading skeleton while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-green-600" />
            Dashboard
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Overview of your Barangay Information System
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Visits Card */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-gray-800">
              Today's Visits
            </CardTitle>
            <Eye className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dashboardData.todaysVisits}
            </div>
            <p
              className={`text-xs ${dashboardData.todaysVisitsChange.includes('+') ? 'text-blue-600' : 'text-red-600'}`}
            >
              {dashboardData.todaysVisitsChange} from yesterday
            </p>
          </CardContent>
        </Card>

        {/* Total Visits Card */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-gray-800">
              Total Visits
            </CardTitle>
            <SquareMousePointer className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dashboardData.totalVisits}
            </div>
            <p
              className={`text-xs ${dashboardData.totalVisitsChange.includes('+') ? 'text-blue-600' : 'text-red-600'}`}
            >
              {dashboardData.totalVisitsChange} from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Users Card */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-gray-800">
              Total Records
            </CardTitle>
            <Users className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dashboardData.totalRecords}
            </div>
            <p className="text-xs text-blue-600">{dashboardData.totalRecordsChange} from last month</p>
          </CardContent>
        </Card>

        {/* Placeholder Card */}
        <Card className="border border-orange-200 shadow-md hover:shadow-lg transition-shadow bg-orange-50 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-orange-700">
              Coming Soon
            </CardTitle>
            <FileText className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <TrendingUp className="w-8 h-8 text-orange-600 mb-1" />
            <p className="text-xs text-orange-700 font-medium">
              Feature in development
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Recent Activity and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Activity */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl overflow-x-auto">
          <CardHeader className="px-4 sm:px-6 py-4 pb-3 flex flex-row items-center gap-2 border-b border-gray-200">
            <Activity className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg font-bold text-gray-800">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-[400px] w-full text-sm">
                <thead>
                  <tr className="bg-green-50">
                    <th className="py-3 px-3 sm:px-5 font-bold text-left text-gray-700">
                      Action
                    </th>
                    <th className="py-3 px-3 sm:px-5 font-bold text-left text-gray-700">
                      Category
                    </th>
                    <th className="py-3 px-3 sm:px-5 font-bold text-right text-gray-700">
                      Description
                    </th>
                    <th className="py-3 px-3 sm:px-5 font-bold text-right text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentActivity.map((activity) => (
                    <tr
                      key={activity._id}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <td className="py-3 px-3 sm:px-5 font-semibold text-gray-900">
                        {activity.action}
                      </td>
                      <td className="py-3 px-3 sm:px-5 text-blue-600 font-medium">
                        {activity.category}
                      </td>
                      <td className="py-3 px-3 sm:px-5 font-bold text-gray-900 text-right">
                        {activity.description} pts
                      </td>
                      <td className="py-3 px-3 sm:px-5 text-gray-700 font-medium text-right">
                        {dayjs(activity.created_at).format(
                          'MMM D, YYYY h:mm A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl overflow-x-auto gap-0">
          <CardHeader className="px-4 sm:px-6 py-4 pb-3 flex flex-row items-center gap-2 border-b border-gray-200">
            <Trophy className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg font-bold text-gray-800">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-[400px] w-full text-sm">
                <thead>
                  <tr className="bg-green-50">
                    <th className="py-3 px-3 sm:px-5 font-bold text-left text-gray-700">
                      Title
                    </th>
                    <th className="py-3 px-3 sm:px-5 font-bold text-left text-gray-700">
                      Description
                    </th>
                    <th className="py-3 px-3 sm:px-5 font-bold text-center text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentAchievements.map(
                    (achievement, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 last:border-0"
                      >
                        <td className="py-3 px-3 sm:px-5 font-semibold text-gray-900">
                          {achievement.title}
                        </td>
                        <td className="py-3 px-3 sm:px-5 text-gray-700 font-medium">
                          {achievement.description}
                        </td>
                        <td className="py-3 px-3 sm:px-5 text-center">
                          {achievement.createdAt}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
