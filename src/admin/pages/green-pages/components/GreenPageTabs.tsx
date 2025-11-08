import { Dispatch, SetStateAction, useState } from 'react';
import MapDropdown, { Farm } from './MapDropdown';
import StaffTab from '../StaffTab';
import SkillMapTab from '../SkillMapTab';
import useFetchData from '@/admin/hooks/useFetchData';

interface Skill {
  _id: string;
  name: string;
  short?: string;
  type?: string;
}

interface Staff {
  _id?: string;
  name: string;
  age?: string;
  gender?: string;
  emailAddress?: string;
  position: string[];
  skills: Skill[];
  contactNumber?: string;
}

type GreenPageTabsProps = {
  farmsData: { success: boolean; data: Farm[] } | undefined;
  selectedFarm: Farm | null;
  setSelectedFarm: Dispatch<SetStateAction<Farm | null>>;
};

const GreenPageTabs = ({
  farmsData,
  selectedFarm,
  setSelectedFarm,
}: GreenPageTabsProps) => {
  const [activeTab, setActiveTab] = useState<
    'mapDropdown' | 'staff' | 'skillMap' | 'statistics'
  >('mapDropdown');

  const {
    data: staffData,
    loading: staffLoading,
    error: staffError,
    refetch: refetchStaff,
  } = useFetchData<{ success: boolean; message: string; data: Staff[] }>(
    `/staff/farm/${selectedFarm?._id}`
  );

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-2 mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('mapDropdown')}
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
            activeTab === 'mapDropdown'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
            activeTab === 'staff'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
          }`}
        >
          Staff Directory
        </button>
        <button
          onClick={() => setActiveTab('skillMap')}
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
            activeTab === 'skillMap'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
          }`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
            activeTab === 'statistics'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
          }`}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'mapDropdown' && (
        <MapDropdown
          farms={farmsData?.data || []}
          selectedFarm={selectedFarm}
          onSelectFarm={(farm) => setSelectedFarm(farm)}
        />
      )}

      {activeTab === 'staff' && (
        <StaffTab
          staffData={staffData}
          staffLoading={staffLoading}
          staffError={staffError}
          refetchStaff={refetchStaff}
          selectedFarm={selectedFarm}
          farmsData={farmsData}
        />
      )}

      {activeTab === 'skillMap' && (
        <SkillMapTab 
          staffData={staffData} 
          staffLoading={staffLoading} 
        />
      )}

      {/* {activeTab === 'statistics' && (
        <StatisticsTab
          memberEachFarmData={memberEachFarmData}
          skillsCountData={skillsCountData}
          agesInAllFarmData={agesInAllFarmData}
          refetchFarms={refetchFarms}
        />
      )} */}
    </div>
  );
};

export default GreenPageTabs;
