import React, { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/useToast';
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
  Legend,
} from 'recharts';
import {
  MapPin,
  Users,
  Sprout,
  Leaf,
  BarChart3,
  User,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  X,
} from 'lucide-react';
import LeafletMap from './green-pages/LeafletMap';
import useFetchData from '../hooks/useFetchData';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useLoadingState } from '../../hooks/useLoadingState';
import { GreenPagesSkeleton } from '../../components/LoadingSkeletons';
import ProfileTab from './green-pages/ProfileTab';
import SkillMapTab from './green-pages/SkillMapTab';
import StatisticsTab from './green-pages/StatisticsTab';
import { ImageInt } from '../components/OfficialsPanel';
import MapDropdown from './green-pages/MapDropdown';

type TabType = 'mapDropdown' | 'profile' | 'skillMap' | 'statistics';

interface Location {
  lat: number;
  lng: number;
}

export interface Farm {
  _id?: string;
  location: Location;
  name: string;
  size: string;
  age: string;
  farmType: string;
  address: string;
  description: string;
  memberCount: number;
  image?: ImageInt;
}

interface Position {
  id: string;
  label: string;
  isCustom?: boolean;
}

interface Skill {
  _id?: string;
  name: string;
  short?: string;
  staffCount?: number;
  type?: string;
}

interface Staff {
  _id?: string;
  name: string;
  age?: string;
  gender?: string;
  email_address?: string;
  position?: Position[];
  skills?: Skill[];
  // farms this staff is assigned to (matches backend `assigned_farm` shape)
  assigned_farm?: Array<{
    _id?: string;
    name?: string;
    location?: Location;
  }>;
  contact_number?: string;
  time_in_field?: string;
}

