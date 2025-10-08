import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const EarnPointsLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Earn Points Logs</h1>
        <p className="text-gray-600 mt-2">
          Monitor all points earned through eco-friendly activities
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Points Earning History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div>
                  <h4 className="font-medium">Recycling Bonus</h4>
                  <p className="text-sm text-gray-600">
                    Weekly recycling goal achieved
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+100 Points</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div>
                  <h4 className="font-medium">Community Clean-up</h4>
                  <p className="text-sm text-gray-600">
                    Participated in neighborhood cleanup
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+150 Points</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div>
                  <h4 className="font-medium">Eco-Challenge</h4>
                  <p className="text-sm text-gray-600">
                    Completed monthly eco-challenge
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+200 Points</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarnPointsLogs;
