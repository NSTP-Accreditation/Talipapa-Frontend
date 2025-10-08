import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

const AboutUs: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          About Barangay Talipapa
        </h1>
        <p className="text-gray-600 mt-2">
          Learn about our barangay's history, mission, and vision
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              To create a sustainable, clean, and progressive community that
              promotes environmental awareness and responsible waste management
              through innovative programs and community participation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              A model eco-friendly barangay where residents actively participate
              in environmental conservation, waste reduction, and sustainable
              living practices for future generations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Barangay Officials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  BC
                </div>
                <div>
                  <h4 className="font-medium">Barangay Captain</h4>
                  <p className="text-sm text-gray-600">Juan Dela Cruz</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  KC
                </div>
                <div>
                  <h4 className="font-medium">Kagawad - Environment</h4>
                  <p className="text-sm text-gray-600">Maria Santos</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  KS
                </div>
                <div>
                  <h4 className="font-medium">Barangay Secretary</h4>
                  <p className="text-sm text-gray-600">Rosa Garcia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;
