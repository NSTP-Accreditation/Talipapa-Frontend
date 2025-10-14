import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import marker images so Vite bundles them and paths resolve correctly
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

interface Location {
  lat: number;
  lng: number;
}

export interface Farm {
  _id?: string;
  location: Location;
  name: string;
  size?: string;
  age?: string | number;
  farmType?: string;
  address?: string;
  description?: string;
}

interface LeafletMapProps {
  farmsData: Farm[] | null;
  selectedFarm: Farm | null;
  onSelectFarm?: (farm: Farm) => void;
}

// Create a specific icon instance to avoid default asset resolution issues
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

const LeafletMap: React.FC<LeafletMapProps> = ({ farmsData, selectedFarm, onSelectFarm }) => {
  const defaultCenter: [number, number] = selectedFarm
    ? [selectedFarm.location.lat, selectedFarm.location.lng]
    : [14.687906698469316, 121.02444617082957];

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !Array.isArray(farmsData) || farmsData.length === 0) return;

    // compute bounds from farms
    const latLngs = farmsData.map((f) => [f.location.lat, f.location.lng] as [number, number]);
    try {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [60, 60] });
    } catch (err) {
      // fallback to center on selected or default
      map.setView(defaultCenter, selectedFarm ? 13 : 12);
    }
  }, [farmsData, selectedFarm]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={defaultCenter}
        zoom={selectedFarm ? 13 : 12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef as any}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

        {Array.isArray(farmsData) &&
          farmsData.map((f, idx) => (
            <Marker
              key={(f._id ?? f.name) + idx}
              position={[f.location.lat, f.location.lng]}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => {
                  onSelectFarm && onSelectFarm(f);
                },
              }}
            >
              <Popup>
                <div className="max-w-xs">
                  <h4 className="font-bold">{f.name}</h4>
                  <p className="text-xs text-gray-600">{f.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
