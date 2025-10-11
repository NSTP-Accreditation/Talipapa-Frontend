import React from 'react';
import { User } from 'lucide-react';

const OfficialCard = (props) => {
  const official = props.official;

  return (
    <div 
      className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-gray-100 relative overflow-hidden group"
      style={{ 
        width: '240px', 
        height: '240px', 
        minWidth: '240px', 
        maxWidth: '240px',
        minHeight: '240px',
        maxHeight: '240px'
      }}
    >
      {/* Hover Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
        {/* Circle Avatar with Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-5 flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <User className="w-10 h-10 text-green-700" />
        </div>

        {/* Name */}
        <h3 className="font-bold text-base text-gray-800 mb-3 leading-tight text-center group-hover:text-green-700 transition-colors">
          {official.name}
        </h3>

        {/* Role */}
        <p className="text-gray-600 text-sm leading-tight text-center flex-grow flex items-center font-medium">
          {official.role}
        </p>
      </div>
    </div>
  );
};

export default OfficialCard;
