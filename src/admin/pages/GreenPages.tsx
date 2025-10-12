import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MapPin, Users, Sprout, Leaf } from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { DashboardSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';

type TabType = 'profile' | 'skillMap' | 'statistics';

interface Location {
  lat: number;
  lng: number;
}

export interface Farm {
  location: Location;
  name: string;
  size: string;
  age: string;
  farmType: string;
  address: string;
  description: string;
  image?: string; // optional as it is not required in the schema
}

const GreenPages: React.FC = () => {
  const { isLoading } = useLoadingState(1000);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [selectedFarm, setSelectedFarm] = useState<Farm>();

  const { data: farmData, loading: farmLoading, error: farmError } = useFetchData('/farms');

  useEffect(() => {
    if(farmData && !farmLoading && !farmError) {
      setSelectedFarm(farmData[0])
    }
  }, [farmData, farmLoading, farmError])

  const staffDirectory = [
    {
      name: 'Vicente Banguilan',
      age: 'Above 50 years old',
      gender: 'Male',
      position: 'Machine Operator',
      email: 'No Email Address Provided',
      contact: '09709360392',
    },
    {
      name: 'Maria Santos',
      age: '35-40 years old',
      gender: 'Female',
      position: 'Farm Supervisor',
      email: 'maria.santos@example.com',
      contact: '09171234567',
    },
    {
      name: 'Jose Dela Cruz',
      age: '40-45 years old',
      gender: 'Male',
      position: 'Agriculturist',
      email: 'jose.delacruz@example.com',
      contact: '09281234567',
    },
  ];

  const staffSkills = [
    { name: 'Traditional Composting', short: 'Traditional', type: 'Composting', color: '#15803d' },
    { name: 'Vermicomposting', short: 'Vermicomposting', type: 'Composting', color: '#16a34a' },
    { name: 'Bokashi Composting', short: 'Bokashi', type: 'Composting', color: '#a855f7' },
    { name: 'Mushroom Cultivation', short: 'Mushroom', type: 'Cultivation', color: '#c084fc' },
    { name: 'Aquaponics', short: 'Aquaponics', type: 'Farming', color: '#cbd5e1' },
    { name: 'Hydroponic Farming', short: 'Hydroponics', type: 'Farming', color: '#ec4899' },
    { name: 'Organic Fertilizer Making', short: 'Fertilizer', type: 'Production', color: '#f97316' },
    { name: 'Vertical Gardening', short: 'Vertical', type: 'Gardening', color: '#22d3ee' },
  ];

  // Statistics data
  const memberEachFarmData = [
    { name: 'MWSS Talipapa Eco Park', value: 8, color: '#f59e0b' },
    { name: 'Bayantel Eco Park', value: 6, color: '#ec4899' },
    { name: 'Manonbol Urban Farm', value: 4, color: '#4a7c28' },
  ];

  const skillsCountData = [
    { name: 'Traditional Composting', value: 5, color: '#4ade80' },
    { name: 'Vermicomposting', value: 4, color: '#78350f' },
    { name: 'Bokashi Composting', value: 3, color: '#a855f7' },
    { name: 'Mushroom Cultivation', value: 2, color: '#c084fc' },
    { name: 'Aquaponics', value: 2, color: '#cbd5e1' },
    { name: 'Hydroponic Farming', value: 1, color: '#ec4899' },
    { name: 'Organic Fertilizer Making', value: 1, color: '#f97316' },
  ];

  const agesInAllFarmData = [
    { name: '18-25', value: 2, color: '#4ade80' },
    { name: '26-35', value: 4, color: '#78350f' },
    { name: '36-45', value: 5, color: '#a855f7' },
    { name: '46-55', value: 3, color: '#c084fc' },
    { name: '56-65', value: 2, color: '#cbd5e1' },
    { name: '65+', value: 1, color: '#ec4899' },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #16a34a, #15803d);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #15803d, #166534);
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center shadow-xl">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            </div>
            Green Pages
          </h1>
        </div>
      </div>

      {/* Google Map - Full Width on Top */}
      <Card className="rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border-2 border-gray-200 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
        <div className="w-full h-56 sm:h-80 md:h-96 relative">
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-gray-200">
            <p className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              Talipapa Location
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.2284682435453!2d121.02444617082957!3d14.687906698469316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ba0142bacae1%3A0x1d4df110b3ed21dd!2sTalipapa%20Barangay%20Hall!5e0!3m2!1sen!2sph!4v1697000000000!5m2!1sen!2sph"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Talipapa Location Map"
          ></iframe>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 sm:gap-3 flex-wrap bg-white p-2 rounded-2xl shadow-lg border-2 border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 min-w-[120px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white shadow-lg shadow-green-200 scale-105'
              : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md'
          }`}
        >
          🏡 Farm Profile
        </button>
        <button
          onClick={() => setActiveTab('skillMap')}
          className={`flex-1 min-w-[120px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
            activeTab === 'skillMap'
              ? 'bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white shadow-lg shadow-green-200 scale-105'
              : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md'
          }`}
        >
          🌱 Skill Map
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`flex-1 min-w-[120px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
            activeTab === 'statistics'
              ? 'bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white shadow-lg shadow-green-200 scale-105'
              : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md'
          }`}
        >
          📊 Statistics
        </button>
      </div>

      {/* Content Area - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:items-start">
        {/* Left Side - Farm Photo and Info */}
        <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6">
          {/* Farm Photo Placeholder */}
          <Card className="rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex-shrink-0">
            <div className="w-full h-40 sm:h-48 md:h-56 bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center text-gray-600 font-bold text-base sm:text-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTYsMjM5LDIyMCwwLjQpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="text-center z-10 group-hover:scale-110 transition-transform duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Sprout className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
                </div>
                <p className="text-green-700 font-bold text-sm sm:text-base">Farm Photo</p>
                <p className="text-[10px] sm:text-xs text-green-600 mt-1">Upload Image</p>
              </div>
            </div>
          </Card>

          {/* Farm Information */}
          <Card className="rounded-2xl shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all duration-300 flex-1 flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-t-2xl flex-shrink-0">
              <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Farm Details
              </h3>
            </div>
            <CardContent className="p-4 sm:p-5 space-y-3 bg-gradient-to-br from-white to-green-50/20 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <span className="text-green-700 font-bold text-base sm:text-lg">🏷️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">Name</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-relaxed">
                    {selectedFarm?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <span className="text-blue-700 font-bold text-base sm:text-lg">📐</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">Size</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                    {selectedFarm?.size}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <span className="text-purple-700 font-bold text-base sm:text-lg">⏳</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">Age</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                    {selectedFarm?.age} years
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <span className="text-amber-700 font-bold text-base sm:text-lg">🌾</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">Type</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-relaxed">
                    {selectedFarm?.farmType}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <span className="text-red-700 font-bold text-base sm:text-lg">📍</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">Address</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-relaxed">
                    {selectedFarm?.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <span className="text-teal-700 font-bold text-base sm:text-lg">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">
                    Description
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-relaxed">
                    {selectedFarm?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Tab Content */}
        <div className="lg:col-span-2">
          {activeTab === 'profile' && (
            <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    Staff Directory
                  </CardTitle>
                  <button className="bg-white text-green-700 hover:bg-green-50 px-4 sm:px-6 py-2.5 rounded-xl font-bold shadow-lg text-sm sm:text-base transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2">
                    <span className="text-lg">➕</span>
                    <span>Add Staff</span>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-5 md:p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="space-y-3 sm:space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-20rem)] lg:max-h-[740px]">
                  {staffDirectory.map((staff, index) => (
                    <Card
                      key={index}
                      className="p-3 sm:p-4 md:p-5 bg-white border-2 border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 rounded-2xl group"
                    >
                      <div className="space-y-2 sm:space-y-2.5">
                        <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-100">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                            {staff.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
                              {staff.name}
                            </p>
                            <p className="text-xs sm:text-sm text-green-600 font-semibold truncate">
                              {staff.position}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 p-2 sm:p-2.5 rounded-lg">
                            <p className="text-xs sm:text-xs text-gray-600 font-semibold">
                              Age
                            </p>
                            <p className="text-sm sm:text-sm md:text-base font-bold text-gray-900">
                              {staff.age}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 sm:p-2.5 rounded-lg">
                            <p className="text-xs sm:text-xs text-gray-600 font-semibold">
                              Gender
                            </p>
                            <p className="text-sm sm:text-sm md:text-base font-bold text-gray-900">
                              {staff.gender}
                            </p>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-2 sm:p-2.5 rounded-lg">
                          <p className="text-xs sm:text-xs text-gray-600 font-semibold">
                            Email
                          </p>
                          <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900 break-all">
                            {staff.email}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 sm:p-2.5 rounded-lg">
                          <p className="text-xs sm:text-xs text-gray-600 font-semibold">
                            Contact Number
                          </p>
                          <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                            {staff.contact}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'skillMap' && (
            <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  Staff Skills Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-5 md:p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                    💡 Skills Overview: {staffSkills.length} skill entries across the team
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {staffSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="rounded-xl p-3 sm:p-4 md:p-5 text-center font-bold text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer relative overflow-hidden group"
                      style={{ backgroundColor: skill.color }}
                    >
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300"></div>
                      <p className="text-sm sm:text-base md:text-lg leading-tight relative z-10">
                        {skill.short}
                      </p>
                      <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-white/40">
                        <span className="text-xs sm:text-sm opacity-90 font-semibold">
                          {skill.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'statistics' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Statistics Header */}
              <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <BarChart className="w-6 h-6 text-white" />
                    </div>
                    Farm Analytics & Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gradient-to-br from-gray-50 to-white">
                  {/* Member Each Farm Chart */}
                  <div className="bg-gradient-to-br from-white via-green-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-green-100 shadow-xl">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          Member Each Farm
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                          Distribution of members across different farm locations
                        </p>
                      </div>
                    </div>
                    <div className="sm:hidden">
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={memberEachFarmData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 9, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 10, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '11px',
                            }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {memberEachFarmData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="hidden sm:block md:hidden">
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={memberEachFarmData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            angle={-25}
                            textAnchor="end"
                            height={90}
                            tick={{ fontSize: 11, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar dataKey="value" radius={[7, 7, 0, 0]}>
                            {memberEachFarmData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="hidden md:block">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={memberEachFarmData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            angle={-15}
                            textAnchor="end"
                            height={100}
                            tick={{ fontSize: 12, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 12, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {memberEachFarmData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Skills Count Chart */}
                  <div className="bg-gradient-to-br from-white via-blue-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-blue-100 shadow-xl">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          Skills Count
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                          Total number of staff members with each skill type
                        </p>
                      </div>
                    </div>
                    <div className="sm:hidden">
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={skillsCountData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={110}
                            tick={{ fontSize: 8, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 10, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '11px',
                            }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {skillsCountData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="hidden sm:block md:hidden">
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={skillsCountData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            angle={-35}
                            textAnchor="end"
                            height={115}
                            tick={{ fontSize: 9, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar dataKey="value" radius={[7, 7, 0, 0]}>
                            {skillsCountData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="hidden md:block">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={skillsCountData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            angle={-25}
                            textAnchor="end"
                            height={120}
                            tick={{ fontSize: 10, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 12, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {skillsCountData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Ages in All Farm Chart */}
                  <div className="bg-gradient-to-br from-white via-purple-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-purple-100 shadow-xl">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          Ages in all Farm
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                          Age distribution of all farm staff members
                        </p>
                      </div>
                    </div>
                    <div className="sm:hidden">
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={agesInAllFarmData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 10, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '11px',
                            }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {agesInAllFarmData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="hidden sm:block md:hidden">
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={agesInAllFarmData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar dataKey="value" radius={[7, 7, 0, 0]}>
                            {agesInAllFarmData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="hidden md:block">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={agesInAllFarmData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: '#4b5563' }}
                          />
                          <YAxis tick={{ fontSize: 12, fill: '#4b5563' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {agesInAllFarmData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default GreenPages;
