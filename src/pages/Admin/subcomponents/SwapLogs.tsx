import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const SwapLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Swap Logs</h1>
        <p className="text-gray-600 mt-2">
          Track all point swaps and reward exchanges
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Swaps & Exchanges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div>
                  <h4 className="font-medium">Grocery Voucher</h4>
                  <p className="text-sm text-gray-600">User: Maria Garcia</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-500 Points</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div>
                  <h4 className="font-medium">School Supplies</h4>
                  <p className="text-sm text-gray-600">User: Pedro Santos</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-300 Points</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div>
                  <h4 className="font-medium">Eco-Bag Set</h4>
                  <p className="text-sm text-gray-600">User: Anna Cruz</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-150 Points</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SwapLogs;