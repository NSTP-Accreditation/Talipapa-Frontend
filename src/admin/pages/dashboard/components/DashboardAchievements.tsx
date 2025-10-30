import useFetchData from '@/admin/hooks/useFetchData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Trophy } from 'lucide-react';

interface Achievements {
  title: string;
  description: string;
  createdAt: string;
}

const DashboardAchievements = () => {

  const { data: achievementsData, loading: achievementsLoading, error: achievementsErr, refetch } = useFetchData<Achievements[]>(`/achievements`);

  if(!achievementsData) return null;

  return (
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
          {achievementsData.map((achievement, index) => (
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
              {achievementsData.map((achievement, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAchievements;
