import {
  Users,
  Leaf,
  BarChart3,
  X,
  MapPin,
  Phone,
  Users as UsersIcon,
  Sprout,
  HopOff,
  Contact,
  SquarePen,
} from 'lucide-react';
import React, { useState } from 'react';
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
import { Farm } from '../GreenPages';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface StatisticsTabProps {
  memberEachFarmData: DataItem[];
  skillsCountData: DataItem[];
  agesInAllFarmData: DataItem[];
  refetchFarms: () => Promise<Farm[]>
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
        tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
      />
      <YAxis tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
      <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
      <Legend />
      <Bar
        dataKey="value"
        name="Value"
        radius={[10, 10, 0, 0]}
        label={{
          position: 'top',
          fontSize: 12,
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
  refetchFarms
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
    image: null
    
  });
  const authFetch = useAuthFetch();

  const openAddFarm = () => {
    setNewFarm({
      name: '',
      location: '',
      size: '',
      age: '',
      farmType: '',
      address: '',
      description: '',
      image: null
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
        .split(",")
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
      alert('Farm name and location are required');
      return;
    }
    setIsSubmittingFarm(true);
    if(!newFarm.image || !newFarm.description)  {
      alert('Image and Description are required!');
      return;
    }

    const mapLoc = extractLatLong(newFarm.location);

    try {
      const formData = new FormData();

      formData.append("location", JSON.stringify(mapLoc));
      formData.append("name", newFarm.name);
      formData.append("size", newFarm.size);
      formData.append("age", newFarm.age);
      formData.append("farmType", newFarm.farmType);
      formData.append("address", newFarm.address);
      formData.append("description", newFarm.description);
      formData.append("image", newFarm.image);

      try {
        const res = authFetch("/farms", {
          method: "POST",
          body: formData
        })

        console.log(res);
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
          image: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              Farm Analytics & Statistics
            </CardTitle>
            <button
              onClick={openAddFarm}
              className="bg-white text-green-700 hover:bg-green-50 px-4 sm:px-6 py-2.5 rounded-xl font-bold shadow-lg text-sm sm:text-base transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <Sprout className="w-5 h-5" />
              <span>Add Farm</span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gradient-to-br from-gray-50 to-white overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-20rem)] lg:max-h-[795px]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-green-100 text-xs sm:text-sm font-semibold mb-1">
                Total Farms
              </p>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {memberEachFarmData.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1">
                Total Skills
              </p>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {skillsCountData.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <p className="text-purple-100 text-xs sm:text-sm font-semibold mb-1">
                Age Groups
              </p>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {agesInAllFarmData.length}
              </p>
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
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                  Distribution of members across different farm locations
                </p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
              <ResponsiveBar
                data={memberEachFarmData}
                height={350}
                angle={-15}
              />
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
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                  Total number of staff members with each skill type
                </p>
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
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 ml-8 sm:ml-10">
                  Age distribution of all farm staff members
                </p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
              <ResponsiveBar data={agesInAllFarmData} height={350} angle={0} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Farm Modal */}
      {isAddFarmOpen && (
        <div
          className="fixed inset-0 z-1003 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAddFarm();
          }}
        >
          <form
            onSubmit={handleCreateFarm}
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-slideUp"
          >
            <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Add New Farm</h3>
                    <p className="text-green-100 text-sm">
                      Fill in the details to create a new farm
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeAddFarm}
                  className="text-white/90 p-2 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <HopOff className="inline w-4 h-4 mr-1 text-green-600" />
                    Farm Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={newFarm.name}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, name: e.target.value })
                    }
                    placeholder="Name of the farm"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <MapPin className="inline w-4 h-4 mr-1 text-green-600" />
                    Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={newFarm.location}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, location: e.target.value })
                    }
                    placeholder="Google Map Location"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <Contact className="inline w-4 h-4 mr-1 text-green-600" />
                    Size <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={newFarm.size}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, size: e.target.value })
                    }
                    placeholder="Size"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <UsersIcon className="inline w-4 h-4 mr-1 text-green-600" />
                    Age <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={newFarm.age}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, age: e.target.value })
                    }
                    placeholder="Age"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <Contact className="inline w-4 h-4 mr-1 tex t-green-600" />
                    Farm Type <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={newFarm.farmType}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, farmType: e.target.value })
                    }
                    placeholder="Farm Type"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <MapPin className="inline w-4 h-4 mr-1 text-green-600" />
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={newFarm.address}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, address: e.target.value })
                    }
                    placeholder="Address"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400"
                  />
                </div>
                
                <div className="sm:col-span-2 flex items-center gap-5">
                  <label className="cursor-pointer bg-[#1b4c2e] text-white px-4 py-2 rounded-md hover:bg-[#2d6b42] transition-colors inline-block">
                    Choose Image
                    <input
                      required
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <p>File: {newFarm?.image?.name}</p>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <SquarePen className="inline w-4 h-4 mr-1 text-green-600" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={newFarm.description}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, description: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400 resize-none h-28"
                    placeholder="Short description or notes"
                  />
                  {/* Info Note */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-800 font-medium">
                        <span className="font-bold">Note:</span> Fields marked
                        with <span className="text-red-500 font-bold">*</span>{' '}
                        are required. Please ensure all information is accurate
                        before submitting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeAddFarm}
                className="px-8 py-3.5 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmittingFarm}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingFarm}
                className="px-10 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingFarm ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Sprout className="w-5 h-5" />
                      <span>Add Farm</span>
                    </div>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StatisticsTab;
