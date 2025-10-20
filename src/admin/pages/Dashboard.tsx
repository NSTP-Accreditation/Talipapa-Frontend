import React, { useEffect, useMemo, useState } from 'react';
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
// -------------------- Toast Types & Component --------------------
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const ToastMessage: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => removeToast(toast.id), 4000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, removeToast]);

  const Icon = ({ type }: { type: ToastType }) => {
    switch (type) {
      case 'success':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-80 max-w-full transform transition-all duration-300 shadow-xl rounded-xl overflow-hidden ring-1 ring-black/5
            ${toast.type === 'success' ? 'bg-white' : 'bg-white'}`}
          role="status"
        >
          <div className="flex items-start p-3">
            <div
              className={`flex-shrink-0 rounded-full p-2 mr-3
                ${toast.type === 'success' ? 'bg-green-100 text-green-700' : ''}
                ${toast.type === 'error' ? 'bg-red-100 text-red-700' : ''}
                ${toast.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${toast.type === 'info' ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              <Icon type={toast.type} />
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold mb-0">{toast.title}</p>
              )}
              <p className="text-sm mt-1 break-words text-gray-700">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`h-1 ${toast.type === 'success' ? 'bg-green-500' : ''} ${toast.type === 'error' ? 'bg-red-500' : ''} ${toast.type === 'warning' ? 'bg-yellow-500' : ''} ${toast.type === 'info' ? 'bg-blue-500' : ''}`}
          />
        </div>
      ))}
    </div>
  );
};

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

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = React.useRef<number>(1);

  const addToast = (payload: {
    type?: ToastType;
    title?: string;
    message: string;
  }) => {
    const id = nextIdRef.current++;
    const toast: Toast = {
      id,
      type: payload.type ?? 'info',
      title: payload.title,
      message: payload.message,
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  };

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  // Show login toast on first load if redirected
  useEffect(() => {
    if (sessionStorage.getItem('loginSuccess') === 'true') {
      addToast({ type: 'success', message: 'Login successful!' });
      sessionStorage.removeItem('loginSuccess');
    }
  }, []);

  // Simple logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Handle logout
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000); // hide after 3s
  };
  const handleLogout = () => {
    logout();
    showToast('Logged out successfully!');

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
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <ToastMessage toasts={toasts} removeToast={removeToast} />
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
            <p className="text-xs text-blue-600">
              {dashboardData.totalRecordsChange} from last month
            </p>
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
