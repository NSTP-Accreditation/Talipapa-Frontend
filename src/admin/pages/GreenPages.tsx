import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MapPin, Users, Sprout, Leaf, BarChart3, User, Phone, Mail, Briefcase, Calendar, X } from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { GreenPagesSkeleton } from '../../components/LoadingSkeletons';

type TabType = 'profile' | 'skillMap' | 'statistics';

const GreenPages: React.FC = () => {
  const { isLoading } = useLoadingState(1000);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  // Modal state for adding staff
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    age: '',
    gender: '',
    position: '',
    email: '',
    contact: '',
  });

  // Mock data for demonstration
  const farmData = {
    name: 'MWSS Talipapa Eco Park',
    size: '300 sqm.',
    age: 2,
    type: 'Aquaponics, Vertical Garden, Greenhouse',
    address: 'MWSS Service Road, Quezon City',
    description: 'some description',
  };

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

  // Modal handlers
  const openAddStaffModal = () => {
    setStaffForm({
      name: '',
      age: '',
      gender: '',
      position: '',
      email: '',
      contact: '',
    });
    setIsAddStaffModalOpen(true);
  };

  const closeAddStaffModal = () => {
    setIsAddStaffModalOpen(false);
    setIsSubmitting(false);
  };

  const handleStaffFormChange = (field: string, value: string) => {
    setStaffForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!staffForm.name || !staffForm.position || !staffForm.contact) {
      alert('Please fill in all required fields (Name, Position, Contact)');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('New staff:', staffForm);
      alert('Staff added successfully!');
      closeAddStaffModal();
    }, 1500);
  };

  if (isLoading) {
    return <GreenPagesSkeleton />;
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
                    {farmData.name}
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
                    {farmData.size}
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
                    {farmData.age} years
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
                    {farmData.type}
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
                    {farmData.address}
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
                    {farmData.description}
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
                  <button 
                    onClick={openAddStaffModal}
                    className="bg-white text-green-700 hover:bg-green-50 px-4 sm:px-6 py-2.5 rounded-xl font-bold shadow-lg text-sm sm:text-base transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    <Users className="w-5 h-5" />
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
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    Farm Analytics & Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gradient-to-br from-gray-50 to-white overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-20rem)] lg:max-h-[795px]">
                  {/* Stats Summary */}
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

                  {/* Member Each Farm Chart */}
                  <div className="bg-gradient-to-br from-white via-green-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-green-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          Member Each Farm
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                          Distribution of members across different farm locations
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                      <div className="sm:hidden">
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart data={memberEachFarmData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fontSize: 9, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #10b981',
                                borderRadius: '12px',
                                fontSize: '11px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '8px 12px'
                              }}
                              labelStyle={{ color: '#059669', fontWeight: 'bold' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Members" radius={[8, 8, 0, 0]} label={{ position: 'top', fontSize: 10, fill: '#374151' }}>
                              {memberEachFarmData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="hidden sm:block md:hidden">
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={memberEachFarmData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              angle={-25}
                              textAnchor="end"
                              height={90}
                              tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #10b981',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '10px 14px'
                              }}
                              labelStyle={{ color: '#059669', fontWeight: 'bold' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Members" radius={[10, 10, 0, 0]} label={{ position: 'top', fontSize: 11, fill: '#374151', fontWeight: 600 }}>
                              {memberEachFarmData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="hidden md:block">
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={memberEachFarmData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              angle={-15}
                              textAnchor="end"
                              height={100}
                              tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #10b981',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '12px 16px'
                              }}
                              labelStyle={{ color: '#059669', fontWeight: 'bold', fontSize: '13px' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Members" radius={[10, 10, 0, 0]} label={{ position: 'top', fontSize: 12, fill: '#374151', fontWeight: 600 }}>
                              {memberEachFarmData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Skills Count Chart */}
                  <div className="bg-gradient-to-br from-white via-blue-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          Skills Count
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                          Total number of staff members with each skill type
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                      <div className="sm:hidden">
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart data={skillsCountData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={110}
                              tick={{ fontSize: 8, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #3b82f6',
                                borderRadius: '12px',
                                fontSize: '11px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '8px 12px'
                              }}
                              labelStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Staff Count" radius={[8, 8, 0, 0]} label={{ position: 'top', fontSize: 9, fill: '#374151' }}>
                              {skillsCountData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="hidden sm:block md:hidden">
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={skillsCountData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              angle={-35}
                              textAnchor="end"
                              height={115}
                              tick={{ fontSize: 9, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #3b82f6',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '10px 14px'
                              }}
                              labelStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Staff Count" radius={[10, 10, 0, 0]} label={{ position: 'top', fontSize: 10, fill: '#374151', fontWeight: 600 }}>
                              {skillsCountData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="hidden md:block">
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={skillsCountData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              angle={-25}
                              textAnchor="end"
                              height={120}
                              tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #3b82f6',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '12px 16px'
                              }}
                              labelStyle={{ color: '#2563eb', fontWeight: 'bold', fontSize: '13px' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Staff Count" radius={[10, 10, 0, 0]} label={{ position: 'top', fontSize: 11, fill: '#374151', fontWeight: 600 }}>
                              {skillsCountData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Ages in All Farm Chart */}
                  <div className="bg-gradient-to-br from-white via-purple-50/30 to-white p-3 sm:p-5 md:p-6 rounded-2xl border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          Age Distribution
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                          Age distribution of all farm staff members
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                      <div className="sm:hidden">
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart data={agesInAllFarmData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #a855f7',
                                borderRadius: '12px',
                                fontSize: '11px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '8px 12px'
                              }}
                              labelStyle={{ color: '#9333ea', fontWeight: 'bold' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Staff Members" radius={[8, 8, 0, 0]} label={{ position: 'top', fontSize: 10, fill: '#374151' }}>
                              {agesInAllFarmData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="hidden sm:block md:hidden">
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={agesInAllFarmData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #a855f7',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '10px 14px'
                              }}
                              labelStyle={{ color: '#9333ea', fontWeight: 'bold' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Staff Members" radius={[10, 10, 0, 0]} label={{ position: 'top', fontSize: 11, fill: '#374151', fontWeight: 600 }}>
                              {agesInAllFarmData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="hidden md:block">
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={agesInAllFarmData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #a855f7',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '12px 16px'
                              }}
                              labelStyle={{ color: '#9333ea', fontWeight: 'bold', fontSize: '13px' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                              iconType="circle"
                            />
                            <Bar dataKey="value" name="Staff Members" radius={[10, 10, 0, 0]} label={{ position: 'top', fontSize: 12, fill: '#374151', fontWeight: 600 }}>
                              {agesInAllFarmData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Add Staff Modal */}
      {isAddStaffModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAddStaffModal();
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 via-green-600 to-green-700 px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">Add New Staff Member</h3>
                    <p className="text-green-100 text-sm font-medium">Enter staff details below</p>
                  </div>
                </div>
                <button
                  onClick={closeAddStaffModal}
                  className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 ring-1 ring-white/30"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <form onSubmit={handleSubmitStaff} className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="px-8 py-6 space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-green-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Personal Information</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <User className="w-4 h-4 text-green-600" />
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={staffForm.name}
                        onChange={(e) => handleStaffFormChange('name', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Briefcase className="w-4 h-4 text-green-600" />
                        Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={staffForm.position}
                        onChange={(e) => handleStaffFormChange('position', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium"
                        placeholder="e.g., Machine Operator"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Age Range */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Calendar className="w-4 h-4 text-green-600" />
                        Age Range
                      </label>
                      <select
                        value={staffForm.age}
                        onChange={(e) => handleStaffFormChange('age', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white"
                      >
                        <option value="">Select age range</option>
                        <option value="18-25 years old">18-25 years old</option>
                        <option value="26-35 years old">26-35 years old</option>
                        <option value="36-45 years old">36-45 years old</option>
                        <option value="46-55 years old">46-55 years old</option>
                        <option value="Above 50 years old">Above 50 years old</option>
                      </select>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <User className="w-4 h-4 text-green-600" />
                        Gender
                      </label>
                      <select
                        value={staffForm.gender}
                        onChange={(e) => handleStaffFormChange('gender', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-green-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Contact Information</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Mail className="w-4 h-4 text-green-600" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={staffForm.email}
                        onChange={(e) => handleStaffFormChange('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-gray-900 font-medium"
                        placeholder="email@example.com"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Phone className="w-4 h-4 text-green-600" />
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={staffForm.contact}
                        onChange={(e) => handleStaffFormChange('contact', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium"
                        placeholder="09123456789"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 font-medium flex items-start gap-2">
                    <span className="text-green-600 text-lg flex-shrink-0">ℹ️</span>
                    <span>Fields marked with <span className="text-red-500 font-bold">*</span> are required. Make sure all information is accurate before submitting.</span>
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeAddStaffModal}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Add Staff</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default GreenPages;
