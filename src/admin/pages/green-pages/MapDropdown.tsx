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
              const selected = farms.find((f) => f._id === e.target.value);
              onSelectFarm(selected || null);
            }}
            className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white text-sm md:text-base"
          >
            <option value="">— Select a farm —</option>
            {farms.map((farm) => (
              <option key={farm._id} value={farm._id}>
                {farm.name} — {farm.farmType}
              </option>
            ))}
          </select>
        </div>

        {/* Farm Details */}
        {selectedFarm ? (
          <div className="space-y-3 md:space-y-4">
            {/* Farm Card */}
            <div className="p-3 md:p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-green-400 hover:shadow-lg transition-all">
              <h4 className="text-base md:text-lg font-bold text-green-700 flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="truncate">{selectedFarm.name}</span>
              </h4>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3">
                {selectedFarm.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    Size
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900 break-words">
                    {selectedFarm.size}
                  </p>
                </div>
                <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    Type
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900 break-words">
                    {selectedFarm.farmType}
                  </p>
                </div>
                <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    Age
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">
                    {selectedFarm.age} years
                  </p>
                </div>
                <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    Members
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">
                    {selectedFarm.memberCount}
                  </p>
                </div>
                <div className="bg-green-50 p-2 md:p-3 rounded-lg col-span-2">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
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
          <div className="text-center py-8 md:py-16 text-gray-500 text-xs md:text-sm px-4">
            Please select a farm from the dropdown above to view its details.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapDropdown;
