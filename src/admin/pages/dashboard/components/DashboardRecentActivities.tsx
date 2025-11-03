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
  const {
    data: recentActivities,
    loading: recentActivitiesLoading,
    error: recentActivitiesErr,
    refetch,
  } = useFetchData<LogsApiResponse>(`/logs?limit=5`);

  if (!recentActivities) return null;

  return (
    <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 to-white border-b-2 border-green-100">
        <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span>Recent Activity</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 ml-11 sm:ml-14">
          Latest system events and actions
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card Layout */}
        <div className="sm:hidden">
          {recentActivities?.data.map((activity) => (
            <div
              key={activity._id}
              className="p-4 border-b border-gray-200 last:border-0"
            >
              <div className="flex justify-between items-start gap-3 mb-2">
                <span className="text-sm font-bold text-gray-900 flex-1 line-clamp-2">
                  {activity.action}
                </span>
                <span className="text-xs text-gray-600 font-medium flex-shrink-0 whitespace-nowrap">
                  {dayjs(activity.created_at).format('MMM D, YYYY')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded-full inline-block w-fit">
                  {activity.category}
                </span>
                <span className="text-xs font-medium text-gray-700 leading-relaxed">
                  {activity.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-green-50 to-green-100">
                <th className="py-3 px-4 lg:px-6 font-bold text-left text-gray-800">
                  Action
                </th>
                <th className="py-3 px-4 lg:px-6 font-bold text-left text-gray-800">
                  Category
                </th>
                <th className="py-3 px-4 lg:px-6 font-bold text-right text-gray-800">
                  Description
                </th>
                <th className="py-3 px-4 lg:px-6 font-bold text-right text-gray-800 whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentActivities?.data.map((activity) => (
                <tr
                  key={activity._id}
                  className="border-b border-gray-200 last:border-0 hover:bg-green-50/50 transition-colors"
                >
                  <td className="py-3 px-4 lg:px-6 font-semibold text-gray-900">
                    {activity.action}
                  </td>
                  <td className="py-3 px-4 lg:px-6">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap inline-block">
                      {activity.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 lg:px-6 font-bold text-gray-900 text-right">
                    {activity.description}
                  </td>
                  <td className="py-3 px-4 lg:px-6 text-gray-700 font-medium text-right whitespace-nowrap">
                    {dayjs(activity.created_at).format('MMM D, YYYY | h:mm A')}
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
