import { useState } from 'react';
import { SquarePen, Save, Home } from 'lucide-react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';

export default function AboutBarangayEditable() {
  // Add loading state with 1 second display
  const { isLoading: pageLoading } = useLoadingState(1000);

  // Initial Data
  const [barangayInfo, setBarangayInfo] = useState(
    'Barangay Talipapa is a vibrant and progressive community dedicated to public service, sustainable development, and unity among its residents. Established in 1950, the barangay has continuously evolved to support programs that promote safety, health, and prosperity for everyone.'
  );

  const [barangayHistory, setBarangayHistory] = useState(
    'Barangay Talipapa traces its roots to a small settlement where residents engaged in trading and agriculture. Over the decades, it transformed into a well-developed barangay that embraces modernization while preserving its cultural heritage and sense of community.'
  );

  const [mission, setMission] = useState(
    'To create a sustainable, clean, and progressive community that promotes environmental awareness and responsible waste management through innovative programs and community participation.'
  );

  const [vision, setVision] = useState(
    'A model eco-friendly barangay where residents actively participate in environmental conservation, waste reduction, and sustainable living practices for future generations.'
  );

  const [officials, setOfficials] = useState([
    { role: 'Barangay Captain', name: 'Juan Dela Cruz' },
    { role: 'Kagawad - Environment', name: 'Maria Santos' },
    { role: 'Barangay Secretary', name: 'Rosa Garcia' },
    { role: 'Kagawad - Health', name: 'Pedro Ramirez' },
    { role: 'Kagawad - Education', name: 'Liza Fernandez' },
    { role: 'Kagawad - Infrastructure', name: 'Jose Mendoza' },
    { role: 'Barangay Treasurer', name: 'Ana Cruz' },
    { role: 'SK Chairman', name: 'Mark Dizon' },
  ]);

  // Edit Mode States
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [isEditingOfficials, setIsEditingOfficials] = useState(false);

  // Editable Handlers
  const handleOfficialChange = (index, key, value) => {
    const updated = [...officials];
    updated[index][key] = value;
    setOfficials(updated);
  };

  // Save Handler
  const handleSave = () => {
    setIsEditingInfo(false);
    setIsEditingHistory(false);
    setIsEditingMission(false);
    setIsEditingVision(false);
    setIsEditingOfficials(false);
    alert('✅ All changes saved successfully!');
  };

  const hasActiveEdits =
    isEditingInfo ||
    isEditingHistory ||
    isEditingMission ||
    isEditingVision ||
    isEditingOfficials;

  // Show loading skeleton while loading
  if (pageLoading) {
    return <FormTablePageSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Home className="w-10 h-10 text-green-600" />
            About Us
          </h1>
          <p className="text-lg text-gray-700 mt-3 font-medium">
            Manage barangay information, history, mission, vision, and officials
          </p>
        </div>

        {/* Save All Button */}
        {hasActiveEdits && (
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            <Save size={20} />
            Save All Changes
          </button>
        )}
      </div>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Barangay Information */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📋</span>
                Barangay Information
              </h2>
              <button
                onClick={() => setIsEditingInfo(!isEditingInfo)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <SquarePen size={14} />
                {isEditingInfo ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingInfo ? (
              <textarea
                value={barangayInfo}
                onChange={(e) => setBarangayInfo(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{barangayInfo}</p>
            )}
          </div>
        </div>

        {/* Barangay History */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📜</span>
                Barangay History
              </h2>
              <button
                onClick={() => setIsEditingHistory(!isEditingHistory)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <SquarePen size={14} />
                {isEditingHistory ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingHistory ? (
              <textarea
                value={barangayHistory}
                onChange={(e) => setBarangayHistory(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{barangayHistory}</p>
            )}
          </div>
        </div>

        {/* Mission & Vision - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🎯</span>
                  Our Mission
                </h2>
                <button
                  onClick={() => setIsEditingMission(!isEditingMission)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <SquarePen size={14} />
                  {isEditingMission ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingMission ? (
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  rows={5}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{mission}</p>
              )}
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🔭</span>
                  Our Vision
                </h2>
                <button
                  onClick={() => setIsEditingVision(!isEditingVision)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <SquarePen size={14} />
                  {isEditingVision ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingVision ? (
                <textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  rows={5}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{vision}</p>
              )}
            </div>
          </div>
        </div>

        {/* Barangay Officials */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>👥</span>
                Barangay Officials
                <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {officials.length} Officials
                </span>
              </h2>
              <button
                onClick={() => setIsEditingOfficials(!isEditingOfficials)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <SquarePen size={14} />
                {isEditingOfficials ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officials.map((official, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all duration-300 hover:shadow-md"
                >
                  {isEditingOfficials ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={official.role}
                        onChange={(e) =>
                          handleOfficialChange(index, 'role', e.target.value)
                        }
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-semibold"
                        placeholder="Role"
                      />
                      <input
                        type="text"
                        value={official.name}
                        onChange={(e) =>
                          handleOfficialChange(index, 'name', e.target.value)
                        }
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Name"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-gray-900 text-base mb-1">
                        {official.role}
                      </p>
                      <p className="text-gray-600 text-sm">{official.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// (Removed old centered EditButton helper — new implementation uses per-section edit buttons)
