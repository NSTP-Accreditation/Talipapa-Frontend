import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const Guidelines: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Barangay Guidelines</h1>
        <p className="text-gray-600 mt-2">
          Manage and edit barangay rules and guidelines
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Waste Management Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Segregation Rules</h4>
                <p className="text-sm text-gray-600">
                  All residents must segregate waste into biodegradable, non-biodegradable, 
                  and recyclable materials.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Collection Schedule</h4>
                <p className="text-sm text-gray-600">
                  Waste collection happens every Monday, Wednesday, and Friday at 6:00 AM.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Recycling Program</h4>
                <p className="text-sm text-gray-600">
                  Join our eco-cycle trading program to earn points for recyclable materials.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Guidelines;