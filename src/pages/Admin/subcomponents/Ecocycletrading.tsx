import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const EcocycleTrading: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Eco-Cycle Trading</h1>
        <p className="text-gray-600 mt-2">
          Manage recycling trades and point distribution
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Trading Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Trades</span>
                <span className="font-bold text-2xl text-green-600">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Points Distributed</span>
                <span className="font-bold text-2xl text-blue-600">1,240</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Weight (kg)</span>
                <span className="font-bold text-2xl text-purple-600">124</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Material Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span>Plastic Bottles</span>
                <span className="font-medium">45 kg</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span>Cardboard</span>
                <span className="font-medium">32 kg</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span>Glass Containers</span>
                <span className="font-medium">28 kg</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span>Metal Cans</span>
                <span className="font-medium">19 kg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Material</th>
                    <th className="text-left p-2">Weight</th>
                    <th className="text-left p-2">Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">09:15 AM</td>
                    <td className="p-2">Juan Santos</td>
                    <td className="p-2">Plastic Bottles</td>
                    <td className="p-2">2.5 kg</td>
                    <td className="p-2 text-green-600">+25 pts</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">09:30 AM</td>
                    <td className="p-2">Maria Cruz</td>
                    <td className="p-2">Cardboard</td>
                    <td className="p-2">4.0 kg</td>
                    <td className="p-2 text-green-600">+40 pts</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">09:45 AM</td>
                    <td className="p-2">Pedro Garcia</td>
                    <td className="p-2">Glass Containers</td>
                    <td className="p-2">1.8 kg</td>
                    <td className="p-2 text-green-600">+18 pts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EcocycleTrading;
