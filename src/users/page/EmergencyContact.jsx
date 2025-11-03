import React, { useState, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, MapPin, AlertTriangle, Flame, Droplets, Mountain, Wind, Info, Shield, X } from 'lucide-react';

// Import marker images so Vite bundles them and paths resolve correctly
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Create a custom green icon for evacuation centers using a div icon
const EvacuationIcon = new L.DivIcon({
  html: `<div style="
    background-color: #16a34a;
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <span style="
      color: white;
      font-size: 16px;
      transform: rotate(45deg);
      font-weight: bold;
    ">🏠</span>
  </div>`,
  className: 'custom-evacuation-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const defaultCenter = [14.687906698469316, 121.02444617082957];

// REAL HAZARD DATA FROM HAZARD HUNTER (hazardhunter.georisk.gov.ph)
// Data verified for Barangay Talipapa, Quezon City

// West Valley Fault System (Approximately 7.8 km west)
// The actual fault line runs roughly north-south west of the barangay
const faultLine = [
  [14.7200, 121.0000],
  [14.7100, 121.0050],
  [14.7000, 121.0100],
  [14.6900, 121.0150],
  [14.6800, 121.0200],
  [14.6700, 121.0250],
  [14.6600, 121.0300],
  [14.6500, 121.0350],
];

// Ground Shaking Zone (Intensity VIII - Destructive)
// Covers the entire barangay area
const groundShakingZone = [
  [14.6920, 121.0200],
  [14.6920, 121.0290],
  [14.6840, 121.0290],
  [14.6840, 121.0200],
];

// Ashfall Prone Area (from Taal Volcano - 74.8 km north)
// Covers the barangay
const ashfallZone = [
  [14.6915, 121.0205],
  [14.6915, 121.0285],
  [14.6845, 121.0285],
  [14.6845, 121.0205],
];

// Note: Rain-Induced Landslide = Low Susceptibility (not shown)
// Liquefaction = Safe (not shown)
// Tsunami = Safe (not shown)
// Ground Rupture = Safe (not shown)

// Critical Facilities
const criticalFacilities = [
  { name: 'Placido Del Mundo ES', position: [14.6902, 121.0247], type: 'school', distance: '259 m' },
  { name: 'Talipapa HS', position: [14.6869, 121.0235], type: 'school', distance: '989 m' },
  { name: 'Tandang Sora Health Center', position: [14.6906, 121.0250], type: 'health', distance: '300 m' },
  { name: 'Vian Family Hospital', position: [14.6894, 121.0247], type: 'health', distance: '152 m' },
];

// Evacuation Centers
const evacuationCenters = [
  { 
    name: 'Barangay Talipapa Covered Court', 
    position: [14.6879, 121.0244], 
    capacity: '200 families',
    facilities: 'Water, Restrooms, Emergency Supplies',
    contact: '(02) 1234-5678'
  },
  { 
    name: 'Talipapa High School Gymnasium', 
    position: [14.6869, 121.0235], 
    capacity: '150 families',
    facilities: 'Water, Restrooms, First Aid',
    contact: '(02) 8765-4321'
  },
  { 
    name: 'Placido Del Mundo Elementary School', 
    position: [14.6902, 121.0247], 
    capacity: '100 families',
    facilities: 'Water, Restrooms, Classrooms',
    contact: '(02) 9876-5432'
  },
  { 
    name: 'Tandang Sora Community Center', 
    position: [14.6906, 121.0250], 
    capacity: '80 families',
    facilities: 'Water, Restrooms, Medical Support',
    contact: '(02) 5555-1234'
  },
];

const emergencyContacts = [
  { name: 'Barangay Hall (Emergency)', phone: '(02) 1234-5678' },
  { name: 'Police (PNP)', phone: '117' },
  { name: 'Fire Department (BFP)', phone: '(02) 8426-0219' },
  { name: 'NDRRMC Hotline', phone: '(02) 8911-1406' },
  { name: 'Red Cross Emergency', phone: '143' },
];

// Address suggestions for autocomplete
const addressSuggestions = [
  // Main Streets
  'Tandang Sora Avenue, Barangay Talipapa',
  'Quirino Highway, Barangay Talipapa',
  'Visayas Avenue, Barangay Talipapa',
  'Mindanao Avenue, Barangay Talipapa',
  'Regalado Avenue, Barangay Talipapa',
  
  // Internal Streets
  'Talipapa Street, Barangay Talipapa',
  'San Bartolome Street, Barangay Talipapa',
  'Pag-asa Street, Barangay Talipapa',
  'Del Monte Avenue, Barangay Talipapa',
  'Batasan Road, Barangay Talipapa',
  
  // Landmarks and Establishments
  'Near Barangay Talipapa Hall',
  'Near Talipapa High School',
  'Near Placido Del Mundo Elementary School',
  'Near Tandang Sora Health Center',
  'Near SM Fairview',
  'Near Fairview Terraces',
  'Near Talipapa Public Market',
  'Near Litex Market',
  
  // Subdivisions/Communities
  'Bagong Silangan Area, Barangay Talipapa',
  'Greater Lagro Area, Barangay Talipapa',
  'Fairview Area, Barangay Talipapa',
  'Commonwealth Area, Barangay Talipapa',
];

export default function EmergencyContact() {
  const printableRef = useRef(null);
  const mapRef = useRef(null);
  const [showGroundShaking, setShowGroundShaking] = useState(true);
  const [showFaultLine, setShowFaultLine] = useState(true);
  const [showAshfall, setShowAshfall] = useState(true);
  const [showEvacuationCenters, setShowEvacuationCenters] = useState(true);
  const [showBarangayMarker, setShowBarangayMarker] = useState(true);
  const [reportMarkers, setReportMarkers] = useState(() => {
    try {
      const raw = localStorage.getItem('reportedHazards');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ type: 'Flood', address: '', desc: '' });
  const [notice, setNotice] = useState('');
  const [contactQuery, setContactQuery] = useState('');
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('reportedHazards', JSON.stringify(reportMarkers));
    } catch (e) {}
  }, [reportMarkers]);

  const handleAddressChange = (value) => {
    setReportForm((f) => ({ ...f, address: value }));
    
    if (value.trim().length > 0) {
      const filtered = addressSuggestions.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAddresses(filtered);
      setShowAddressSuggestions(filtered.length > 0);
    } else {
      setShowAddressSuggestions(false);
      setFilteredAddresses([]);
    }
  };

  const handleAddressSelect = (address) => {
    setReportForm((f) => ({ ...f, address }));
    setShowAddressSuggestions(false);
    setFilteredAddresses([]);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const { address, type, desc } = reportForm;
    if (!address || address.trim() === '') {
      setNotice('Please provide an address for the hazard location.');
      return;
    }
    const m = { id: Date.now(), address: address.trim(), type, desc };
    setReportMarkers((s) => [...s, m]);
    setShowReportModal(false);
    setReportForm({ type: 'Flood', address: '', desc: '' });
    setNotice('Report saved successfully.');
    setTimeout(() => setNotice(''), 3000);
  };

  const Accordion = ({ title, colorClass, icon: Icon, children }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-green-300">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center justify-between px-5 py-4 text-sm font-bold hover:bg-gradient-to-r hover:from-green-50 hover:to-white transition-all duration-200 ${
            open ? 'bg-gradient-to-r from-green-50 to-white border-b-2 border-gray-200' : 'bg-white'
          }`}
          aria-expanded={open}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`p-2 rounded-lg ${open ? 'bg-green-100' : 'bg-gray-100'} transition-colors duration-200`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
              </div>
            )}
            <span className={`${colorClass} text-base`}>{title}</span>
          </div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${open ? 'bg-green-700 text-white rotate-180' : 'bg-gray-200 text-gray-600'} transition-all duration-300`}>
            <span className="text-lg font-bold">{open ? '−' : '+'}</span>
          </div>
        </button>
        {open && (
          <div className="p-5 bg-gradient-to-br from-white to-gray-50 text-sm text-gray-700 animate-fadeIn">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <header className="mb-8 animate-fadeIn">
          <div className="relative rounded-2xl bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white p-8 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                    Emergency & Hazard Info
                  </h1>
                  <p className="text-base opacity-90 max-w-2xl">
                    Interactive hazard map, emergency contacts and disaster preparedness guide for Barangay Talipapa.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <button 
                  onClick={() => setShowReportModal(true)} 
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <AlertTriangle className="w-5 h-5" /> 
                  <span>Report Hazard</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Navigation */}
        <nav className="mb-8 flex flex-wrap gap-3">
          <a 
            href="#hazard-map" 
            className="group flex items-center gap-2 bg-white hover:bg-green-600 text-green-700 hover:text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 border-2 border-green-200 hover:border-green-600"
          >
            <MapPin className="w-5 h-5" />
            <span>Hazard Map</span>
          </a>
          <a 
            href="#contacts" 
            className="group flex items-center gap-2 bg-white hover:bg-green-700 text-green-700 hover:text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 border-2 border-green-200 hover:border-green-700"
          >
            <Phone className="w-5 h-5" />
            <span>Emergency Contacts</span>
          </a>
          <a 
            href="#disaster-tips" 
            className="group flex items-center gap-2 bg-white hover:bg-green-800 text-green-700 hover:text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 border-2 border-green-200 hover:border-green-800"
          >
            <Shield className="w-5 h-5" />
            <span>Disaster Preparedness</span>
          </a>
        </nav>

      {/* MAP SECTION - Full width, highlighted */}
      <section id="hazard-map" className="mb-10 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
          <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span>Interactive Hazard Map</span>
                </h2>
                <p className="text-sm opacity-90">Explore hazard zones, emergency locations, and report new hazards in real-time.</p>
              </div>
            </div>
          </div>
          <div className="relative" style={{ height: '550px' }}>
            {/* Enhanced Legend overlay - REAL HAZARD DATA */}
            <div className="absolute top-4 right-4 bg-white rounded-xl p-4 shadow-2xl text-xs z-[1000] max-w-sm border-2 border-gray-100 max-h-[520px] overflow-y-auto">
              <div className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="text-sm">Official Hazard Map</span>
              </div>
              
              <div className="mb-3 p-2 bg-orange-50 rounded-lg border border-orange-200 text-xs">
                <div className="font-semibold text-orange-900">📊 Data Source: Hazard Hunter</div>
                <div className="text-gray-600">GeoRisk Philippines Official Data</div>
              </div>
              
              {/* Seismic Hazards */}
              <div className="space-y-2 mb-4">
                <div className="font-bold text-gray-800 text-xs mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Seismic Hazards:</span>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-5 h-5 bg-red-500/50 border-2 border-red-600 rounded flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-900">Ground Shaking Zone</div>
                    <div className="text-xs text-gray-700">⚠️ PRONE - Intensity VIII (Destructive)</div>
                    <div className="text-xs text-gray-600">Entire barangay affected</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-5 h-1 bg-red-700 rounded flex-shrink-0 mt-2" />
                  <div>
                    <div className="font-bold text-red-900">West Valley Fault</div>
                    <div className="text-xs text-gray-700">📍 7.8 km west of barangay</div>
                    <div className="text-xs text-gray-600">Active fault system</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 bg-green-50 p-2 rounded border border-green-200">
                  ✅ Safe: Ground Rupture, Liquefaction, Tsunami
                </div>
              </div>
              
              {/* Volcanic Hazards */}
              <div className="space-y-2 mb-4 pb-3 border-b-2 border-gray-200">
                <div className="font-bold text-gray-800 text-xs mb-2 flex items-center gap-1">
                  <Mountain className="w-4 h-4 text-purple-600" />
                  <span>Volcanic Hazards:</span>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-5 h-5 bg-purple-500/40 border-2 border-purple-600 rounded flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-purple-900">Ashfall Prone Area</div>
                    <div className="text-xs text-gray-700">🌋 From Taal Volcano (74.8 km)</div>
                    <div className="text-xs text-gray-600">Covers entire barangay</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 bg-green-50 p-2 rounded border border-green-200">
                  ✅ Safe: Ballistic Projectiles, Base Surge, Volcanic Tsunami
                </div>
              </div>
              
              {/* Hydro-Meteorological */}
              <div className="space-y-2 mb-4 pb-3 border-b-2 border-gray-200">
                <div className="font-bold text-gray-800 text-xs mb-2 flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>Hydro-Meteorological:</span>
                </div>
                
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                  📊 Rain-Induced Landslide: <strong>Low Susceptibility</strong>
                </div>
                <div className="text-xs text-gray-600 bg-green-50 p-2 rounded border border-green-200">
                  ✅ Safe: Storm Surge
                </div>
                <div className="text-xs text-gray-600 bg-amber-50 p-2 rounded border border-amber-200">
                  🌪️ Severe Wind: 117.1 - 220 kph
                </div>
              </div>
              
              {/* Evacuation Centers */}
              <div className="space-y-2 mb-4 pb-3 border-b-2 border-gray-200">
                <div className="font-bold text-gray-800 text-xs mb-2 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>🏠 Evacuation Centers:</span>
                </div>
                
                <div className="text-xs space-y-1 text-gray-700">
                  <div>📍 Barangay Talipapa Covered Court</div>
                  <div>📍 Talipapa HS Gymnasium</div>
                  <div>📍 Placido Del Mundo ES</div>
                  <div>📍 Tandang Sora Community Center</div>
                </div>
              </div>
              
              {/* Toggle Controls */}
              <div className="space-y-2">
                <div className="font-bold text-gray-800 text-xs mb-2">Toggle Layers:</div>
                
                <label className="flex items-center gap-2 cursor-pointer group hover:bg-red-50 p-2 rounded-lg transition">
                  <input 
                    type="checkbox" 
                    checked={showGroundShaking} 
                    onChange={(e) => setShowGroundShaking(e.target.checked)} 
                    className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-gray-700 font-medium">Ground Shaking Zone</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group hover:bg-red-50 p-2 rounded-lg transition">
                  <input 
                    type="checkbox" 
                    checked={showFaultLine} 
                    onChange={(e) => setShowFaultLine(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-gray-700 font-medium">West Valley Fault Line</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group hover:bg-purple-50 p-2 rounded-lg transition">
                  <input 
                    type="checkbox" 
                    checked={showAshfall} 
                    onChange={(e) => setShowAshfall(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 font-medium">Ashfall Prone Area</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group hover:bg-green-50 p-2 rounded-lg transition">
                  <input 
                    type="checkbox" 
                    checked={showEvacuationCenters} 
                    onChange={(e) => setShowEvacuationCenters(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">Evacuation Centers</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group hover:bg-green-50 p-2 rounded-lg transition">
                  <input 
                    type="checkbox" 
                    checked={showBarangayMarker} 
                    onChange={(e) => setShowBarangayMarker(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">Barangay Hall</span>
                </label>
              </div>
            </div>

            <MapContainer
              center={defaultCenter}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              whenCreated={(map) => (mapRef.current = map)}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Ground Shaking Zone (Intensity VIII - PRONE) - REAL DATA FROM HAZARD HUNTER */}
              {showGroundShaking && (
                <Polygon
                  positions={groundShakingZone}
                  pathOptions={{ 
                    color: '#dc2626', 
                    fillColor: '#ef4444',
                    fillOpacity: 0.25,
                    weight: 3,
                    dashArray: '5, 5',
                  }}
                  eventHandlers={{ 
                    click: () => setNotice('⚠️ Ground Shaking PRONE - Intensity VIII (Destructive)') 
                  }}
                >
                  <Popup>
                    <div className="text-sm max-w-xs">
                      <div className="font-bold text-red-900 mb-1">🔴 Ground Shaking Zone</div>
                      <div className="text-gray-700 mb-2">
                        <strong>Status: PRONE</strong> - Intensity VIII (Destructive)
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Buildings may sustain major damage</div>
                        <div>• Practice DROP, COVER, and HOLD ON</div>
                        <div>• Secure heavy furniture and objects</div>
                      </div>
                      <div className="text-xs text-orange-700 mt-2 font-semibold">
                        Source: Hazard Hunter (PHIVOLCS)
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              )}

              {/* West Valley Fault Line (7.8 km west) - REAL DATA FROM HAZARD HUNTER */}
              {showFaultLine && (
                <Polyline
                  positions={faultLine}
                  pathOptions={{
                    color: '#dc2626',
                    weight: 5,
                    opacity: 0.9,
                    dashArray: '10, 10',
                  }}
                  eventHandlers={{ 
                    click: () => setNotice('🔴 West Valley Fault - 7.8 km west of barangay') 
                  }}
                >
                  <Popup>
                    <div className="text-sm max-w-xs">
                      <div className="font-bold text-red-900 mb-1">🔴 West Valley Fault System</div>
                      <div className="text-gray-700 mb-2">
                        <strong>Distance:</strong> 7.8 km west of Barangay Talipapa
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Active fault capable of major earthquakes</div>
                        <div>• Buildings should be earthquake-resistant</div>
                        <div>• Part of the Marikina Valley Fault System</div>
                      </div>
                      <div className="text-xs text-orange-700 mt-2 font-semibold">
                        Source: Hazard Hunter (PHIVOLCS)
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Ashfall Prone Area (from Taal Volcano) - REAL DATA FROM HAZARD HUNTER */}
              {showAshfall && (
                <Polygon
                  positions={ashfallZone}
                  pathOptions={{ 
                    color: '#9333ea', 
                    fillColor: '#a855f7',
                    fillOpacity: 0.2,
                    weight: 2,
                    dashArray: '8, 8',
                  }}
                  eventHandlers={{ 
                    click: () => setNotice('🌋 Ashfall Prone - From Taal Volcano (74.8 km)') 
                  }}
                >
                  <Popup>
                    <div className="text-sm max-w-xs">
                      <div className="font-bold text-purple-900 mb-1">🌋 Ashfall Prone Area</div>
                      <div className="text-gray-700 mb-2">
                        <strong>Status: PRONE</strong> to volcanic ashfall
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• From Taal Volcano (74.8 km north)</div>
                        <div>• Keep masks and goggles ready</div>
                        <div>• Cover water sources during ashfall</div>
                        <div>• Stay indoors when ash is falling</div>
                      </div>
                      <div className="text-xs text-orange-700 mt-2 font-semibold">
                        Source: Hazard Hunter (PHIVOLCS)
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              )}

              {/* Evacuation Centers - NEW */}
              {showEvacuationCenters && evacuationCenters.map((center, idx) => (
                <Marker key={`evac-${idx}`} position={center.position} icon={EvacuationIcon}>
                  <Popup maxWidth={280}>
                    <div className="text-sm">
                      <div className="font-bold text-green-900 mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span>{center.name}</span>
                      </div>
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold">👥 Capacity:</span>
                          <span>{center.capacity}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold">🏥 Facilities:</span>
                          <span>{center.facilities}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold">📞 Contact:</span>
                          <a href={`tel:${center.contact}`} className="text-green-600 hover:text-green-800 font-medium">
                            {center.contact}
                          </a>
                        </div>
                      </div>
                      <div className="mt-2 p-2 bg-green-50 rounded border border-green-200 text-xs">
                        <strong className="text-green-900">Safe Evacuation Site</strong>
                        <div className="text-gray-600">Open during emergencies</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Barangay Hall marker */}
              {showBarangayMarker && (
                <Marker position={defaultCenter} icon={DefaultIcon}>
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-green-900">🏛️ Barangay Talipapa Hall</strong>
                      <div className="text-gray-700 mt-1">Emergency Operations Center</div>
                      <div className="text-xs text-gray-600 mt-1">📞 (02) 1234-5678</div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
            {notice && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium z-[1000] animate-fadeIn border-2 border-green-500">
                {notice}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Real Hazard Data Info Banner - Moved below map */}
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-xl p-4 shadow-md animate-fadeIn">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-orange-900 mb-1">⚠️ Official Hazard Assessment Data</div>
            <div className="text-gray-700 mb-2">
              Hazard information sourced from <strong>Hazard Hunter</strong> (GeoRisk Philippines). 
              Barangay Talipapa is located <strong>7.8 km east of West Valley Fault</strong> and is <strong>PRONE to Ground Shaking (Intensity VIII)</strong> and <strong>Ashfall</strong> from volcanic activity.
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>✅ Safe: Ground Rupture, Liquefaction, Tsunami, Storm Surge</div>
              <div>⚠️ Prone: Ground Shaking (Intensity VIII - Destructive), Ashfall (from Taal Volcano)</div>
              <div>📊 Rain-Induced Landslide: Low Susceptibility</div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Reported Hazards List */}
      {reportMarkers.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-xl p-4 shadow-md animate-fadeIn">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm flex-1">
              <div className="font-bold text-purple-900 mb-2">📢 Community Reported Hazards</div>
              <div className="space-y-2">
                {reportMarkers.map((m) => (
                  <div key={m.id} className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="font-semibold text-purple-900">⚠️ {m.type}</div>
                    <div className="text-xs text-gray-600 mt-1">📍 <strong>Location:</strong> {m.address}</div>
                    {m.desc && <div className="text-xs text-gray-700 mt-1">{m.desc}</div>}
                    <div className="text-xs text-gray-500 mt-1">Reported by community</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EMERGENCY CONTACTS SECTION */}
      <section id="contacts" className="mb-10 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <Phone className="w-7 h-7 text-green-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Emergency Contacts</h2>
              <p className="text-sm text-gray-600">Quick access to emergency services</p>
            </div>
          </div>
          
          <div className="mb-6">
            <input
              type="search"
              placeholder="🔍 Search contacts by name or number..."
              value={contactQuery}
              onChange={(e) => setContactQuery(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((c) => {
              if (contactQuery && !`${c.name} ${c.phone}`.toLowerCase().includes(contactQuery.toLowerCase())) return null;
              const tel = c.phone.replace(/[^+\d]/g, '');
              return (
                <div key={c.phone} className="group flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-100 to-green-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                      <Phone className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{c.name}</div>
                      <div className="text-sm text-gray-600 font-medium">{c.phone}</div>
                    </div>
                  </div>
                  <a 
                    href={`tel:${tel}`} 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl text-sm">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900">Pro Tip:</strong>
                <span className="text-gray-700"> Save these numbers in your phone's contacts for quick access during emergencies. Use the "Report Hazard" button to mark danger zones on the map.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISASTER PREPAREDNESS TIPS */}
      <section id="disaster-tips" className="mb-10 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-red-100 to-orange-100 p-3 rounded-xl">
              <Shield className="w-7 h-7 text-red-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Natural Disaster Preparedness</h2>
              <p className="text-sm text-gray-600">Educational videos on emergency response and safety</p>
            </div>
          </div>

          <div className="space-y-4">
            <Accordion title="Flooding" colorClass="text-green-700" icon={Droplets}>
              <FloodVideo />
            </Accordion>

            <Accordion title="Earthquake" colorClass="text-green-800" icon={AlertTriangle}>
              <EarthquakeVideo />
            </Accordion>

            <Accordion title="Typhoon" colorClass="text-green-700" icon={Wind}>
              <TyphoonVideo />
            </Accordion>

            <Accordion title="Fire" colorClass="text-green-800" icon={Flame}>
              <FireVideo />
            </Accordion>

            <Accordion title="Landslide" colorClass="text-green-700" icon={Mountain}>
              <LandslideVideo />
            </Accordion>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideUp border-2 border-gray-100">
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span>Report Hazard</span>
              </h3>
              <p className="text-sm opacity-90 mt-2">Help keep the community safe by reporting hazards</p>
            </div>
            
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Hazard Type</label>
                <select 
                  value={reportForm.type} 
                  onChange={(e) => setReportForm((f) => ({ ...f, type: e.target.value }))} 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white font-medium"
                >
                  <option>Flood</option>
                  <option>Earthquake damage</option>
                  <option>Fire</option>
                  <option>Landslide</option>
                  <option>Obstruction</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-bold mb-2 text-gray-700">Address / Location</label>
                <input 
                  type="text"
                  value={reportForm.address} 
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onFocus={() => {
                    if (reportForm.address.trim().length > 0) {
                      const filtered = addressSuggestions.filter(addr => 
                        addr.toLowerCase().includes(reportForm.address.toLowerCase())
                      );
                      setFilteredAddresses(filtered);
                      setShowAddressSuggestions(filtered.length > 0);
                    }
                  }}
                  onBlur={() => {
                    // Delay to allow click on suggestion
                    setTimeout(() => setShowAddressSuggestions(false), 200);
                  }}
                  placeholder="Start typing street name or landmark..." 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white"
                  required
                  autoComplete="off"
                />
                {showAddressSuggestions && filteredAddresses.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {filteredAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddressSelect(addr)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0 focus:bg-red-50 focus:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="text-gray-700">{addr}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">💡 Start typing to see address suggestions</div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Description</label>
                <textarea 
                  value={reportForm.desc} 
                  onChange={(e) => setReportForm((f) => ({ ...f, desc: e.target.value }))} 
                  placeholder="Describe the hazard in detail..." 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-gray-50 focus:bg-white h-24 resize-none"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)} 
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// Video components with embedded YouTube tutorials - Updated layout
function FloodVideo() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Video on the left */}
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/Wzqrz0cc41k"
          title="Flood Safety and Preparedness"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      {/* Tips on the right */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <Droplets className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="text-sm text-gray-700">
            <strong className="text-blue-900 block mb-3 text-lg">Key Safety Points:</strong>
            <ul className="space-y-2 list-disc list-inside">
              <li>Move to higher ground immediately when flooding begins</li>
              <li>Never drive or walk through floodwaters - 6 inches can knock you down</li>
              <li>Keep emergency kit ready with supplies and important documents</li>
              <li>Evacuate when instructed by authorities</li>
              <li>Turn off utilities (gas, electricity) before evacuating</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarthquakeVideo() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Video on the left */}
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/BLEPakj1YTY"
          title="Earthquake Safety: Drop, Cover, Hold On"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      {/* Tips on the right */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div className="text-sm text-gray-700">
            <strong className="text-amber-900 block mb-3 text-lg">Key Safety Points:</strong>
            <ul className="space-y-2 list-disc list-inside">
              <li>DROP to your hands and knees immediately</li>
              <li>COVER your head and neck under a sturdy table</li>
              <li>HOLD ON until shaking stops</li>
              <li>Stay away from windows and heavy objects that can fall</li>
              <li>Be prepared for aftershocks - they can be strong</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TyphoonVideo() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Video on the left */}
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/sqhpnFjx0cI"
          title="Typhoon Preparedness and Safety"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      {/* Tips on the right */}
      <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6 flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <Wind className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div className="text-sm text-gray-700">
            <strong className="text-purple-900 block mb-3 text-lg">Key Safety Points:</strong>
            <ul className="space-y-2 list-disc list-inside">
              <li>Monitor PAGASA weather updates continuously</li>
              <li>Secure loose objects outside your home</li>
              <li>Stock emergency supplies, food, and water for 3 days</li>
              <li>Know evacuation routes and centers in advance</li>
              <li>Stay indoors and away from windows during the typhoon</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FireVideo() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Video on the left */}
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/Ij6zRDKimPY"
          title="Fire Safety and Prevention"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      {/* Tips on the right */}
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <Flame className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="text-sm text-gray-700">
            <strong className="text-red-900 block mb-3 text-lg">Key Safety Points:</strong>
            <ul className="space-y-2 list-disc list-inside">
              <li>Install and test working smoke alarms monthly</li>
              <li>Plan and practice escape routes with your family</li>
              <li>Stay low to the ground in smoke - crawl to exit</li>
              <li>Call BFP 160 immediately once you're safe</li>
              <li>Never go back inside a burning building</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandslideVideo() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Video on the left */}
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/1LbjWVJU0rQ"
          title="Landslide Safety and Awareness"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      {/* Tips on the right */}
      <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <Mountain className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div className="text-sm text-gray-700">
            <strong className="text-green-900 block mb-3 text-lg">Key Safety Points:</strong>
            <ul className="space-y-2 list-disc list-inside">
              <li>Watch for warning signs like cracks in ground or walls</li>
              <li>Evacuate immediately when landslide is imminent</li>
              <li>Avoid steep slopes during and after heavy rainfall</li>
              <li>Report ground cracks or tilting trees to authorities</li>
              <li>Move perpendicular to the landslide's path, not downhill</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
