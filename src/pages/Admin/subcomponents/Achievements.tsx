import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const Achievements: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Barangay Achievements
        </h1>
        <p className="text-gray-600 mt-2">
          Our accomplishments and recognition in environmental initiatives
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environmental Awards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl">
                  🏆
                </div>
                <div>
                  <h4 className="font-medium">
                    Most Eco-Friendly Barangay 2024
                  </h4>
                  <p className="text-sm text-gray-600">
                    Awarded by Quezon City LGU for outstanding environmental
                    programs
                  </p>
                  <span className="text-xs text-gray-500">December 2024</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                  🌱
                </div>
                <div>
                  <h4 className="font-medium">
                    Zero Waste Community Recognition
                  </h4>
                  <p className="text-sm text-gray-600">
                    Achieved 95% waste diversion rate through recycling programs
                  </p>
                  <span className="text-xs text-gray-500">September 2024</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                  ♻️
                </div>
                <div>
                  <h4 className="font-medium">Best Recycling Program 2024</h4>
                  <p className="text-sm text-gray-600">
                    Innovation award for the Eco-Cycle Trading Program
                    implementation
                  </p>
                  <span className="text-xs text-gray-500">June 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Impact Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">15,000+</div>
                <div className="text-sm text-gray-600">Kg Recycled</div>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Active Participants</div>
              </div>
              <div className="text-center p-4 bg-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  50,000+
                </div>
                <div className="text-sm text-gray-600">Points Distributed</div>
              </div>
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">Waste Diversion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Achievements;
