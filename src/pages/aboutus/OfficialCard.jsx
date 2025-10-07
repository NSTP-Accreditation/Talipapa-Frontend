import React from 'react';
import { User } from 'lucide-react';

const OfficialCard = (props) => {
  const official = props.official;

  return (
    <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
      {/* Circle Avatar with Icon */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <User className="w-8 h-8 text-green-600" />
      </div>

      {/* Name */}
      <h3 className="font-extrabold text-black-800 text-base mb-1">
        {official.name}
      </h3>

      {/* Role */}
      <p className="text-gray-600 text-sm">{official.role}</p>
    </div>
  );
};

export default OfficialCard;
