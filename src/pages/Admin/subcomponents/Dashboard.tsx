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
  Newspaper
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const recentTrades = [
    { id: 'T001', name: 'Juan Dela Cruz', points: 150, date: '2025-10-01', trend: 'up' },
    { id: 'T002', name: 'Maria Santos', points: 200, date: '2025-10-01', trend: 'up' },
    { id: 'T003', name: 'Jose Reyes', points: 100, date: '2025-09-30', trend: 'down' },
    { id: 'T004', name: 'Anna Garcia', points: 175, date: '2025-09-30', trend: 'up' },
  ];

  const latestAnnouncements = [
    { 
      title: 'Community Clean-up Drive', 
      date: '2025-10-05',
      status: 'Published' 
    },
    { 
      title: 'Vaccination Program Schedule', 
      date: '2025-10-03',
      status: 'Published' 
    },
    { 
      title: 'Barangay Assembly Meeting', 
      date: '2025-10-02',
      status: 'Pinned' 
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Overview of your Barangay Information System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1,245</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        {/* Active Trades Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Trades
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">89</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              +23% from last month
            </p>
          </CardContent>
        </Card>

        {/* Announcements Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Announcements
            </CardTitle>
            <Megaphone className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">45</div>
            <p className="text-xs text-gray-600 mt-1">
              5 pending approval
            </p>
          </CardContent>
        </Card>

        {/* Downloaded Forms Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Downloaded Forms
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">342</div>
            <p className="text-xs text-gray-600 mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Recent Trades and Latest Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Trades
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div 
                  key={trade.id} 
                  className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {trade.name}
                    </p>
                    <p className="text-xs text-gray-500">ID: {trade.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
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
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Latest Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {latestAnnouncements.map((announcement, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {announcement.title}
                    </p>
                    <p className="text-xs text-gray-500">{announcement.date}</p>
                  </div>
                  <div>
                    <span 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        announcement.status === 'Pinned' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-blue-100 text-blue-800'
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
