import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { MapPin, Leaf } from 'lucide-react';
import LeafletMap from './LeafletMap';
import { ImageInt } from '@/admin/components/OfficialsPanel';

interface Location {
  lat: number;
  lng: number;
}

export interface Farm {
  _id?: string;
  name: string;
  size: string;
  age: string;
  farmType: string;
  address: string;
  description: string;
  memberCount: number;
  location: Location;
  image?: ImageInt;
}

interface MapDropdownProps {
  farms: Farm[];
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm | null) => void;
}

const MapDropdown: React.FC<MapDropdownProps> = ({
  farms,
  selectedFarm,
  onSelectFarm,
}) => {
  // defensive: some hooks may return null before data arrives
  const farmsList = Array.isArray(farms) ? farms : [];

  return (
    <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
      {/* HEADER */}
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-3 md:pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 md:gap-3">
          <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-base md:text-xl lg:text-2xl">
              Farm Selector
            </span>
          </CardTitle>
          <div className="text-white/80 text-xs md:text-sm lg:text-base font-medium truncate max-w-full sm:max-w-none">
            {selectedFarm ? selectedFarm.name : 'No farm selected'}
          </div>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-3 md:p-4 lg:p-6 xl:p-8 bg-gradient-to-br from-gray-50 to-white space-y-4 md:space-y-6">
        {/* Dropdown */}
        <div className="space-y-1 md:space-y-2">
          <label className="block text-xs md:text-sm font-bold text-gray-700">
            Select a Farm
          </label>
          <select
            value={selectedFarm?._id || ''}
            onChange={(e) => {
              const selected = farmsList.find((f) => f._id === e.target.value);
              onSelectFarm(selected || null);
            }}
            className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white text-sm md:text-base"
          >
            <option value="">— Select a farm —</option>
            {farmsList.map((farm) => (
              <option key={farm._id || farm.name} value={farm._id || ''}>
                {farm.name} — {farm.farmType}
              </option>
            ))}
          </select>
        </div>

        {/* Farm Details */}
        {selectedFarm ? (
          <div className="space-y-3 md:space-y-4">
            {/* Farm Image */}
            {selectedFarm.image?.url && (
              <div className="relative w-full h-48 md:h-64 bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-green-200 shadow-md hover:shadow-xl transition-all duration-300">
                <img
                  src={selectedFarm.image.url}
                  alt={selectedFarm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4">
                  <p className="text-white font-bold text-sm md:text-base truncate">
                    {selectedFarm.name}
                  </p>
                </div>
              </div>
            )}

            {/* Farm Card */}
            <div className="p-4 md:p-5 bg-gradient-to-br from-white to-green-50/30 rounded-xl sm:rounded-2xl border-2 border-green-200 shadow-md hover:border-green-400 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 truncate">
                    {selectedFarm.name}
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {selectedFarm.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                <div className="bg-white/80 backdrop-blur-sm p-2.5 md:p-3 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
                  <p className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                    Size
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900 break-words">
                    {selectedFarm.size}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2.5 md:p-3 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
                  <p className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Type
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900 break-words">
                    {selectedFarm.farmType}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2.5 md:p-3 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
                  <p className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Age
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">
                    {selectedFarm.age} years
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2.5 md:p-3 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
                  <p className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Members
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">
                    {selectedFarm.memberCount}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2.5 md:p-3 rounded-lg border border-green-100 hover:border-green-300 transition-colors col-span-2">
                  <p className="text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Address
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900 break-words">
                    {selectedFarm.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 md:py-20">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-semibold text-sm md:text-base">
              Please select a farm from the dropdown above
            </p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              View detailed information about each farm
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapDropdown;
