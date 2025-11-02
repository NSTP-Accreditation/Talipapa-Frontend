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

  const handleMapClick = async (lat: number, lng: number) => {
    if (isAdding || editingId) {
      setSelectedLocation({ lat, lng });
      toast.success('Location pinned on map');

      // Reverse geocode to get address from coordinates
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Barangay-Talipapa-App',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.display_name) {
            setFormData({ ...formData, address: data.display_name });
            toast.success('Address auto-filled from map location');
          }
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        // Don't show error toast, user can still manually enter address
      }
    }
  };

  const handleAddressSelect = (suggestion: NominatimSuggestion) => {
    // Auto-fill coordinates when address is selected
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setSelectedLocation({ lat, lng });

    // Check if user typed a house/building number at the beginning
    const currentInput = formData.address.trim();
    const suggestionAddress = suggestion.display_name;

    // Match leading numbers/house numbers (e.g., "1", "123", "12-A", "1/2")
    const numberMatch = currentInput.match(/^[\d\-\/A-Za-z]+(?=\s)/);

    let finalAddress = suggestionAddress;

    if (numberMatch) {
      const houseNumber = numberMatch[0];
      // Check if the number is not already in the suggestion
      if (!suggestionAddress.startsWith(houseNumber)) {
        // Prepend the house number to the suggestion
        finalAddress = `${houseNumber} ${suggestionAddress}`;
      }
    }

    // Update the address field with the final address
    setFormData({ ...formData, address: finalAddress });
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

        {/* Main Content: Map and Sidebar Side by Side */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
            <div className="h-0.5 sm:h-1 w-6 sm:w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-800">
              {isAdding
                ? 'Add New Location'
                : editingId
                  ? 'Edit Location'
                  : 'Locations Management'}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Map Section - Left/Top */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader className="pb-2 sm:pb-4 lg:pb-6 bg-gradient-to-r from-green-50 via-green-50/50 to-white border-b-2 border-green-100">
                  <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                    <div className="p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <span className="text-xs sm:text-base lg:text-xl">
                      Interactive Map
                    </span>
                  </CardTitle>
                  {(isAdding || editingId) && (
                    <div className="mt-2 sm:mt-3 ml-7 sm:ml-11 lg:ml-14 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-blue-900 flex items-center gap-1 sm:gap-2">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        Click on the map to pin location & auto-fill address
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] sm:h-[400px] lg:h-[600px] w-full">
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
                          position={[
                            selectedLocation.lat,
                            selectedLocation.lng,
                          ]}
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

            {/* Sidebar - Right/Bottom */}
            <div className="space-y-3 sm:space-y-4">
              {/* Add/Edit Form */}
              {(isAdding || editingId) && (
                <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-2 sm:pb-4 lg:pb-6 bg-gradient-to-r from-green-50 via-green-50/50 to-white border-b-2 border-green-100">
                    <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className="p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                        {isAdding ? (
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        ) : (
                          <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        )}
                      </div>
                      <span className="text-xs sm:text-base lg:text-xl">
                        {isAdding ? 'Add New' : 'Edit'}
                      </span>
                    </CardTitle>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-1 sm:mt-2 ml-7 sm:ml-11 lg:ml-14">
                      Fill in the details to {isAdding ? 'add' : 'update'}{' '}
                      location
                    </p>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 bg-gradient-to-br from-white to-gray-50">
                    {/* Location Name */}
                    <div className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
                      <label className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs lg:text-sm font-bold text-gray-800">
                        <span className="text-green-600 text-xs sm:text-base">
                          •
                        </span>
                        Location Name
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., Main Trading Center"
                        className="px-2.5 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                      />
                    </div>

                    {/* Address with Autocomplete */}
                    <div className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
                      <label className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs lg:text-sm font-bold text-gray-800">
                        <span className="text-green-600 text-xs sm:text-base">
                          •
                        </span>
                        Address
                        <span className="text-red-500">*</span>
                      </label>
                      <AddressAutocomplete
                        value={formData.address}
                        onChange={(value) =>
                          setFormData({ ...formData, address: value })
                        }
                        onSelect={handleAddressSelect}
                        placeholder="Search address or pin on map..."
                        countryCode="ph"
                        className="border-2 border-gray-300 rounded-lg sm:rounded-xl text-xs sm:text-sm"
                      />
                      <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Auto-fills from map pin or search
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
                      <label className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs lg:text-sm font-bold text-gray-800">
                        <span className="text-green-600 text-xs sm:text-base">
                          •
                        </span>
                        Description
                        <span className="text-[10px] sm:text-xs font-normal text-gray-500">
                          (Optional)
                        </span>
                      </label>
                      <Input
                        type="text"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Additional details..."
                        className="px-2.5 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                      />
                    </div>

                    {/* Coordinates Display */}
                    {selectedLocation && (
                      <div className="p-2.5 sm:p-3 lg:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg sm:rounded-xl border-2 border-green-200">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1 sm:p-1.5 bg-green-500 rounded-md sm:rounded-lg">
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] sm:text-xs lg:text-sm font-bold text-gray-900 mb-0.5 sm:mb-1">
                              Coordinates Set
                            </p>
                            <div className="text-[10px] sm:text-xs text-gray-700 space-y-0.5">
                              <p>
                                <span className="font-semibold">Lat:</span>{' '}
                                {selectedLocation.lat.toFixed(6)}
                              </p>
                              <p>
                                <span className="font-semibold">Lng:</span>{' '}
                                {selectedLocation.lng.toFixed(6)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={
                          isAdding ? handleAddLocation : handleEditLocation
                        }
                        disabled={
                          !formData.name.trim() ||
                          !formData.address.trim() ||
                          !selectedLocation
                        }
                        className="flex-1 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base min-h-[38px] sm:min-h-[44px]"
                      >
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{isAdding ? 'Save' : 'Update'}</span>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="sm:flex-shrink-0 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-gray-500 text-white font-bold rounded-lg sm:rounded-xl hover:bg-gray-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base min-h-[38px] sm:min-h-[44px]"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Locations List */}
              {!isAdding && !editingId && (
                <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-2 sm:pb-4 lg:pb-6 bg-gradient-to-r from-green-50 via-green-50/50 to-white border-b-2 border-green-100">
                    <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className="p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                        <Store className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <span className="text-xs sm:text-base lg:text-xl">
                        Saved ({locations.length})
                      </span>
                    </CardTitle>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-1 sm:mt-2 ml-7 sm:ml-11 lg:ml-14">
                      All trading locations
                    </p>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-white to-gray-50">
                    {locations.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 lg:py-16">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <Store className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-700 mb-1 sm:mb-2">
                          No locations yet
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                          Click "Add Location" above
                        </p>
                        <button
                          onClick={startAdding}
                          className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          Add First Location
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                        {locations.map((location) => (
                          <div
                            key={location._id}
                            className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 hover:border-green-300 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between gap-2 sm:gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                                  <div className="p-1 sm:p-1.5 bg-green-100 rounded-md sm:rounded-lg flex-shrink-0 mt-0.5">
                                    <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-green-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm break-words leading-tight">
                                      {location.name}
                                    </h4>
                                  </div>
                                </div>
                                <div className="ml-5 sm:ml-6 lg:ml-7 space-y-0.5 sm:space-y-1">
                                  <div className="flex items-start gap-1 sm:gap-1.5">
                                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 break-words leading-tight">
                                      {location.address}
                                    </p>
                                  </div>
                                  {location.description && (
                                    <p className="text-[10px] sm:text-xs text-gray-500 italic pl-3 sm:pl-4 leading-tight">
                                      "{location.description}"
                                    </p>
                                  )}
                                  <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-400 pl-3 sm:pl-4 font-mono">
                                    📍 {location.location.lat.toFixed(4)},{' '}
                                    {location.location.lng.toFixed(4)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => startEdit(location)}
                                  className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md sm:rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteLocation(location._id!)
                                  }
                                  className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md sm:rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
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
      </div>
    </div>
  );
};

export default TradingLocations;
