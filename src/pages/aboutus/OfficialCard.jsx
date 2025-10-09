import React from 'react';
import { User } from 'lucide-react';

const OfficialCard = (props) => {
  const official = props.official;

  return (
    <div 
      className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
      style={{ 
        width: '200px', 
        height: '200px', 
        minWidth: '200px', 
        maxWidth: '200px',
        minHeight: '200px',
        maxHeight: '200px'
      }}
    >
      {/* Circle Avatar with Icon */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 flex-shrink-0">
        <User className="w-8 h-8 text-green-600" />
      </div>

      {/* Name */}
      <h3 className="font-extrabold text-gray-800 text-sm mb-2 leading-tight text-center">
        {official.name}
      </h3>

      {/* Role */}
      <p className="text-gray-600 text-xs leading-tight text-center flex-grow flex items-center">
        {official.role}
      </p>
    </div>
  );
};

export default OfficialCard;
