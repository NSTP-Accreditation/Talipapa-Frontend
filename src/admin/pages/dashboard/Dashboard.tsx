import React, { useEffect, memo } from 'react';
import { useToast } from '../../../hooks/useToast';
import { BarChart3, TrendingUp, Activity, Award } from 'lucide-react';
import { useLoadingState } from '../../../hooks/useLoadingState';
import ResponsiveSkeleton from '../../../components/ResponsiveSkeleton';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import DashboardStatCards from './components/DashboardStatCards';
import DashboardRecentActivities from './components/DashboardRecentActivities';
import DashboardAchievements from './components/DashboardAchievements';
dayjs.extend(isBetween);

const Dashboard: React.FC = memo(function Dashboard() {
  const { isLoading } = useLoadingState(1000);

  const { success } = useToast();

  // Show login toast on first load if redirected
  useEffect(() => {
    if (sessionStorage.getItem('loginSuccess') === 'true') {
      success('Login successful!', { title: 'Welcome' });
      sessionStorage.removeItem('loginSuccess');
    }
  }, [success]);

  if (isLoading) return <ResponsiveSkeleton page="dashboard" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
          </div>

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                  Overview of your Barangay Information System
                </p>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Statistics</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                    <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Recent Activity</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Achievements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStatCards />

        {/* Bottom Section - Recent Activity and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <DashboardRecentActivities />

          {/* Achievements */}
          <DashboardAchievements />
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
