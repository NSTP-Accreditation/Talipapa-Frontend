import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { Leaf } from 'lucide-react';

interface Skill {
  _id?: string;
  name: string;
  short: string;
  type: string;
  color: string;
}

interface SkillMapTabProps {
  staffSkills: Skill[];
  onSkillClick?: (skill: Skill) => void;
}

const SkillMapTab: React.FC<SkillMapTabProps> = ({
  staffSkills,
  onSkillClick,
}) => {
  return (
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
        <div className="mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
          <p className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold leading-tight">
            💡 Skills Overview: {staffSkills.length} skill entries across the
            team
          </p>
        </div>

        {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 4+ columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          {staffSkills.map((skill, index) => (
            <div
              key={skill._id ?? index}
              onClick={() => onSkillClick && onSkillClick(skill)}
              role={onSkillClick ? 'button' : undefined}
              tabIndex={onSkillClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onSkillClick && (e.key === 'Enter' || e.key === ' '))
                  onSkillClick(skill);
              }}
              className="rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 lg:p-5 text-center font-bold text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer relative overflow-hidden group min-h-[80px] sm:min-h-[90px] md:min-h-[100px] flex flex-col justify-center"
              style={{ backgroundColor: skill.color }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300"></div>

              {/* Skill short name - responsive text sizing */}
              <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-tight relative z-[10] mb-1 sm:mb-1.5">
                {skill.short}
              </p>

              {/* Skill type - smaller on mobile */}
              <div className="mt-1 sm:mt-1.5 md:mt-2 pt-1 sm:pt-1.5 md:pt-2 border-t border-white/40">
                <span className="text-[10px] sm:text-xs md:text-sm opacity-90 font-semibold leading-tight block">
                  {skill.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-specific footer info */}
        <div className="mt-3 sm:mt-4 md:mt-6 block sm:hidden">
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium">
              Tap any skill to view details
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillMapTab;
