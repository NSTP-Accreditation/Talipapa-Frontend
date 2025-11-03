import useFetchData from '@/admin/hooks/useFetchData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Trophy } from 'lucide-react';
import dayjs from 'dayjs';

interface Achievements {
  title: string;
  description: string;
  createdAt: string;
}

const DashboardAchievements = () => {
  const {
    data: achievementsData,
    loading: achievementsLoading,
    error: achievementsErr,
    refetch,
  } = useFetchData<Achievements[]>(`/achievements`);

  if (!achievementsData) return null;

  return (
    <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 to-white border-b-2 border-green-100">
        <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span>Achievements</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 ml-11 sm:ml-14">
          Barangay milestones and accomplishments
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card Layout */}
        <div className="sm:hidden">
          {achievementsData.map((achievement, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-0 p-4"
            >
              <div className="flex justify-between items-start gap-3 mb-2">
                <div className="font-bold text-gray-900 text-sm flex-1 line-clamp-2">
                  {achievement.title}
                </div>
                <div className="text-xs text-gray-600 font-medium flex-shrink-0 whitespace-nowrap">
                  {dayjs(achievement.createdAt).format('MMM D, YYYY')}
                </div>
              </div>
              <div className="text-gray-700 font-medium text-xs leading-relaxed">
                {achievement.description}
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
                  Title
                </th>
                <th className="py-3 px-4 lg:px-6 font-bold text-left text-gray-800">
                  Description
                </th>
                <th className="py-3 px-4 lg:px-6 font-bold text-center text-gray-800 whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {achievementsData.map((achievement, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-0 hover:bg-green-50/50 transition-colors"
                >
                  <td className="py-3 px-4 lg:px-6 font-semibold text-gray-900">
                    {achievement.title}
                  </td>
                  <td className="py-3 px-4 lg:px-6 text-gray-700 font-medium">
                    {achievement.description}
                  </td>
                  <td className="py-3 px-4 lg:px-6 text-center text-gray-600 font-medium whitespace-nowrap">
                    {dayjs(achievement.createdAt).format('MMM D, YYYY')}
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

export default DashboardAchievements;
