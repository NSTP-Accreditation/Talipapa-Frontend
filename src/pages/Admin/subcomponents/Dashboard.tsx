import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import {
  Users,
  TrendingUp,
  Megaphone,
  FileText,
  ArrowUp,
  ArrowDown,
  Newspaper,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const recentTrades = [
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

  const latestAnnouncements = [
    {
      title: 'Community Clean-up Drive',
      date: '2025-10-05',
      status: 'Published',
    },
    {
      title: 'Vaccination Program Schedule',
      date: '2025-10-03',
      status: 'Published',
    },
    {
      title: 'Barangay Assembly Meeting',
      date: '2025-10-02',
      status: 'Pinned',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-teal-600 mt-1">
          Overview of your Barangay Information System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
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

        {/* Active Trades Card */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-gray-800">
              Active Trades
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">89</div>
            <p className="text-xs text-blue-600">+23% from last month</p>
          </CardContent>
        </Card>

        {/* Announcements Card */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-gray-800">
              Announcements
            </CardTitle>
            <Megaphone className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">45</div>
            <p className="text-xs text-gray-500">5 pending approval</p>
          </CardContent>
        </Card>

        {/* Downloaded Forms Card */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-bold text-gray-800">
              Downloaded Forms
            </CardTitle>
            <FileText className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">342</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Recent Trades and Latest Announcements */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        {/* Recent Trades */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-bold text-gray-800">
              Recent Trades
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-0 pb-2">
            <div className="space-y-0">
              {recentTrades.map((trade, index) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {trade.name}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      ID: {trade.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {trade.points} pts
                    </p>
                    <p className="text-xs text-gray-500">{trade.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latest Announcements */}
        <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-bold text-gray-800">
              Latest Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-0 pb-2">
            <div className="space-y-0">
              {latestAnnouncements.map((announcement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {announcement.title}
                    </p>
                    <p className="text-xs text-gray-500">{announcement.date}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${
                        announcement.status === 'Pinned'
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {announcement.status}
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
