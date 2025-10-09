import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(markerIcon2x, import.meta.url).href,
  iconUrl: new URL(markerIcon, import.meta.url).href,
  shadowUrl: new URL(markerShadow, import.meta.url).href,
});


 const position = [51.505, -0.09];
 const locations = [
   {
     id: "farm_1",
    lat: 14.6846987,
    lng: 121.0312172,
     title: "MWSS Talipapa Eco Park",
   },
   {
     id: "farm_2",
     lat: 14.6857839,
     lng: 121.0263423,
    title: "Silvina Eco Park",
  },
   {
     id: "farm_3",
   lat: 14.685112,
     lng: 121.0251191,
    title: "Mendoza Urban Farm",
  },
];

function LeafletMap({ farms = [], setFarmSelectedId }) {
  const mapRef = useRef(null);

  const firstValidFarm = farms.find(
    (farm) => farm?.location?.lat != null && farm?.location?.lng != null
  );

  if (!firstValidFarm) {
    return <div>Loading map data...</div>; // or a fallback component
  }

  return (
    <div className="h-[400px] md:h-[500px]">
      <MapContainer
        center={[farms[0]?.location?.lat, farms[0]?.location?.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {farms.map((farm) => (
          <Marker
            key={farm?._id}
            position={[farm?.location?.lat, farm?.location?.lng]}
            eventHandlers={{
              click: () => setFarmSelectedId(farm._id),
            }}
          >
            <Popup>{farm?.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default LeafletMap;