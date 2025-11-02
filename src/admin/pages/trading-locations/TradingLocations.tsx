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
import { MapPin, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

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
      toast.success('Location selected on map');
    }
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-green-600" />
            Trading Locations
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and geotag stores or locations where trading activities
            happen
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button
            onClick={startAdding}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className="lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
            <CardTitle className="text-green-700 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Trading Locations Map
              {(isAdding || editingId) && (
                <span className="text-sm font-normal text-green-600">
                  (Click on the map to select location)
                </span>
              )}
            </CardTitle>
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
                        <h4 className="font-bold text-green-700">{loc.name}</h4>
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

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Add/Edit Form */}
          {(isAdding || editingId) && (
            <Card className="border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  {isAdding ? (
                    <>
                      <Plus className="w-5 h-5" />
                      Add New Location
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-5 h-5" />
                      Edit Location
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Main Trading Center"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="e.g., 123 Main St, City"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Additional details..."
                    className="w-full"
                  />
                </div>

                {selectedLocation && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="font-semibold">Coordinates:</span>
                    <br />
                    Lat: {selectedLocation.lat.toFixed(6)}
                    <br />
                    Lng: {selectedLocation.lng.toFixed(6)}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={isAdding ? handleAddLocation : handleEditLocation}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isAdding ? 'Add' : 'Update'}
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="flex-1 border-gray-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Locations List */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
              <CardTitle className="text-green-700">
                Saved Locations ({locations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {locations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No locations added yet</p>
                  <p className="text-sm">Click "Add Location" to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {locations.map((location) => (
                    <div
                      key={location._id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-green-600" />
                            {location.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {location.address}
                          </p>
                          {location.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {location.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {location.location.lat.toFixed(4)},{' '}
                            {location.location.lng.toFixed(4)}
                          </p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(location)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            disabled={isAdding || editingId !== null}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLocation(location._id!)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isAdding || editingId !== null}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingLocations;
