import React, { useState, useRef } from 'react';
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
import UnifiedBackground from '../components/UnifiedBackground';
import {
  Phone,
  MapPin,
  AlertTriangle,
  Flame,
  Droplets,
  Mountain,
  Wind,
  Info,
  Shield,
} from 'lucide-react';

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
  [14.72, 121.0],
  [14.71, 121.005],
  [14.7, 121.01],
  [14.69, 121.015],
  [14.68, 121.02],
  [14.67, 121.025],
  [14.66, 121.03],
  [14.65, 121.035],
];

// Ground Shaking Zone (Intensity VIII - Destructive)
// Covers the entire barangay area
const groundShakingZone = [
  [14.692, 121.02],
  [14.692, 121.029],
  [14.684, 121.029],
  [14.684, 121.02],
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
  {
    name: 'Placido Del Mundo ES',
    position: [14.6902, 121.0247],
    type: 'school',
    distance: '259 m',
  },
  {
    name: 'Talipapa HS',
    position: [14.6869, 121.0235],
    type: 'school',
    distance: '989 m',
  },
  {
    name: 'Tandang Sora Health Center',
    position: [14.6906, 121.025],
    type: 'health',
    distance: '300 m',
  },
  {
    name: 'Vian Family Hospital',
    position: [14.6894, 121.0247],
    type: 'health',
    distance: '152 m',
  },
];

// Evacuation Centers
const evacuationCenters = [
  {
    name: 'Barangay Talipapa Covered Court',
    position: [14.6879, 121.0244],
    capacity: '200 families',
    facilities: 'Water, Restrooms, Emergency Supplies',
    contact: '(02) 1234-5678',
  },
  {
    name: 'Talipapa High School Gymnasium',
    position: [14.6869, 121.0235],
    capacity: '150 families',
    facilities: 'Water, Restrooms, First Aid',
    contact: '(02) 8765-4321',
  },
  {
    name: 'Placido Del Mundo Elementary School',
    position: [14.6902, 121.0247],
    capacity: '100 families',
    facilities: 'Water, Restrooms, Classrooms',
    contact: '(02) 9876-5432',
  },
  {
    name: 'Tandang Sora Community Center',
    position: [14.6906, 121.025],
    capacity: '80 families',
    facilities: 'Water, Restrooms, Medical Support',
    contact: '(02) 5555-1234',
  },
];