const GreenPages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const authFetch = useAuthFetch();

  // Modal state for adding staff
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    age: '',
    gender: '',
    position: '',
    skills: [],
    assigned_farm: [],
    time_in_field: '',
    email: '',
    contact_number: '',
  });
  // Editable suffix of the contact number. Fixed prefix will be '09' and editable part is up to 9 digits.
  const [contactRest, setContactRest] = useState('');

  // Normalize contact display to 11-digit local format starting with '09'
  const formatContact = (contact?: string | null) => {
    if (!contact) return null;
    const digits = contact.replace(/\D/g, '');
    if (!digits) return null;

    // If stored as '639XXXXXXXX' -> convert to '09XXXXXXXXX'
    if (digits.startsWith('639') && digits.length >= 11) {
      return '0' + digits.slice(2);
    }

    // If already '09XXXXXXXXX'
    if (digits.startsWith('09') && digits.length === 11) {
      return digits;
    }

    // If stored as '9XXXXXXXXX' (10 digits starting with 9), prefix 0
    if (digits.length === 10 && digits.startsWith('9')) {
      return '0' + digits;
    }

    // Fallback: return digits unchanged
    return digits;
  };

  // Fetch farms and use the first as the selected farm
  const {
    data: farmsData,
    loading: farmsLoading,
    error: farmsError,
    refetch: refetchFarms,
  } = useFetchData<Farm[]>('/farms');

  const [farmData, setFarmData] = useState<Farm | null>(null);

  useEffect(() => {
    if (Array.isArray(farmsData) && farmsData.length > 0) {
      setFarmData(farmsData[0]);
    }
  }, [farmsData]);

  // fetch staff for selected farm
  const {
    data: staffDirectoryData,
    loading: staffLoading,
    error: staffError,
    refetch: staffRefetch,
  } = useFetchData<Staff[]>(
    farmData?._id ? `/staff/farm/${farmData._id}` : null
  );

  // derive flat skills from staffDirectoryData (unique by name)
  const flatSkills: {
    _id?: string;
    name: string;
    short: string;
    type: string;
    color: string;
  }[] = useMemo(() => {
    const map = new Map<
      string,
      { _id?: string; name: string; short: string; type: string; color: string }
    >();
    if (Array.isArray(staffDirectoryData)) {
      for (const staff of staffDirectoryData) {
        if (!Array.isArray(staff.skills)) continue;
        for (const s of staff.skills) {
          const key = (s.name || s.short || '').toLowerCase();
          if (!key) continue;
          if (!map.has(key)) {
            map.set(key, {
              name: s.name || s.short || key,
              short:
                s.short ||
                s.name?.split(' ').slice(0, 2).join('') ||
                s.name ||
                key,
              type: s.type || 'General',
              color: '#16a34a',
              _id: (s as any)._id || undefined,
            });
          }
        }
      }
    }
    return Array.from(map.values());
  }, [staffDirectoryData]);

  // Skill modal state
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillStaff, setSkillStaff] = useState<Staff[] | null>(null);
  const [skillLoading, setSkillLoading] = useState(false);

  const handleSkillClick = async (skill: { _id?: string; name: string }) => {
    const { error: showError } = useToast();
    if (!farmData?._id || !skill._id) {
      showError('Missing farm or skill id', { title: 'Validation' });
      return;
    }

    setSkillLoading(true);
    try {
      const res = await authFetch<any>(
        `/staff/farm/${farmData._id}/skill/${skill._id}`
      );
      setSkillStaff(Array.isArray(res?.staff) ? res.staff : []);
      setSkillModalOpen(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch staff by skill';
      const { error: showError } = useToast();
      showError(msg, { title: 'Error' });
    } finally {
      setSkillLoading(false);
    }
  };

  // Statistics data
  const memberEachFarmData = useMemo(() => {
    if (!Array.isArray(farmsData)) return [];

    return farmsData.map((farm) => {
      // Generate random color
      const randomColor = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;

      return {
        name: farm.name,
        value: farm.memberCount,
        color: randomColor,
      };
    });
  }, [farmsData]);

  const {
    data: skillsData,
    loading: skillsLoading,
    error: skillsError,
  } = useFetchData<Skill[]>('/skills');

  const skillsCountData = useMemo(() => {
    if (!Array.isArray(skillsData)) return [];
    return skillsData.map((skill) => {
      const randomColor = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;

      return {
        name: skill.name,
        value: skill.staffCount, // Now staffCount is available
        color: randomColor,
      };
    });
  }, [skillsData]);

  const {
    data: ageData,
    loading: ageLoading,
    error: ageError,
  } = useFetchData('/staff/ageDistribution');

  const agesInAllFarmData = useMemo(() => {
    if (!Array.isArray(ageData)) return [];

    const AGE_COLORS = [
      '#4ade80',
      '#78350f',
      '#a855f7',
      '#c084fc',
      '#cbd5e1',
      '#ec4899',
    ];

    return ageData.map((item, index) => ({
      name: item.range,
      value: item.count,
      color: AGE_COLORS[index] || AGE_COLORS[0],
    }));
  }, [ageData]);

  // Modal handlers
  const openAddStaffModal = () => {
    setStaffForm({
      name: '',
      age: '',
      gender: '',
      skills: [],
      assigned_farm: farmData?._id ? [farmData._id] : [], // 🟢 pre-select the currently selected farm
      time_in_field: '',
      position: '',
      email: '',
      contact_number: '',
    });
    setContactRest('');
    setIsAddStaffModalOpen(true);
  };

  const closeAddStaffModal = () => {
    setIsAddStaffModalOpen(false);
    setIsSubmitting(false);
  };

  const handleStaffFormChange = (field: string, value: string | string[]) => {
    setStaffForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    // require name, position and a full 11-digit contact (09 + 9 digits)
    if (!staffForm.name || !staffForm.position || contactRest.length !== 9) {
      alert('Please fill in all required fields (Name, Position, Contact)');
      return;
    }
    setIsSubmitting(true);

    const position = staffForm.position.split(', ').map((position) => ({
      id: position.toLowerCase().split(' ').join('_'),
      label: position.charAt(0).toUpperCase() + position.slice(1),
    }));

    const payload = {
      ...staffForm,
      position,
      contact_number: contactRest ? `09${contactRest}` : '',
    };

    try {
      const result = await authFetch('/staff', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      staffRefetch();
      alert('New Staff Added Successfully');
    } catch (error) {
      console.log(error);
    } finally {
      closeAddStaffModal();
    }
  };

  if (farmsLoading) {
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

        {/* Leaflet Map - Full Width on Top */}
        <Card className="rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border-2 border-gray-200 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
          <div className="w-full h-56 sm:h-80 md:h-96 relative">
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-gray-200">
              <p className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                Talipapa Location
              </p>
            </div>
            <div style={{ width: '100%', height: '100%' }}>
              <LeafletMap
                farmsData={farmsData as any}
                selectedFarm={farmData as any}
                onSelectFarm={(f: any) => setFarmData(f)}
              />
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-3 flex-wrap bg-white p-2 rounded-2xl shadow-lg border-2 border-gray-200">
          <button
            onClick={() => setActiveTab('mapDropdown')}
            className={`flex-1 min-w-[120px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
              activeTab === 'mapDropdown'
                ? 'bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white shadow-lg shadow-green-200 scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md'
            }`}
          >
            🗺️ Farm Dropdown
          </button>
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
              <div className="w-full h-60 sm:h-48 md:h-56 bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center text-gray-600 font-bold text-base sm:text-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTYsMjM5LDIyMCwwLjQpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
                <div className="text-center z-10 group-hover:scale-110 transition-transform duration-300 h-full w-full">
                  {farmData?.image ? (
                    <img
                      src={farmData?.image?.url}
                      alt="Farm image"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center ">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <Sprout className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
                      </div>
                      <p className="text-green-700 font-bold text-sm sm:text-base">
                        Farm Photo
                      </p>
                    </div>
                  )}
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
                    <span className="text-green-700 font-bold text-base sm:text-lg">
                      🏷️
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">
                      Name
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-relaxed">
                      {farmData?.name ?? '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <span className="text-blue-700 font-bold text-base sm:text-lg">
                      📐
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">
                      Size
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                      {farmData?.size ?? '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <span className="text-purple-700 font-bold text-base sm:text-lg">
                      ⏳
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">
                      Age
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                      {farmData?.age ?? '—'} years
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <span className="text-amber-700 font-bold text-base sm:text-lg">
                      🌾
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">
                      Type
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-relaxed">
                      {farmData?.farmType ?? '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <span className="text-red-700 font-bold text-base sm:text-lg">
                      📍
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">
                      Address
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-relaxed">
                      {farmData?.address ?? '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white rounded-lg border border-gray-100 hover:border-green-400 hover:bg-green-50/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <span className="text-teal-700 font-bold text-base sm:text-lg">
                      📝
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5">
                      Description
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 break-words leading-relaxed">
                      {farmData?.description ?? '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Tab Content */}
          <div className="lg:col-span-2">
            {activeTab === 'mapDropdown' && (
              <MapDropdown
                farms={farmsData}
                selectedFarm={farmData}
                onSelectFarm={(Farm) => setFarmData(Farm)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                staffDirectory={staffDirectoryData ?? null}
                openAddStaffModal={openAddStaffModal}
              />
            )}

            {activeTab === 'skillMap' && (
              <SkillMapTab
                staffSkills={flatSkills}
                onSkillClick={handleSkillClick}
              />
            )}

            {activeTab === 'statistics' && (
              <StatisticsTab
                memberEachFarmData={memberEachFarmData}
                skillsCountData={skillsCountData}
                agesInAllFarmData={agesInAllFarmData}
                refetchFarms={refetchFarms}
              />
            )}
          </div>
        </div>

        {/* Enhanced Add Staff Modal */}
        {isAddStaffModalOpen && (
          <div
            className="fixed inset-0 z-1003 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeAddStaffModal();
            }}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
              {/* Modal Header */}
              <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">
                        Add New Staff Member
                      </h3>
                      <p className="text-green-100 text-sm font-medium">
                        Enter staff details below
                      </p>
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
              <form
                onSubmit={handleSubmitStaff}
                className="overflow-y-auto max-h-[calc(90vh-200px)]"
              >
                <div className="px-8 py-6 space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-green-100">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        Personal Information
                      </h4>
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
                          onChange={(e) =>
                            handleStaffFormChange('name', e.target.value)
                          }
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
                          onChange={(e) =>
                            handleStaffFormChange('position', e.target.value)
                          }
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
                          onChange={(e) =>
                            handleStaffFormChange('age', e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white"
                        >
                          <option value="">Select age range</option>
                          <option value="18-25 years old">
                            18-25 years old
                          </option>
                          <option value="26-35 years old">
                            26-35 years old
                          </option>
                          <option value="36-45 years old">
                            36-45 years old
                          </option>
                          <option value="46-55 years old">
                            46-55 years old
                          </option>
                          <option value="Above 55 years old">
                            Above 55 years old
                          </option>
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
                          onChange={(e) =>
                            handleStaffFormChange('gender', e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Calendar className="w-4 h-4 text-green-600" />
                        Skills
                      </label>

                      {/* Skills Checkbox Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                        {skillsData.map((skill) => (
                          <div
                            key={skill._id}
                            className="flex items-center space-x-2 p-2 hover:bg-white rounded-md transition-colors"
                          >
                            <input
                              type="checkbox"
                              id={`skill-${skill._id}`}
                              checked={
                                staffForm.skills?.includes(skill._id) || false
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const updatedSkills = isChecked
                                  ? [...(staffForm.skills || []), skill._id]
                                  : (staffForm.skills || []).filter(
                                      (id) => id !== skill._id
                                    );

                                handleStaffFormChange('skills', updatedSkills);
                              }}
                              className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <label
                              htmlFor={`skill-${skill._id}`}
                              className="flex flex-col text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              <span className="font-semibold">
                                {skill.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {skill.type}
                              </span>
                            </label>
                          </div>
                        ))}

                        {skillsData.length === 0 && (
                          <div className="col-span-2 text-center py-4 text-gray-500 text-sm">
                            No skills available
                          </div>
                        )}
                      </div>

                      {/* Selected Skills Display */}
                      {staffForm.skills && staffForm.skills.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            Selected Skills ({staffForm.skills.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {staffForm.skills.map((skillId) => {
                              const skill = skillsData.find(
                                (s) => s._id === skillId
                              );
                              return skill ? (
                                <span
                                  key={skillId}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200"
                                >
                                  {skill.name}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedSkills =
                                        staffForm.skills.filter(
                                          (id) => id !== skillId
                                        );
                                      handleStaffFormChange(
                                        'skills',
                                        updatedSkills
                                      );
                                    }}
                                    className="w-4 h-4 rounded-full bg-green-200 hover:bg-green-300 text-green-800 flex items-center justify-center text-xs font-bold"
                                  >
                                    ×
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Calendar className="w-4 h-4 text-green-600" />
                        Time in Field
                      </label>
                      <select
                        value={staffForm.time_in_field}
                        onChange={(e) =>
                          handleStaffFormChange('time_in_field', e.target.value)
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white"
                      >
                        <option value="">Select Time in Field Range</option>
                        <option value="1-2 years">0 - 1 year</option>
                        <option value="1-2 years">1 - 2 years</option>
                        <option value="2-3 years">2 - 3 years</option>
                        <option value="3-4 years">3 - 4 years</option>
                        <option value="Above 5 years">Above 5 years</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <MapPin className="w-4 h-4 text-green-600" />
                        Assigned Farms
                      </label>

                      {/* Farms Checkbox Grid */}
                      <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                        {farmsData.map((farm) => (
                          <div
                            key={farm._id}
                            className="flex items-center space-x-2 p-2 hover:bg-white rounded-md transition-colors"
                          >
                            <input
                              type="checkbox"
                              id={`farm-${farm._id}`}
                              checked={
                                staffForm.assigned_farm?.includes(farm._id) ||
                                false
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const updatedFarms = isChecked
                                  ? [
                                      ...(staffForm.assigned_farm || []),
                                      farm._id,
                                    ]
                                  : (staffForm.assigned_farm || []).filter(
                                      (id) => id !== farm._id
                                    );

                                handleStaffFormChange(
                                  'assigned_farm',
                                  updatedFarms
                                );
                              }}
                              className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <label
                              htmlFor={`farm-${farm._id}`}
                              className="flex flex-col text-sm font-medium text-gray-700 cursor-pointer flex-1"
                            >
                              <span className="font-semibold">{farm.name}</span>
                              <span className="text-xs text-gray-500">
                                {farm.farmType} • {farm.size}
                              </span>
                              <span className="text-xs text-gray-400">
                                {farm.address}
                              </span>
                            </label>
                          </div>
                        ))}

                        {farmsData.length === 0 && (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No farms available
                          </div>
                        )}
                      </div>

                      {/* Selected Farms Display */}
                      {staffForm.assigned_farm &&
                        staffForm.assigned_farm.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                              Selected Farms ({staffForm.assigned_farm.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {staffForm.assigned_farm.map((farmId) => {
                                const farm = farmsData.find(
                                  (f) => f._id === farmId
                                );
                                return farm ? (
                                  <span
                                    key={farmId}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200"
                                  >
                                    {farm.name}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedFarms =
                                          staffForm.assigned_farm.filter(
                                            (id) => id !== farmId
                                          );
                                        handleStaffFormChange(
                                          'assigned_farm',
                                          updatedFarms
                                        );
                                      }}
                                      className="w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-800 flex items-center justify-center text-xs font-bold"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-green-100">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        Contact Information
                      </h4>
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
                          onChange={(e) =>
                            handleStaffFormChange('email', e.target.value)
                          }
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

                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">
                            09
                          </span>
                          <input
                            type="text"
                            value={contactRest}
                            onChange={(e) => {
                              const digitsOnly = e.target.value.replace(
                                /\D/g,
                                ''
                              );
                              const limited = digitsOnly.slice(0, 9); // 09 + 9 digits = 11
                              setContactRest(limited);
                              // keep staffForm.contact_number in sync for any other uses
                              handleStaffFormChange(
                                'contact_number',
                                limited ? `09${limited}` : ''
                              );
                            }}
                            className="w-full pl-14 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium"
                            placeholder="9XXXXXXXX"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Contact will be saved as{' '}
                          <span className="font-medium">09XXXXXXXXX</span>. Only
                          numbers allowed.
                        </div>
                      </div>
                    </div>
                  </div>

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

        {/* Skill -> Staff Modal */}
        {skillModalOpen && (
          <div
            className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSkillModalOpen(false);
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Staff with this skill</h3>
                <button
                  onClick={() => setSkillModalOpen(false)}
                  className="text-gray-600"
                >
                  Close
                </button>
              </div>

              {skillLoading && <p>Loading...</p>}
              {!skillLoading && (!skillStaff || skillStaff.length === 0) && (
                <p className="text-sm text-gray-600">
                  No staff found for this skill.
                </p>
              )}

              {!skillLoading && skillStaff && skillStaff.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                  {skillStaff.map((s) => (
                    <div
                      key={s._id ?? s.name}
                      className="p-3 border rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-lg">{s.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Skills:</span>{' '}
                            {(Array.isArray(s.skills)
                              ? s.skills.map((sk) => sk.name).filter(Boolean)
                              : []
                            ).join(', ') || '—'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Farms:</span>{' '}
                            {(Array.isArray(s.assigned_farm)
                              ? s.assigned_farm
                                  .map((f) => f.name)
                                  .filter(Boolean)
                              : []
                            ).join(', ') || '—'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">Contact</p>
                          <p className="text-sm text-gray-700">
                            {formatContact(s.contact_number) || 'No contact'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GreenPages;
