import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import LeafletMap from './LeafletMap';
import MapDropdown, { Farm } from './MapDropdown';
import ProfileTab from './ProfileTab';
import SkillMapTab from './SkillMapTab';
import StatisticsTab from './StatisticsTab';
import AddStaffModal from './AddStaffModal';
import SkillStaffModal from './SkillStaffModal';
import useFetchData from '../../hooks/useFetchData';
import { useAuthFetch } from '../../hooks/useAuthFetch';

const GreenPages: React.FC = () => {
  const toast = useToast();
  const authFetch = useAuthFetch();

  const {
    data: farmsData = [],
    loading: farmsLoading,
    refetch: refetchFarms,
  } = useFetchData('/farms');
  const { data: skillsData = [], loading: skillsLoading } =
    useFetchData('/skills');
  const {
    data: staffData = [],
    loading: staffLoading,
    refetch: refetchStaff,
  } = useFetchData('/staff');

  const [activeTab, setActiveTab] = useState<
    'mapDropdown' | 'profile' | 'skillMap' | 'statistics'
  >('mapDropdown');
  const [farmData, setFarmData] = useState<Farm | null>(null);

  // Add staff modal state
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState<any>({
    name: '',
    position: '',
    age: '',
    gender: '',
    email: '',
    contact_number: '',
    skills: [],
    assigned_farm: [],
  });
  const [contactRest, setContactRest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skill modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillStaff, setSkillStaff] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(farmsData) && farmsData.length > 0 && !farmData) {
      setFarmData(farmsData[0]);
    }
  }, [farmsData]);

  const flatSkills = useMemo(() => {
    if (!skillsData || !Array.isArray(skillsData)) return [];
    return skillsData.map((s: any) => ({
      _id: s._id,
      name: s.name,
      short: s.short || s.name.slice(0, 3),
      type: s.type || 'General',
      color: s.color || '#10B981',
    }));
  }, [skillsData]);

  const memberEachFarmData = useMemo(() => {
    if (!farmsData || !Array.isArray(farmsData)) return [];
    return farmsData.map((f: any) => ({
      name: f.name,
      value: f.memberCount || 0,
      color: '#34D399',
    }));
  }, [farmsData]);

  const skillsCountData = useMemo(() => {
    if (!skillsData || !Array.isArray(skillsData)) return [];
    return skillsData.map((s: any) => ({
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

  const openAddStaffModal = () => setIsAddStaffModalOpen(true);
  const closeAddStaffModal = () => setIsAddStaffModalOpen(false);

  const handleStaffFormChange = (field: string, value: any) => {
    setStaffForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Minimal submission: attempt POST then refetch staff
      await authFetch('/staff', {
        method: 'POST',
        body: JSON.stringify(staffForm),
      });
      toast.success('Staff added');
      closeAddStaffModal();
      refetchStaff?.();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add staff');
    }
    setIsSubmitting(false);
  };

  const formatContact = (contact?: string | null) => {
    if (!contact) return null;
    const digits = contact.replace(/\D/g, '');
    if (!digits) return null;
    if (digits.startsWith('639') && digits.length >= 11)
      return '0' + digits.slice(2);
    if (digits.startsWith('09') && digits.length === 11) return digits;
    if (digits.length === 10 && digits.startsWith('9')) return '0' + digits;
    return digits;
  };

  const handleSkillClick = async (skill: any) => {
    setSkillModalOpen(true);
    setSkillLoading(true);
    try {
      // Try fetching staff for this skill (best-effort)
      const res = await authFetch(`/staff?skill=${skill._id}`);
      // assume res is array
      setSkillStaff(res || []);
    } catch (err) {
      console.error(err);
      setSkillStaff([]);
    }
    setSkillLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-3">
              <CardTitle className="text-lg font-bold text-white">
                Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: 320 }}>
                <LeafletMap
                  farmsData={farmsData}
                  selectedFarm={farmData}
                  onSelectFarm={(f: any) => setFarmData(f)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setActiveTab('mapDropdown')}
              className={`px-3 py-2 rounded ${activeTab === 'mapDropdown' ? 'bg-green-600 text-white' : 'bg-white'}`}
            >
              Map
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded ${activeTab === 'profile' ? 'bg-green-600 text-white' : 'bg-white'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('skillMap')}
              className={`px-3 py-2 rounded ${activeTab === 'skillMap' ? 'bg-green-600 text-white' : 'bg-white'}`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-3 py-2 rounded ${activeTab === 'statistics' ? 'bg-green-600 text-white' : 'bg-white'}`}
            >
              Statistics
            </button>
          </div>

          {activeTab === 'mapDropdown' && (
            <MapDropdown
              farms={farmsData}
              selectedFarm={farmData}
              onSelectFarm={(f) => setFarmData(f)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              staffDirectory={Array.isArray(staffData) ? staffData : null}
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

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={closeAddStaffModal}
        onSubmit={handleSubmitStaff}
        staffForm={staffForm}
        handleStaffFormChange={handleStaffFormChange}
        contactRest={contactRest}
        setContactRest={setContactRest}
        skillsData={skillsData}
        farmsData={farmsData}
        isSubmitting={isSubmitting}
      />

      <SkillStaffModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        skillLoading={skillLoading}
        staffList={skillStaff}
        formatContact={formatContact}
      />
    </div>
  );
};

export default GreenPages;
