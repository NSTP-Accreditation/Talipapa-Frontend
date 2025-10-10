import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage system configurations and preferences
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Points per Kg</h4>
                  <p className="text-sm text-gray-600">Default points awarded per kilogram of recyclables</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600">10 Points</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Minimum Swap Amount</h4>
                  <p className="text-sm text-gray-600">Minimum points required to make a swap</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600">50 Points</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Trading Hours</h4>
                  <p className="text-sm text-gray-600">Daily operating hours for trading center</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800">8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Total Registered Users</h4>
                  <p className="text-sm text-gray-600">Active community members</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600">1,247</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Admin Users</h4>
                  <p className="text-sm text-gray-600">System administrators</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600">3</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Pending Approvals</h4>
                  <p className="text-sm text-gray-600">User registrations awaiting approval</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-yellow-600">12</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;