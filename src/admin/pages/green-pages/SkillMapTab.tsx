import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../../../components/ui/card';
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

const SkillMapTab: React.FC<SkillMapTabProps> = ({ staffSkills, onSkillClick }) => {
  return (
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
              key={skill._id ?? index}
              onClick={() => onSkillClick && onSkillClick(skill)}
              role={onSkillClick ? 'button' : undefined}
              tabIndex={onSkillClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onSkillClick && (e.key === 'Enter' || e.key === ' ')) onSkillClick(skill);
              }}
              className="rounded-xl p-3 sm:p-4 md:p-5 text-center font-bold text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer relative overflow-hidden group"
              style={{ backgroundColor: skill.color }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300"></div>
              <p className="text-sm sm:text-base md:text-lg leading-tight relative z-10">{skill.short}</p>
              <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-white/40">
                <span className="text-xs sm:text-sm opacity-90 font-semibold">{skill.type}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillMapTab;
