import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Farm } from './components/MapDropdown';
import useFetchData from '../../hooks/useFetchData';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import GreenPageHeader from './components/GreenPageHeader';
import GreenPageMap from './components/GreenPageMap';
import GreenPageTabs from './components/GreenPageTabs';

const GreenPages: React.FC = () => {
  const toast = useToast();
  const authFetch = useAuthFetch();

  const {
    data: farmsData,
    loading: farmsDataLoading,
    error: farmsDataError,
    refetch: refetchFarms,
  } = useFetchData('/farms');

  const { data: skillsData, loading: skillsLoading } =
    useFetchData('/skills');
  
  const {
    data: staffData,
    loading: staffLoading,
    refetch: refetchStaff,
  } = useFetchData('/staff');

  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  // Skill modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillStaff, setSkillStaff] = useState<any[]>([]);

  useEffect(() => {
    if (farmsData && Array.isArray(farmsData?.data) && farmsData?.data.length > 0) {
      setSelectedFarm(farmsData?.data[0]);
    }
  }, [farmsData]);

  const flatSkills = useMemo(() => {
    if (!skillsData || !Array.isArray(skillsData.data)) return [];
    return skillsData.data.map((s: any) => ({
      _id: s._id,
      name: s.name,
      short: s.short || s.name.slice(0, 3),
      type: s.type || 'General',
      color: s.color || '#10B981',
    }));
  }, [skillsData]);

  const memberEachFarmData = useMemo(() => {
    if (!farmsData || !Array.isArray(farmsData.data)) return [];
    return farmsData.data.map((f: any) => ({
      name: f.name,
      value: f.memberCount || 0,
      color: '#34D399',
    }));
  }, [farmsData]);

  const skillsCountData = useMemo(() => {
    if (!skillsData || !Array.isArray(skillsData.data)) return [];
    return skillsData.data.map((s: any) => ({
      name: s.name,
      value: s.count || 0,
      color: '#60A5FA',
    }));
  }, [skillsData]);

  const agesInAllFarmData = useMemo(() => {
    // Fallback empty - real implementation would derive from staffData
    return [
      { name: '18-25', value: 5, color: '#A78BFA' },
      { name: '26-35', value: 8, color: '#F472B6' },
    ];
  }, [staffData]);

  if(farmsDataLoading) {
    return <p>Farm Loading</p>
  }

  if(!farmsData && farmsDataError) {
    return <p>Failed to fetch farm data.</p>
  }

  if(!farmsData) return;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Page Header */}
        <GreenPageHeader /> 

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GreenPageMap
            farmsData={farmsData}
            selectedFarm={selectedFarm}
            setSelectedFarm={setSelectedFarm}
          />

          <GreenPageTabs
            farmsData={farmsData}
            selectedFarm={selectedFarm}
            setSelectedFarm={setSelectedFarm}
            refetchFarms={refetchFarms}
          />
        </div>

        
      </div>
    </div>
  );
};

export default GreenPages;
