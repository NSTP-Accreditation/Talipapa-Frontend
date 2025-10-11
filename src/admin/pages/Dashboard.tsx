import React from 'react';
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
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const recentActivity = [
    {
      id: 'T001',
      name: 'Juan Dela Cruz',
      points: 150,
      date: '2025-10-01',
      trend: 'up',
    },
    {
      id: 'T002',
      name: 'Maria Santos',
      points: 200,
      date: '2025-10-01',
      trend: 'up',
    },
    {
      id: 'T003',
      name: 'Jose Reyes',
      points: 100,
      date: '2025-09-30',
      trend: 'down',
    },
    {
      id: 'T004',
      name: 'Anna Garcia',
      points: 175,
      date: '2025-09-30',
      trend: 'up',
    },
  ];

  const achievements = [
    {
      title: 'Community Clean-up Drive',
      date: '2025-10-05',
      status: 'Completed',
    },
    {
      title: 'Vaccination Program Schedule',
      date: '2025-10-03',
      status: 'Completed',
    },
    {
      title: 'Barangay Assembly Meeting',
      date: '2025-10-02',
      status: 'Ongoing',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
          <span className="text-4xl">📊</span>
          Dashboard
        </h1>
        <p className="text-lg text-gray-700 font-medium">
          Overview of your Barangay Information System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Today's Visits Card */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-gray-800">
              Today's Visits
            </CardTitle>
            <Eye className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">324</div>
            <p className="text-xs text-blue-600">+8% from yesterday</p>
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
            <div className="text-3xl font-bold text-gray-900 mb-1">12,458</div>
            <p className="text-xs text-blue-600">+15% from last month</p>
          </CardContent>
        </Card>

        {/* Total Users Card */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-gray-800">
              Total Users
            </CardTitle>
            <Users className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">1,245</div>
            <p className="text-xs text-blue-600">+12% from last month</p>
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
            <div className="text-3xl font-bold text-orange-600 mb-1">🚀</div>
            <p className="text-xs text-orange-700 font-medium">Feature in development</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Recent Activity and Achievements */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        {/* Recent Activity */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="px-6 py-2.5 pb-1.5 flex flex-row items-center gap-2 border-b border-gray-200">
            <Activity className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg font-bold text-gray-800">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-0 pt-0.5 pb-2">
            <div className="space-y-0">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {activity.name}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      ID: {activity.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {activity.points} pts
                    </p>
                    <p className="text-sm text-gray-700 font-medium">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl gap-0">
          <CardHeader className="px-6 py-2.5 pb-1.5 flex flex-row items-center gap-2 border-b border-gray-200">
            <Trophy className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg font-bold text-gray-800">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-0 pt-0.5 pb-2">
            <div className="space-y-0">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">{achievement.date}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${
                        achievement.status === 'Ongoing'
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {achievement.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
