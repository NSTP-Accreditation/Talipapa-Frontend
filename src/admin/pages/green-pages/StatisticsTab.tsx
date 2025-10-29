import {
  Users,
  Leaf,
  BarChart3,
  X,
  MapPin,
  Users as UsersIcon,
  Sprout,
  HopOff,
  Contact,
  SquarePen,
} from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { createPortal } from 'react-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { Input } from '../../../components/ui/input';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { Farm } from './MapDropdown';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface StatisticsTabProps {
  memberEachFarmData: DataItem[];
  skillsCountData: DataItem[];
  agesInAllFarmData: DataItem[];
  refetchFarms: () => Promise<Farm[]>;
}

const ResponsiveBar = ({
  data,
  height = 320,
  angle = -15,
}: {
  data: DataItem[];
  height?: number;
  angle?: number;
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" opacity={0.5} />
      <XAxis
        dataKey="name"
        angle={angle}
        textAnchor="end"
        height={100}
        tick={{
          fontSize: window.innerWidth < 768 ? 10 : 12,
          fill: '#374151',
          fontWeight: 500,
        }}
      />
      <YAxis
        tick={{
          fontSize: window.innerWidth < 768 ? 10 : 12,
          fill: '#374151',
          fontWeight: 500,
        }}
      />
      <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
      <Legend />
      <Bar
        dataKey="value"
        name="Value"
        radius={[10, 10, 0, 0]}
        label={{
          position: 'top',
          fontSize: window.innerWidth < 768 ? 10 : 12,
          fill: '#374151',
          fontWeight: 600,
        }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const StatisticsTab: React.FC<StatisticsTabProps> = ({
  memberEachFarmData,
  skillsCountData,
  agesInAllFarmData,
  refetchFarms,
}) => {
  // Modal state for Add Farm
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [isSubmittingFarm, setIsSubmittingFarm] = useState(false);
  const [newFarm, setNewFarm] = useState({
    name: '',
    location: '',
    size: '',
    age: '',
    farmType: '',
    address: '',
    description: '',
    image: null,
  });
  const authFetch = useAuthFetch();
  const toast = useToast();

  const openAddFarm = () => {
    setNewFarm({
      name: '',
      location: '',
      size: '',
      age: '',
      farmType: '',
      address: '',
      description: '',
      image: null,
    });
    setIsAddFarmOpen(true);
  };

  const closeAddFarm = () => setIsAddFarmOpen(false);

  function extractLatLong(url) {
    // Regex to match both sets of coordinates: @latitude,longitude and 3dlatitude!4dlongitude
    const regex = /[-+]?\d{1,2}\.\d+,\s*[-+]?\d{1,3}\.\d+/g;
    const match = url.match(regex);

    if (match && match.length > 0) {
      const [lat, lng] = match[0]
        .split(',')
        .map((val) => parseFloat(val.trim()));
      return { lat, lng };
    } else {
      return null;
    }
  }

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingFarm) return;
    // Basic validation
    if (!newFarm.name || !newFarm.location) {
      toast.error('Farm name and location are required', {
        title: 'Validation',
      });
      return;
    }
    setIsSubmittingFarm(true);
    if (!newFarm.image || !newFarm.description) {
      toast.error('Image and Description are required!', {
        title: 'Validation',
      });
      return;
    }

    const mapLoc = extractLatLong(newFarm.location);

    try {
      const formData = new FormData();

      formData.append('location', JSON.stringify(mapLoc));
      formData.append('name', newFarm.name);
      formData.append('size', newFarm.size);
      formData.append('age', newFarm.age);
      formData.append('farmType', newFarm.farmType);
      formData.append('address', newFarm.address);
      formData.append('description', newFarm.description);
      formData.append('image', newFarm.image);

      try {
        const res = await authFetch('/farms', {
          method: 'POST',
          body: formData,
        });

        refetchFarms();
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmittingFarm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewFarm((prev) => ({
          ...prev,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <Card className="rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200 sm:border-2">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b border-green-500 sm:border-b-2 pb-3 sm:pb-4">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-center sm:text-left">
                Farm Analytics & Statistics
              </span>
            </CardTitle>
            <button
              onClick={openAddFarm}
              className="bg-white text-green-700 hover:bg-green-50 px-3 py-2 sm:px-4 md:px-6 sm:py-2.5 rounded-lg sm:rounded-xl font-bold shadow-lg text-xs sm:text-sm md:text-base transition-all hover:shadow-xl hover:scale-105 flex items-center gap-1.5 sm:gap-2"
            >
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Farm</span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 md:p-5 lg:p-6 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 bg-gradient-to-br from-gray-50 to-white overflow-y-auto pr-1 sm:pr-2 custom-scrollbar max-h-[calc(100vh-16rem)] sm:max-h-[calc(100vh-20rem)] lg:max-h-[795px]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-green-100 text-xs font-semibold mb-1">
                Total Farms
              </p>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {memberEachFarmData.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-blue-100 text-xs font-semibold mb-1">
                Total Skills
              </p>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {skillsCountData.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-purple-100 text-xs font-semibold mb-1">
                Age Groups
              </p>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {agesInAllFarmData.length}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-green-50/30 to-white p-2 sm:p-3 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-green-100 sm:border-2 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  Member Each Farm
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-6 sm:ml-8 md:ml-10">
                  Distribution of members across different farm locations
                </p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
              <ResponsiveBar
                data={memberEachFarmData}
                height={window.innerWidth < 768 ? 280 : 350}
                angle={window.innerWidth < 768 ? -45 : -15}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-blue-50/30 to-white p-2 sm:p-3 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-blue-100 sm:border-2 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                    <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  Skills Count
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-6 sm:ml-8 md:ml-10">
                  Total number of staff members with each skill type
                </p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
              <ResponsiveBar
                data={skillsCountData}
                height={window.innerWidth < 768 ? 280 : 350}
                angle={window.innerWidth < 768 ? -45 : -25}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-purple-50/30 to-white p-2 sm:p-3 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-purple-100 sm:border-2 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  Age Distribution
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-6 sm:ml-8 md:ml-10">
                  Age distribution of all farm staff members
                </p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
              <ResponsiveBar
                data={agesInAllFarmData}
                height={window.innerWidth < 768 ? 280 : 350}
                angle={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Farm Modal */}
      {isAddFarmOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeAddFarm();
            }}
          >
            <form
              onSubmit={handleCreateFarm}
              className="w-full max-w-xs sm:max-w-2xl md:max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-slideUp"
            >
              <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <UsersIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold">
                        Add New Farm
                      </h3>
                      <p className="text-green-100 text-xs sm:text-sm">
                        Fill in the details to create a new farm
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeAddFarm}
                    className="text-white/90 p-1.5 sm:p-2 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1">
                      <HopOff className="inline w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 text-green-600" />
                      Farm Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={newFarm.name}
                      onChange={(e) =>
                        setNewFarm({ ...newFarm, name: e.target.value })
                      }
                      placeholder="Name of the farm"
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1">
                      <MapPin className="inline w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 text-green-600" />
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={newFarm.location}
                      onChange={(e) =>
                        setNewFarm({ ...newFarm, location: e.target.value })
                      }
                      placeholder="Google Map Location"
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1">
                      <Contact className="inline w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 text-green-600" />
                      Size <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={newFarm.size}
                      onChange={(e) =>
                        setNewFarm({ ...newFarm, size: e.target.value })
                      }
                      placeholder="Size"
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1">
                      <UsersIcon className="inline w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 text-green-600" />
                      Age <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={newFarm.age}
                      onChange={(e) =>
                        setNewFarm({ ...newFarm, age: e.target.value })
                      }
                      placeholder="Age"
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1">
                      <Contact className="inline w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 text-green-600" />
                      Farm Type <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={newFarm.farmType}
                      onChange={(e) =>
                        setNewFarm({ ...newFarm, farmType: e.target.value })
                      }
                      placeholder="Farm Type"
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1">
                      <MapPin className="inline w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 text-green-600" />
                      Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={newFarm.address}
                      onChange={(e) =>
                        setNewFarm({ ...newFarm, address: e.target.value })
                      }
                      placeholder="Address"
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 text-sm sm:text-base"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3 sm:gap-5">
                    <label className="cursor-pointer bg-[#1b4c2e] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-[#2d6b42] transition-colors inline-block text-xs sm:text-sm">
                      Choose Image
                      <input
                        required
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    <p className="text-xs sm:text-sm text-gray-600 truncate flex-1">
                      File: {newFarm?.image?.name || 'No file selected'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-1">
                      <SquarePen className="inline w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 text-green-600" />
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={newFarm.description}
                      onChange={(e) =>
                        setNewFarm({ ...newFarm, description: e.target.value })
                      }
                      className="w-full border-2 border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 resize-none h-20 sm:h-28 text-sm sm:text-base"
                      placeholder="Short description or notes"
                    />
                    {/* Info Note */}
                    <div className="bg-green-50 border border-green-200 sm:border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 mt-2 sm:mt-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-green-800 font-medium">
                          <span className="font-bold">Note:</span> Fields marked
                          with <span className="text-red-500 font-bold">*</span>{' '}
                          are required. Please ensure all information is
                          accurate before submitting.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6 bg-gray-50 flex items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={closeAddFarm}
                  className="px-4 py-2.5 sm:px-8 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 sm:border-2 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  disabled={isSubmittingFarm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFarm}
                  className="px-6 py-2.5 sm:px-10 sm:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {isSubmittingFarm ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add Farm</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}
    </div>
  );
};

export default StatisticsTab;
