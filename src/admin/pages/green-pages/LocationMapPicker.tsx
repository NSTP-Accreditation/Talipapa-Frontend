import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';

// Import marker images
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

interface Location {
  lat: number;
  lng: number;
}

interface LocationMapPickerProps {
  value: Location | null;
  onChange: (location: Location) => void;
  onAddressUpdate?: (address: string) => void;
  className?: string;
  height?: string | number;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

// Custom icon for the marker
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

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationSelect: (location: Location) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
};

// Component to handle centering map on location change
const MapCenterUpdater: React.FC<{ center: [number, number] }> = ({
  center,
}) => {
  const map = useMapEvents({});

  useEffect(() => {
    map.flyTo(center, map.getZoom(), {
      duration: 0.5,
    });
  }, [center, map]);

  return null;
};

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  value,
  onChange,
  onAddressUpdate,
  className = '',
  height = '400px',
  defaultCenter = [14.687906698469316, 121.02444617082957], // Default to Barangay Talipapa
  defaultZoom = 13,
}) => {
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressFetchError, setAddressFetchError] = useState<string | null>(
    null
  );
  const mapRef = useRef<L.Map | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Calculate center based on value or default
  const mapCenter: [number, number] = value
    ? [value.lat, value.lng]
    : defaultCenter;

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(
    async (location: Location) => {
      if (!onAddressUpdate) return;

      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoadingAddress(true);
      setAddressFetchError(null);

      try {
        const params = new URLSearchParams({
          lat: location.lat.toString(),
          lon: location.lng.toString(),
          format: 'json',
          addressdetails: '1',
          zoom: '18',
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${params}`,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              'User-Agent': 'Barangay-Talipapa-App',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch address');
        }

        const data = await response.json();

        if (data && data.display_name) {
          onAddressUpdate(data.display_name);
        } else {
          throw new Error('No address found for this location');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setAddressFetchError(
            err.message || 'Failed to fetch address for this location'
          );
          console.error('Reverse geocoding error:', err);
        }
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [onAddressUpdate]
  );

  // Handle location selection
  const handleLocationSelect = useCallback(
    (location: Location) => {
      onChange(location);
      reverseGeocode(location);
    },
    [onChange, reverseGeocode]
  );

  // Get user's current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setAddressFetchError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingAddress(true);
    setAddressFetchError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        handleLocationSelect(location);
        setIsLoadingAddress(false);
      },
      (error) => {
        setAddressFetchError(
          'Unable to retrieve your location. Please select on the map.'
        );
        setIsLoadingAddress(false);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Map Container */}
      <div
        className="relative rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg"
        style={{ height }}
      >
        <MapContainer
          center={mapCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef as any}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <MapCenterUpdater center={mapCenter} />

          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={DefaultIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  handleLocationSelect({
                    lat: position.lat,
                    lng: position.lng,
                  });
                },
              }}
            />
          )}
        </MapContainer>

        {/* Overlay Controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLoadingAddress}
            className="bg-white hover:bg-green-50 text-green-700 p-3 rounded-xl shadow-lg border-2 border-green-200 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Get current location"
          >
            {isLoadingAddress ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Crosshair className="w-5 h-5 group-hover:text-green-600" />
            )}
          </button>
        </div>

        {/* Instructions Overlay */}
        {!value && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border-2 border-green-200 pointer-events-none">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600 animate-pulse" />
              <p className="text-sm font-semibold text-gray-700">
                Click on the map to select farm location
              </p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoadingAddress && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[999] flex items-center justify-center pointer-events-none">
            <div className="bg-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
              <span className="text-sm font-semibold text-gray-700">
                Fetching address...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Coordinates Display */}
      {value && (
        <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-green-800 mb-1">
                Selected Coordinates:
              </p>
              <p className="text-sm font-mono text-gray-700">
                Lat: {value.lat.toFixed(6)}, Lng: {value.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {addressFetchError && (
        <div className="mt-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-sm text-red-700 font-medium">
            {addressFetchError}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-blue-800 font-medium">
          <span className="font-bold">Tip:</span> Click anywhere on the map to
          select a location, or drag the marker to adjust. The address will be
          automatically populated.
        </p>
      </div>
    </div>
  );
};

export default LocationMapPicker;
