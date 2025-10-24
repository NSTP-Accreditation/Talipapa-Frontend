import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '../../hooks/useToast';
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
import Login from '../components/Login'; // Import your login form
import { DashboardSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const { isLoading } = useLoadingState(1000);
  const navigate = useNavigate();
  //const location = useLocation();

  const { success, info } = useToast();

  // Show login toast on first load if redirected
  useEffect(() => {
    if (sessionStorage.getItem('loginSuccess') === 'true') {
      success('Login successful!', { title: 'Welcome' });
      sessionStorage.removeItem('loginSuccess');
    }
  }, [success]);

  // Simple logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    info('Logged out successfully!', { title: 'Logged out' });

    setTimeout(() => {
      navigate('/admin/login', { replace: true });
    }, 20); // small delay to allow toast to appear
  };

  // Fetch data
  const { data: logsData } = useFetchData<LogsApiResponse>(`/logs?limit=5`);
  const { data: recordsData } = useFetchData<User[]>(`/records`);
  const { data: visitLogs } = useFetchData<LogEntry[]>(
    `/logs/all?category=AUTHENTICATION&action=LOGIN`
  );
  const { data: achievements } = useFetchData<Achievements[]>(`/achievements`);

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

    const recentActivity = logsData?.data || [];
    const recentAchievements = achievements?.slice(0, 5) || [];

    return {
      totalRecords,
      todaysVisits,
      totalVisits,
      recentActivity,
      recentAchievements,
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
  }, [recordsData, visitLogs, logsData, achievements]);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3 flex items-center gap-2 sm:gap-3">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-600" />
            Dashboard
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium">
            Overview of your Barangay Information System
          </p>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Bottom Section - Recent Activity and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 lg:mt-8">
        {/* Recent Activity */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl overflow-hidden">
          <CardHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 pb-2 sm:pb-3 flex flex-row items-center gap-2 border-b border-gray-200">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <CardTitle className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile Card Layout */}
            <div className="sm:hidden">
              {dashboardData.recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="p-3 border-b border-gray-200 last:border-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-gray-900">
                      {activity.action}
                    </span>
                    <span className="text-xs text-gray-600">
                      {dayjs(activity.created_at).format('MMM D')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                      {activity.category}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {activity.description} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-green-50">
                    <th className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-bold text-left text-gray-700">
                      Action
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-bold text-left text-gray-700">
                      Category
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-bold text-right text-gray-700">
                      Description
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-bold text-right text-gray-700">
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
                      <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-semibold text-gray-900">
                        {activity.action}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 text-blue-600 font-medium">
                        {activity.category}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-bold text-gray-900 text-right">
                        {activity.description} pts
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 text-gray-700 font-medium text-right">
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
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl overflow-hidden">
          <CardHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 pb-2 sm:pb-3 flex flex-row items-center gap-2 border-b border-gray-200">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <CardTitle className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile Card Layout */}
            <div className="sm:hidden">
              {dashboardData.recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-0 p-3"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-semibold text-gray-900 text-xs flex-1 pr-2">
                      {achievement.title}
                    </div>
                    <div className="text-[10px] text-gray-600 flex-shrink-0">
                      {achievement.createdAt}
                    </div>
                  </div>
                  <div className="text-gray-700 font-medium text-[10px] leading-relaxed">
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-green-50">
                    <th className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-bold text-left text-gray-700">
                      Title
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-bold text-left text-gray-700">
                      Description
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-bold text-center text-gray-700">
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
                        <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 font-semibold text-gray-900">
                          {achievement.title}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 text-gray-700 font-medium">
                          {achievement.description}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 text-center">
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