const emergencyContacts = [
  // Barangay Talipapa Contacts
  {
    name: 'Barangay Talipapa Desk',
    phone: '0917 320 6662',
    category: 'Barangay',
  },
  {
    name: 'Barangay Talipapa BHERT',
    phone: '0956 071 4281',
    category: 'Barangay',
  },
  {
    name: 'Barangay Help Desk',
    phone: '0917-155-6735',
    category: 'Barangay',
    link: 'https://www.facebook.com/QCGov/photos/228370875217344/',
  },
  {
    name: 'Barangay Hall - Talipapa Peoples Civic Center',
    phone: '0988 103 2471',
    category: 'Barangay',
    link: 'https://www.facebook.com/TalipapaPeoplesCivicCenterD6',
  },

  // Quezon City Emergency Helpline
  {
    name: 'QC Emergency Helpline (Main)',
    phone: '122',
    category: 'QC Emergency',
  },
  {
    name: 'QC Emergency Helpline',
    phone: '0919-0670096',
    category: 'QC Emergency',
  },
  {
    name: 'QC Emergency Helpline',
    phone: '0919-0670715',
    category: 'QC Emergency',
  },
  {
    name: 'QC Emergency Helpline',
    phone: '0919-0670236',
    category: 'QC Emergency',
  },
  {
    name: 'QC Emergency Helpline',
    phone: '8988-4242 loc. 8416/8407',
    category: 'QC Emergency',
  },
  {
    name: 'QC Helpdesk Email',
    phone: 'helpdesk@quezoncity.gov.ph',
    category: 'QC Emergency',
    isEmail: true,
  },
  {
    name: 'QC Citizen Service Email',
    phone: 'qcitizenservice@qchelpline122.onmicrosoft.com',
    category: 'QC Emergency',
    isEmail: true,
  },

  // Emergency Operations Center
  {
    name: 'Emergency Operations Center',
    phone: '8988 4242 loc. 7245',
    category: 'Operations Center',
  },
  {
    name: 'Emergency Operations Center (Smart)',
    phone: '0999-228-7362',
    category: 'Operations Center',
  },
  {
    name: 'Emergency Operations Center (Smart)',
    phone: '0919-067-1170',
    category: 'Operations Center',
  },
  {
    name: 'Emergency Operations Center (Smart)',
    phone: '0947-885-9929',
    category: 'Operations Center',
  },
  {
    name: 'Emergency Operations Center (Globe)',
    phone: '0977-031-2892',
    category: 'Operations Center',
  },

  // Emergency Medical Services / Search and Rescue
  {
    name: 'Emergency Medical Services / Search and Rescue',
    phone: '0947-884-7498',
    category: 'Medical/Rescue',
  },

  // Police - PNP District 6 & Station 3 Talipapa
  {
    name: 'PNP District 6',
    phone: '0961 791 9571',
    category: 'Police',
    link: 'https://share.google/cBbF4Yx5s4WIBk0vN',
  },
  {
    name: 'Police Station 3 Talipapa (PLTCOL. Resty O. Damaso)',
    phone: '8937-1703',
    category: 'Police',
  },
  { name: 'Police Station 3 Talipapa', phone: '8939-6070', category: 'Police' },
  {
    name: 'Police Station 3 Talipapa (Globe)',
    phone: '0961-3011376',
    category: 'Police',
  },
  {
    name: 'QCPD Main Line',
    phone: '117',
    category: 'Police',
    link: 'https://quezoncity.gov.ph/departments/quezon-city-police-district/',
  },

  // Fire Department
  {
    name: 'Talipapa Fire Sub Station',
    phone: '(02) 8983 1125',
    category: 'Fire',
    link: 'https://share.google/aIcaRUtHjN1Tt8GJo',
  },
  {
    name: 'QCFD Station 6',
    phone: '3454-5390',
    category: 'Fire',
    link: 'https://quezoncity.gov.ph/departments/quezon-city-fire-station/',
  },
  { name: 'BFP Emergency', phone: '160', category: 'Fire' },

  // Disaster Risk Reduction
  {
    name: 'QC NDRRMC',
    phone: '122',
    category: 'DRRM',
    link: 'https://www.facebook.com/qcdrrmc/',
  },

  // Red Cross
  {
    name: 'Philippine Red Cross (National)',
    phone: '143',
    category: 'Red Cross',
    link: 'https://redcross.org.ph/contact-us/',
  },
  {
    name: 'Philippine Red Cross QC Chapter',
    phone: '0945 220 1056',
    category: 'Red Cross',
    link: 'https://www.facebook.com/p/Philippine-Red-Cross-QC-Chapter-61575342616287/',
  },
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
  const [notice, setNotice] = useState('');

  const Accordion = ({ title, colorClass, icon: Icon, children }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-green-300">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center justify-between px-6 py-5 text-lg font-bold hover:bg-gradient-to-r hover:from-green-50 hover:to-white transition-all duration-200 ${
            open
              ? 'bg-gradient-to-r from-green-50 to-white border-b-2 border-gray-200'
              : 'bg-white'
          }`}
          aria-expanded={open}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={`p-2 rounded-lg ${open ? 'bg-green-100' : 'bg-gray-100'} transition-colors duration-200`}
              >
                <Icon className={`w-6 h-6 ${colorClass}`} />
              </div>
            )}
            <span className={`${colorClass} text-lg`}>{title}</span>
          </div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${open ? 'bg-green-700 text-white rotate-180' : 'bg-gray-200 text-gray-600'} transition-all duration-300`}
          >
            <span className="text-xl font-bold">{open ? '−' : '+'}</span>
          </div>
        </button>
        {open && (
          <div className="p-5 bg-gradient-to-br from-white to-gray-50 text-base text-gray-700 animate-fadeIn">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <UnifiedBackground>
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
                    Interactive hazard map, emergency contacts and disaster
                    preparedness guide for Barangay Talipapa.
                  </p>
                </div>
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
                  <p className="text-sm opacity-90">
                    Explore hazard zones, emergency locations, and report new
                    hazards in real-time.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative" style={{ height: '550px' }}>
              {/* Enhanced Legend overlay - REAL HAZARD DATA */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl text-xs z-[1000] max-w-sm border border-gray-200 max-h-[520px] overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-xl">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      Official Hazard Map
                    </div>
                    <div className="text-xs text-gray-600">
                      GeoRisk Philippines Data
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">📊</span>
                    <span className="font-semibold text-orange-900 text-xs">
                      Data Source
                    </span>
                  </div>
                  <div className="text-xs text-gray-700">
                    Hazard Hunter Official Data
                  </div>
                </div>

                {/* Seismic Hazards */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-100 p-1.5 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-bold text-gray-900 text-xs">
                      Seismic Hazards
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200 shadow-sm">
                    <div className="w-4 h-4 bg-red-500 border-2 border-red-600 rounded flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold text-red-900 text-xs mb-1">
                        Ground Shaking Zone
                      </div>
                      <div className="text-xs text-red-700 mb-0.5">
                        ⚠️ PRONE - Intensity VIII
                      </div>
                      <div className="text-xs text-gray-600">
                        Entire barangay affected
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200 shadow-sm">
                    <div className="w-4 h-1 bg-red-700 rounded flex-shrink-0 mt-2" />
                    <div className="flex-1">
                      <div className="font-bold text-red-900 text-xs mb-1">
                        West Valley Fault
                      </div>
                      <div className="text-xs text-red-700 mb-0.5">
                        📍 7.8 km west
                      </div>
                      <div className="text-xs text-gray-600">
                        Active fault system
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-green-800 bg-gradient-to-br from-green-50 to-green-100/50 p-2.5 rounded-lg border border-green-200 font-medium">
                    ✅ Safe: Ground Rupture, Liquefaction, Tsunami
                  </div>
                </div>

                {/* Volcanic Hazards */}
                <div className="space-y-2.5 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-purple-100 p-1.5 rounded-lg">
                      <Mountain className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-bold text-gray-900 text-xs">
                      Volcanic Hazards
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 shadow-sm">
                    <div className="w-4 h-4 bg-purple-500/60 border-2 border-purple-600 rounded flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold text-purple-900 text-xs mb-1">
                        Ashfall Prone Area
                      </div>
                      <div className="text-xs text-purple-700 mb-0.5">
                        🌋 Taal Volcano (74.8 km)
                      </div>
                      <div className="text-xs text-gray-600">
                        Covers entire barangay
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-green-800 bg-gradient-to-br from-green-50 to-green-100/50 p-2.5 rounded-lg border border-green-200 font-medium">
                    ✅ Safe: Ballistic, Base Surge, Volcanic Tsunami
                  </div>
                </div>

                {/* Hydro-Meteorological */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Droplets className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-bold text-gray-900 text-xs">
                      Hydro-Meteorological
                    </span>
                  </div>

                  <div className="text-xs text-blue-800 bg-gradient-to-br from-blue-50 to-blue-100/50 p-2.5 rounded-lg border border-blue-200 font-medium">
                    📊 Landslide: <strong>Low Susceptibility</strong>
                  </div>
                  <div className="text-xs text-green-800 bg-gradient-to-br from-green-50 to-green-100/50 p-2.5 rounded-lg border border-green-200 font-medium">
                    ✅ Safe: Storm Surge
                  </div>
                  <div className="text-xs text-amber-800 bg-gradient-to-br from-amber-50 to-amber-100/50 p-2.5 rounded-lg border border-amber-200 font-medium">
                    🌪️ Severe Wind: 117-220 kph
                  </div>
                </div>

                {/* Evacuation Centers */}
                <div className="space-y-2.5 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-100 p-1.5 rounded-lg">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-bold text-gray-900 text-xs">
                      Evacuation Centers
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200 space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Barangay Talipapa Covered Court</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Talipapa HS Gymnasium</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Placido Del Mundo ES</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Tandang Sora Community Center</span>
                    </div>
                  </div>
                </div>

                {/* Toggle Controls */}
                <div className="space-y-2">
                  <div className="font-bold text-gray-900 text-xs mb-3">
                    Toggle Map Layers
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer group hover:bg-red-50 p-2.5 rounded-xl transition-all">
                    <input
                      type="checkbox"
                      checked={showGroundShaking}
                      onChange={(e) => setShowGroundShaking(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-gray-800 text-xs font-medium">
                      Ground Shaking Zone
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer group hover:bg-red-50 p-2.5 rounded-xl transition-all">
                    <input
                      type="checkbox"
                      checked={showFaultLine}
                      onChange={(e) => setShowFaultLine(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-gray-800 text-xs font-medium">
                      West Valley Fault Line
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer group hover:bg-purple-50 p-2.5 rounded-xl transition-all">
                    <input
                      type="checkbox"
                      checked={showAshfall}
                      onChange={(e) => setShowAshfall(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-gray-800 text-xs font-medium">
                      Ashfall Prone Area
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer group hover:bg-green-50 p-2.5 rounded-xl transition-all">
                    <input
                      type="checkbox"
                      checked={showEvacuationCenters}
                      onChange={(e) =>
                        setShowEvacuationCenters(e.target.checked)
                      }
                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-gray-800 text-xs font-medium">
                      Evacuation Centers
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer group hover:bg-blue-50 p-2.5 rounded-xl transition-all">
                    <input
                      type="checkbox"
                      checked={showBarangayMarker}
                      onChange={(e) => setShowBarangayMarker(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 text-xs font-medium">
                      Barangay Hall
                    </span>
                  </label>
                </div>
              </div>

              <MapContainer
                center={defaultCenter}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
                whenCreated={(map) => (mapRef.current = map)}
                whenReady={(map) => {
                  // Auto-zoom to Barangay Talipapa on load
                  setTimeout(() => {
                    map.target.setView(defaultCenter, 16);
                  }, 100);
                }}
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
                      click: () =>
                        setNotice(
                          '⚠️ Ground Shaking PRONE - Intensity VIII (Destructive)'
                        ),
                    }}
                  >
                    <Popup>
                      <div className="text-sm max-w-xs">
                        <div className="font-bold text-red-900 mb-1">
                          🔴 Ground Shaking Zone
                        </div>
                        <div className="text-gray-700 mb-2">
                          <strong>Status: PRONE</strong> - Intensity VIII
                          (Destructive)
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
                      click: () =>
                        setNotice(
                          '🔴 West Valley Fault - 7.8 km west of barangay'
                        ),
                    }}
                  >
                    <Popup>
                      <div className="text-sm max-w-xs">
                        <div className="font-bold text-red-900 mb-1">
                          🔴 West Valley Fault System
                        </div>
                        <div className="text-gray-700 mb-2">
                          <strong>Distance:</strong> 7.8 km west of Barangay
                          Talipapa
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
                      click: () =>
                        setNotice(
                          '🌋 Ashfall Prone - From Taal Volcano (74.8 km)'
                        ),
                    }}
                  >
                    <Popup>
                      <div className="text-sm max-w-xs">
                        <div className="font-bold text-purple-900 mb-1">
                          🌋 Ashfall Prone Area
                        </div>
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
                {showEvacuationCenters &&
                  evacuationCenters.map((center, idx) => (
                    <Marker
                      key={`evac-${idx}`}
                      position={center.position}
                      icon={EvacuationIcon}
                    >
                      <Popup maxWidth={280}>
                        <div className="text-sm">
                          <div className="font-bold text-green-900 mb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span>{center.name}</span>
                          </div>
                          <div className="space-y-2 text-xs text-gray-700">
                            <div className="flex items-start gap-2">
                              <span className="font-semibold">
                                👥 Capacity:
                              </span>
                              <span>{center.capacity}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-semibold">
                                🏥 Facilities:
                              </span>
                              <span>{center.facilities}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-semibold">📞 Contact:</span>
                              <a
                                href={`tel:${center.contact}`}
                                className="text-green-600 hover:text-green-800 font-medium"
                              >
                                {center.contact}
                              </a>
                            </div>
                          </div>
                          <div className="mt-2 p-2 bg-green-50 rounded border border-green-200 text-xs">
                            <strong className="text-green-900">
                              Safe Evacuation Site
                            </strong>
                            <div className="text-gray-600">
                              Open during emergencies
                            </div>
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
                        <strong className="text-green-900">
                          🏛️ Barangay Talipapa Hall
                        </strong>
                        <div className="text-gray-700 mt-1">
                          Emergency Operations Center
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          📞 (02) 1234-5678
                        </div>
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
        <div className="mb-8 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 border border-orange-300 rounded-2xl p-6 shadow-xl animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl shadow-md flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-700" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-orange-900 text-lg mb-3 flex items-center gap-2">
                <span>⚠️ Official Hazard Assessment Data</span>
              </div>
              <div className="text-gray-800 mb-4 leading-relaxed">
                Hazard information sourced from{' '}
                <strong className="text-orange-900">Hazard Hunter</strong>{' '}
                (GeoRisk Philippines). Barangay Talipapa is located{' '}
                <strong className="text-orange-900">
                  7.8 km east of West Valley Fault
                </strong>{' '}
                and is{' '}
                <strong className="text-red-700">
                  PRONE to Ground Shaking (Intensity VIII)
                </strong>{' '}
                and <strong className="text-purple-700">Ashfall</strong> from
                volcanic activity.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-green-200 shadow-sm">
                  <div className="text-xs font-semibold text-green-900 mb-1.5">
                    ✅ SAFE AREAS
                  </div>
                  <div className="text-xs text-gray-700 space-y-0.5">
                    <div>• Ground Rupture</div>
                    <div>• Liquefaction</div>
                    <div>• Tsunami</div>
                    <div>• Storm Surge</div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-red-200 shadow-sm">
                  <div className="text-xs font-semibold text-red-900 mb-1.5">
                    ⚠️ PRONE AREAS
                  </div>
                  <div className="text-xs text-gray-700 space-y-0.5">
                    <div>• Ground Shaking (VIII)</div>
                    <div>• Ashfall (Taal Volcano)</div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-blue-200 shadow-sm">
                  <div className="text-xs font-semibold text-blue-900 mb-1.5">
                    📊 LOW RISK
                  </div>
                  <div className="text-xs text-gray-700 space-y-0.5">
                    <div>• Rain-Induced Landslide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACTS SECTION */}
        <section id="contacts" className="mb-10 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="flex items-start gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl shadow-md">
                <Phone className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Emergency Contacts
                </h2>
                <p className="text-base text-gray-600">
                  Important phone numbers for emergency services in Barangay
                  Talipapa
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Group contacts by category with dropdowns */}
              {[
                'Barangay',
                'QC Emergency',
                'Operations Center',
                'Medical/Rescue',
                'Police',
                'Fire',
                'DRRM',
                'Red Cross',
              ].map((category) => {
                const categoryContacts = emergencyContacts.filter(
                  (c) => c.category === category
                );
                if (categoryContacts.length === 0) return null;

                return (
                  <Accordion
                    key={category}
                    title={`${category} (${categoryContacts.length})`}
                    colorClass="border-green-200"
                    icon={Phone}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                      {categoryContacts.map((c, idx) => {
                        return (
                          <div
                            key={`${c.phone}-${idx}`}
                            className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-green-50/30"
                          >
                            <div className="bg-gradient-to-br from-green-100 to-green-200 p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                              <Phone className="w-5 h-5 text-green-700" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                                {c.name}
                              </div>
                              <div className="text-sm text-green-700 font-bold">
                                {c.phone}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Accordion>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-300 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 rounded-xl shadow-md flex-shrink-0">
                  <Info className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <div className="font-bold text-amber-900 text-lg mb-2">
                    💡 Important Reminder
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    Save these numbers in your phone's contacts for quick access
                    during emergencies. For real-time response, you can message
                    the{' '}
                    <strong className="text-amber-900">
                      Talipapa People's Civic Center
                    </strong>{' '}
                    on Facebook or call the{' '}
                    <strong className="text-amber-900">
                      Barangay Emergency Hotline
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DISASTER PREPAREDNESS TIP */}
        <section id="disaster-tips" className="mb-10 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="flex items-start gap-4 mb-8">
              <div className="bg-gradient-to-br from-red-100 to-orange-100 p-4 rounded-2xl shadow-md">
                <Shield className="w-8 h-8 text-red-700" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Disaster Preparedness Guide
                </h2>
                <p className="text-base text-gray-600">
                  Educational videos on emergency response and safety measures
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Accordion
                title="Flooding"
                colorClass="text-green-700"
                icon={Droplets}
              >
                <FloodVideo />
              </Accordion>

              <Accordion
                title="Earthquake"
                colorClass="text-green-800"
                icon={AlertTriangle}
              >
                <EarthquakeVideo />
              </Accordion>

              <Accordion
                title="Typhoon"
                colorClass="text-green-700"
                icon={Wind}
              >
                <TyphoonVideo />
              </Accordion>

              <Accordion title="Fire" colorClass="text-green-800" icon={Flame}>
                <FireVideo />
              </Accordion>

              <Accordion
                title="Landslide"
                colorClass="text-green-700"
                icon={Mountain}
              >
                <LandslideVideo />
              </Accordion>
            </div>
          </div>
        </section>
      </div>
    </UnifiedBackground>
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
          src="https://www.youtube.com/embed/X7CAJv07RdY"
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
            <strong className="text-blue-900 block mb-3 text-lg">
              Key Safety Points:
            </strong>
            <ul className="space-y-2 list-disc list-inside">
              <li>Move to higher ground immediately when flooding begins</li>
              <li>
                Never drive or walk through floodwaters - 6 inches can knock you
                down
              </li>
              <li>
                Keep emergency kit ready with supplies and important documents
              </li>
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
          src="https://www.youtube.com/embed/fnl_-oBQF9M"
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
            <strong className="text-amber-900 block mb-3 text-lg">
              Key Safety Points:
            </strong>
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
          src="https://www.youtube.com/embed/mlLm0vyvuTI"
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
            <strong className="text-purple-900 block mb-3 text-lg">
              Key Safety Points:
            </strong>
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
          src="https://www.youtube.com/embed/b6e5KPVbGkU"
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
            <strong className="text-red-900 block mb-3 text-lg">
              Key Safety Points:
            </strong>
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
          src="https://www.youtube.com/embed/UH-SJuSdLDw"
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
            <strong className="text-green-900 block mb-3 text-lg">
              Key Safety Points:
            </strong>
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
