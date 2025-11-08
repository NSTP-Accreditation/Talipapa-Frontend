import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { Leaf } from 'lucide-react';
import SkillStaffModal from './components/SkillStaffModal';

export interface Skill {
  _id?: string;
  name: string;
  short: string;
  type: string;
  color: string;
}

const SkillMapTab = ({
  staffData,
  staffLoading,
}: {
  staffData: any;
  staffLoading: boolean;
}) => {
  const [skillModalOpen, setSkillModalOpen] = useState(false);

  const staffSkills = staffData?.data
    .flatMap((staff) => staff?.skills)
    .filter(
      (value, index, self) =>
        index === self.findIndex((skill) => skill.name === value.name)
    );

  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);

  const onSkillClick = (skill: Skill) => {
    const staffWithSkill = staffData?.data.filter((staff) =>
      staff.skills.some((staffSkill: Skill) => staffSkill.name === skill.name)
    );
    setFilteredStaff(staffWithSkill || []);

    setSkillModalOpen(true);
  };

  return (
    <>
      <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="leading-tight">Staff Skills Matrix</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 md:p-5 lg:p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="mb-3 sm:mb-4 md:mb-5 p-3 sm:p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl sm:rounded-2xl border-2 border-green-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm md:text-base text-gray-800 font-bold">
                  Skills Overview
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  {staffSkills?.length} skill
                  {staffSkills?.length !== 1 ? 's' : ''} available across the
                  team
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 md:gap-4">
            {staffSkills.map((skill, index) => (
              <button
                key={skill._id ?? index}
                onClick={() => onSkillClick(skill)}
                className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-center font-bold text-white shadow-lg hover:shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer relative overflow-hidden group min-h-[90px] sm:min-h-[100px] md:min-h-[110px] flex flex-col justify-center border-2 border-white/20 bg-green-400"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 group-hover:from-white/10 group-hover:via-white/20 group-hover:to-white/10 transition-all duration-300"></div>
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-tight relative z-[10] mb-2 drop-shadow-md">
                  {skill.short}
                </p>

                <div className="mt-1 sm:mt-2 pt-1.5 sm:pt-2 border-t-2 border-white/30 relative z-[10]">
                  <span className="text-[10px] sm:text-xs opacity-90 font-semibold leading-tight block drop-shadow">
                    {skill.type}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-4 sm:mt-5 md:mt-6">
            <div className="text-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                <span className="hidden sm:inline">Click</span>
                <span className="sm:hidden">Tap</span> any skill card to view
                staff members with that skill
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {skillModalOpen && (
        <SkillStaffModal
          isOpen={skillModalOpen}
          onClose={() => setSkillModalOpen(false)}
          staffList={filteredStaff}
          staffLoading={staffLoading}
        />
      )}
    </>
  );
};

export default SkillMapTab;
