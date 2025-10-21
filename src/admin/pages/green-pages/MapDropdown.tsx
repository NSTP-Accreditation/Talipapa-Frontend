import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/card';
import { MapPin } from 'lucide-react';

interface FarmLocation {
  id: string;
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
}

interface MapDropdownProps {
  locations: FarmLocation[];
  selectedLocation?: FarmLocation;
  onSelect: (location: FarmLocation) => void;
}

const MapDropdown: React.FC<MapDropdownProps> = ({
  locations,
  selectedLocation,
  onSelect,
}) => {
  return (
    <Card className="rounded-2xl shadow-2xl border-2 border-gray-200">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
        <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          Map Location Selector
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          🌍 Select a Farm Location
        </label>

        <select
          className="w-full border-2 border-green-300 rounded-xl p-3 bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700 font-medium"
          value={selectedLocation?.id ?? ''}
          onChange={(e) => {
            const loc = locations.find((l) => l.id === e.target.value);
            if (loc) onSelect(loc);
          }}
        >
          <option value="">-- Choose a Location --</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        {selectedLocation && (
          <div className="mt-5 p-4 border-2 border-green-200 rounded-xl bg-green-50 shadow-inner">
            <p className="text-sm text-gray-800 font-semibold">
              📍 {selectedLocation.name}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {selectedLocation.address}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapDropdown;
