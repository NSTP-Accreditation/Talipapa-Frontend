import React, { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import {
  BarChart3,
} from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import ResponsiveSkeleton from '../../components/ResponsiveSkeleton';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import DashboardStatCards from './dashboard/DashboardStatCards';
import DashboardRecentActivities from './dashboard/DashboardRecentActivities';
import DashboardAchievements from './dashboard/DashboardAchievements';
dayjs.extend(isBetween);

const Dashboard: React.FC = () => {
  const { isLoading } = useLoadingState(1000);

  const { success } = useToast();

  // Show login toast on first load if redirected
  useEffect(() => {
    success('Login successful!', { title: 'Welcome' });
  }, []);

  if (isLoading) return <ResponsiveSkeleton page="dashboard" />;

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
      <DashboardStatCards />

      {/* Bottom Section - Recent Activity and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 lg:mt-8">
        {/* Recent Activity */}
        <DashboardRecentActivities />

        {/* Achievements */}
        <DashboardAchievements />

      </div>
    </div>
  );
};

export default Dashboard;
