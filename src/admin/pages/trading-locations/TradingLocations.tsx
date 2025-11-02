import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Store,
  MapPinned,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import type { NominatimSuggestion } from '@/hooks/useNominatim';

// Import marker images
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Custom icon
const DefaultIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface Location {
  lat: number;
  lng: number;
}

export interface TradingLocation {
  _id?: string;
  name: string;
  address: string;
  location: Location;
  description?: string;
  createdAt?: string;
}

// Component to handle map clicks
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const TradingLocations: React.FC = () => {
  const toast = useToast();
  const [locations, setLocations] = useState<TradingLocation[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
  });

  // Default center (Philippines)
  const defaultCenter: [number, number] = [
    14.687906698469316, 121.02444617082957,
  ];

  // Load locations from localStorage (temporary - replace with API later)
  useEffect(() => {
    const savedLocations = localStorage.getItem('tradingLocations');
    if (savedLocations) {
      try {
        setLocations(JSON.parse(savedLocations));
      } catch (error) {
        console.error('Error loading locations:', error);
      }
    }
  }, []);

  // Save locations to localStorage
  const saveLocations = (newLocations: TradingLocation[]) => {
    setLocations(newLocations);
    localStorage.setItem('tradingLocations', JSON.stringify(newLocations));
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (isAdding || editingId) {
      setSelectedLocation({ lat, lng });
      toast.success('Location pinned on map');
    }
  };

  const handleAddressSelect = (suggestion: NominatimSuggestion) => {
    // Auto-fill coordinates when address is selected
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setSelectedLocation({ lat, lng });
    toast.success('Location coordinates auto-filled from address');
  };

  const handleAddLocation = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a location name');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter an address');
      return;
    }
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    const newLocation: TradingLocation = {
      _id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      description: formData.description,
      location: selectedLocation,
      createdAt: new Date().toISOString(),
    };

    const updatedLocations = [...locations, newLocation];
    saveLocations(updatedLocations);
    toast.success('Trading location added successfully');

    // Reset form
    setFormData({ name: '', address: '', description: '' });
    setSelectedLocation(null);
    setIsAdding(false);
  };

  const handleEditLocation = () => {
    if (!editingId) return;

    if (!formData.name.trim()) {
      toast.error('Please enter a location name');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter an address');
      return;
    }
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    const updatedLocations = locations.map((loc) =>
      loc._id === editingId
        ? {
            ...loc,
            name: formData.name,
            address: formData.address,
            description: formData.description,
            location: selectedLocation,
          }
        : loc
    );

    saveLocations(updatedLocations);
    toast.success('Trading location updated successfully');

    // Reset form
    setFormData({ name: '', address: '', description: '' });
    setSelectedLocation(null);
    setEditingId(null);
  };

  const handleDeleteLocation = (id: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      const updatedLocations = locations.filter((loc) => loc._id !== id);
      saveLocations(updatedLocations);
      toast.success('Trading location deleted successfully');
    }
  };

  const startEdit = (location: TradingLocation) => {
    setEditingId(location._id || null);
    setFormData({
      name: location.name,
      address: location.address,
      description: location.description || '',
    });
    setSelectedLocation(location.location);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', address: '', description: '' });
    setSelectedLocation(null);
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', address: '', description: '' });
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
          </div>

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100">
                <MapPinned className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Trading Locations
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                  Manage and geotag stores or locations where trading activities
                  happen
                </p>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                    <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>
                      {locations.length} Location
                      {locations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Interactive Map</span>
                  </div>
                </div>
              </div>
              {!isAdding && !editingId && (
                <Button
                  onClick={startAdding}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-md hover:shadow-lg transition-all px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Add Location
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-1 w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Interactive Map
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>

          <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 via-green-50/50 to-white border-b-2 border-green-100">
              <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span>Trading Locations Map</span>
              </CardTitle>
              {(isAdding || editingId) && (
                <div className="mt-3 ml-11 sm:ml-14 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-3">
                  <p className="text-xs sm:text-sm font-semibold text-blue-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Click on the map to pin the exact location
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div style={{ height: '600px', width: '100%' }}>
                <MapContainer
                  center={defaultCenter}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <MapClickHandler onLocationSelect={handleMapClick} />

                  {/* Existing locations */}
                  {locations.map((loc) => (
                    <Marker
                      key={loc._id}
                      position={[loc.location.lat, loc.location.lng]}
                      icon={DefaultIcon}
                    >
                      <Popup>
                        <div className="max-w-xs">
                          <h4 className="font-bold text-green-700">
                            {loc.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {loc.address}
                          </p>
                          {loc.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {loc.description}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Selected location marker (temporary) */}
                  {selectedLocation && (isAdding || editingId) && (
                    <Marker
                      position={[selectedLocation.lat, selectedLocation.lng]}
                      icon={
                        new L.Icon({
                          iconUrl: markerIconUrl,
                          iconRetinaUrl: markerIcon2xUrl,
                          shadowUrl: markerShadowUrl,
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [1, -34],
                          shadowSize: [41, 41],
                        })
                      }
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">
                            {isAdding ? 'New Location' : 'Updated Location'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedLocation.lat.toFixed(6)},{' '}
                            {selectedLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Management Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-1 w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {isAdding
                ? 'Add New Location'
                : editingId
                  ? 'Edit Location'
                  : 'Saved Locations'}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingId) && (
            <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 via-green-50/50 to-white border-b-2 border-green-100">
                <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                    {isAdding ? (
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <Edit2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                  </div>
                  <span>{isAdding ? 'Add New Location' : 'Edit Location'}</span>
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 ml-11 sm:ml-14">
                  Fill in the details below to{' '}
                  {isAdding ? 'add a new' : 'update the'} trading location
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gradient-to-br from-white to-gray-50">
                {/* Location Name */}
                <div className="space-y-3 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-800">
                    <span className="text-green-600">•</span>
                    Location Name
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Main Trading Center, Sari-Sari Store"
                    className="px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>

                {/* Address with Autocomplete */}
                <div className="space-y-3 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-800">
                    <span className="text-green-600">•</span>
                    Address
                    <span className="text-red-500">*</span>
                  </label>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(value) =>
                      setFormData({ ...formData, address: value })
                    }
                    onSelect={handleAddressSelect}
                    placeholder="Start typing to search for an address..."
                    countryCode="ph"
                    className="border-2 border-gray-300 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                    <AlertCircle className="w-3 h-3" />
                    Address will auto-fill coordinates on the map
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-3 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-800">
                    <span className="text-green-600">•</span>
                    Description
                    <span className="text-xs font-normal text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Additional details about this location..."
                    className="px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  />
                </div>

                {/* Coordinates Display */}
                {selectedLocation && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-1">
                          Location Coordinates Set
                        </p>
                        <div className="text-xs text-gray-700 space-y-0.5">
                          <p>
                            <span className="font-semibold">Latitude:</span>{' '}
                            {selectedLocation.lat.toFixed(6)}
                          </p>
                          <p>
                            <span className="font-semibold">Longitude:</span>{' '}
                            {selectedLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={isAdding ? handleAddLocation : handleEditLocation}
                    disabled={
                      !formData.name.trim() ||
                      !formData.address.trim() ||
                      !selectedLocation
                    }
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base min-h-[44px]"
                  >
                    <Save className="w-5 h-5" />
                    <span>
                      {isAdding ? 'Save Location' : 'Update Location'}
                    </span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="sm:flex-shrink-0 px-6 py-3.5 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base min-h-[44px]"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Locations List */}
          {!isAdding && !editingId && (
            <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 via-green-50/50 to-white border-b-2 border-green-100">
                <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                    <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span>Saved Locations ({locations.length})</span>
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 ml-11 sm:ml-14">
                  All registered trading locations and stores
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50">
                {locations.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Store className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                    <p className="text-base sm:text-lg font-bold text-gray-700 mb-2">
                      No locations added yet
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Click "Add Location" button above to get started
                    </p>
                    <button
                      onClick={startAdding}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add First Location
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto">
                    {locations.map((location) => (
                      <div
                        key={location._id}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:border-green-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0 mt-0.5">
                                <Store className="w-4 h-4 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base break-words">
                                  {location.name}
                                </h4>
                              </div>
                            </div>
                            <div className="ml-8 space-y-1.5">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs sm:text-sm text-gray-600 break-words">
                                  {location.address}
                                </p>
                              </div>
                              {location.description && (
                                <p className="text-xs sm:text-sm text-gray-500 italic pl-5">
                                  "{location.description}"
                                </p>
                              )}
                              <p className="text-xs text-gray-400 pl-5 font-mono">
                                📍 {location.location.lat.toFixed(4)},{' '}
                                {location.location.lng.toFixed(4)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => startEdit(location)}
                              className="p-2 sm:p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit location"
                            >
                              <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteLocation(location._id!)
                              }
                              className="p-2 sm:p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete location"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingLocations;
