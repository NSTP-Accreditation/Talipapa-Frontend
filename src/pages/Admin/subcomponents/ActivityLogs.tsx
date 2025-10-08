import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const ActivityLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600 mt-2">
          Track all trading activities and transactions
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trading Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Plastic Bottle Trade</h4>
                  <p className="text-sm text-gray-600">User: John Doe</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+50 Points</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Cardboard Collection</h4>
                  <p className="text-sm text-gray-600">User: Jane Smith</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+30 Points</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Glass Container Trade</h4>
                  <p className="text-sm text-gray-600">User: Mike Johnson</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+25 Points</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityLogs;
