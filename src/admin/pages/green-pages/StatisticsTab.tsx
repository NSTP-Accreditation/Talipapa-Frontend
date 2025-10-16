import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Users, Leaf, BarChart3 } from 'lucide-react';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface StatisticsTabProps {
  memberEachFarmData: DataItem[];
  skillsCountData: DataItem[];
  agesInAllFarmData: DataItem[];
}

const ResponsiveBar = ({ data, height = 320, angle = -15 }: { data: DataItem[]; height?: number; angle?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
      <XAxis dataKey="name" angle={angle} textAnchor="end" height={100} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
      <YAxis tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
      <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
      <Legend />
      <Bar dataKey="value" name="Value" radius={[10, 10, 0, 0]} label={{ position: 'top', fontSize: 12, fill: '#374151', fontWeight: 600 }}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const StatisticsTab: React.FC<StatisticsTabProps> = ({ memberEachFarmData, skillsCountData, agesInAllFarmData }) => {
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Farm Analytics & Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gradient-to-br from-gray-50 to-white overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-20rem)] lg:max-h-[795px]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-green-100 text-xs sm:text-sm font-semibold mb-1">Total Farms</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">{memberEachFarmData.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1">Total Skills</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">{skillsCountData.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-purple-100 text-xs sm:text-sm font-semibold mb-1">Age Groups</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">{agesInAllFarmData.length}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-green-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-green-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  Member Each Farm
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">Distribution of members across different farm locations</p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
              <ResponsiveBar data={memberEachFarmData} height={350} angle={-15} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-blue-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  Skills Count
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">Total number of staff members with each skill type</p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
              <ResponsiveBar data={skillsCountData} height={350} angle={-25} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-purple-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  Age Distribution
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">Age distribution of all farm staff members</p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
              <ResponsiveBar data={agesInAllFarmData} height={350} angle={0} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsTab;
