import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const News: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Barangay News</h1>
        <p className="text-gray-600 mt-2">
          Manage and publish barangay announcements and news
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent News & Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Community Clean-up Drive</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Join us this Saturday, October 12, 2025, for our monthly community clean-up drive. 
                  Meet at the barangay hall at 7:00 AM.
                </p>
                <span className="text-xs text-gray-500">Published: October 8, 2025</span>
              </div>
              
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">Eco-Cycle Trading Program Launch</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Our new recycling rewards program is now live! Trade your recyclables for points 
                  and redeem rewards at participating local stores.
                </p>
                <span className="text-xs text-gray-500">Published: October 5, 2025</span>
              </div>

              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-lg">
                <h4 className="font-medium mb-2">Water Service Interruption Notice</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Water service will be temporarily interrupted on October 10, 2025, from 9:00 AM to 3:00 PM 
                  for maintenance work.
                </p>
                <span className="text-xs text-gray-500">Published: October 7, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default News;