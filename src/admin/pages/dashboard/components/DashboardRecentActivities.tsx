import useFetchData from '@/admin/hooks/useFetchData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import dayjs from 'dayjs';
import { Activity } from 'lucide-react';

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

const DashboardRecentActivities = () => {

  const { data: recentActivities, loading: recentActivitiesLoading, error: recentActivitiesErr, refetch } = useFetchData<LogsApiResponse>(`/logs?limit=5`);

  if(!recentActivities) return null;

  return (
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
          {recentActivities?.data.map((activity) => (
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
                  {activity.description}
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
              {recentActivities?.data.map((activity) => (
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
                    {activity.description}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 lg:px-5 text-gray-700 font-medium text-right">
                    {dayjs(activity.created_at).format('MMM D, YYYY h:mm A')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRecentActivities;
