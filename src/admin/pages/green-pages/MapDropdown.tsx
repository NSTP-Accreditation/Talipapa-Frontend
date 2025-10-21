import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';
import { MapPin, Leaf } from 'lucide-react';
import LeafletMap from './LeafletMap';


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
  image?: { url: string };
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
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            Farm Selector
          </CardTitle>
          <div className="text-white/80 text-sm sm:text-base font-medium">
            {selectedFarm ? selectedFarm.name : 'No farm selected'}
          </div>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white space-y-6">
        {/* Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            Select a Farm
          </label>
          <select
            value={selectedFarm?._id || ''}
            onChange={(e) => {
              const selected = farms.find((f) => f._id === e.target.value);
              onSelectFarm(selected || null);
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none text-gray-900 font-medium bg-white"
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
          <div className="space-y-4">
            {/* Farm Card */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-green-400 hover:shadow-lg transition-all">
              <h4 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5" /> {selectedFarm.name}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedFarm.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold">Size</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedFarm.size}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold">Type</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedFarm.farmType}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold">Age</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedFarm.age} years
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg sm:col-span-2">
                  <p className="text-xs text-gray-600 font-semibold">
                    Address
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedFarm.address}
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 text-sm">
            Please select a farm from the dropdown above to view its details.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapDropdown;
