import { useState } from "react";
import { SquarePen } from "lucide-react";

export default function AboutBarangayEditable() {
  // Initial Data
  const [barangayInfo, setBarangayInfo] = useState(
    "Barangay Talipapa is a vibrant and progressive community dedicated to public service, sustainable development, and unity among its residents. Established in 1950, the barangay has continuously evolved to support programs that promote safety, health, and prosperity for everyone."
  );

  const [barangayHistory, setBarangayHistory] = useState(
    "Barangay Talipapa traces its roots to a small settlement where residents engaged in trading and agriculture. Over the decades, it transformed into a well-developed barangay that embraces modernization while preserving its cultural heritage and sense of community."
  );

  const [mission, setMission] = useState(
    "To create a sustainable, clean, and progressive community that promotes environmental awareness and responsible waste management through innovative programs and community participation."
  );

  const [vision, setVision] = useState(
    "A model eco-friendly barangay where residents actively participate in environmental conservation, waste reduction, and sustainable living practices for future generations."
  );

  const [officials, setOfficials] = useState([
    { role: "Barangay Captain", name: "Juan Dela Cruz" },
    { role: "Kagawad - Environment", name: "Maria Santos" },
    { role: "Barangay Secretary", name: "Rosa Garcia" },
    { role: "Kagawad - Health", name: "Pedro Ramirez" },
    { role: "Kagawad - Education", name: "Liza Fernandez" },
    { role: "Kagawad - Infrastructure", name: "Jose Mendoza" },
    { role: "Barangay Treasurer", name: "Ana Cruz" },
    { role: "SK Chairman", name: "Mark Dizon" },
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
    alert("✅ All changes saved successfully!");
  };

  const sectionClasses =
    "mb-6 bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-200";

  // ✨ Bigger, centered Edit Button
  const EditButton = ({ onClick }) => (
    <div className="bg-gray-50 py-6 flex justify-center rounded-md mt-6">
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 px-7 py-3 
                   text-gray-800 bg-white rounded-full shadow-md 
                   hover:bg-green-100 hover:text-green-700 
                   transition-all duration-200 font-medium w-[200px]"
      >
        <SquarePen size={20} strokeWidth={2.2} />
        <span>Edit Section</span>
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-green-700 mb-2">
          About Barangay Talipapa
        </h1>
        <p className="text-gray-600 mb-10">
          Learn about our barangay’s information, history, mission, and vision.
        </p>
        <br></br>
        {/* Barangay Information */}
        <div className={sectionClasses}>
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Barangay Information
          </h2>
          {isEditingInfo ? (
            <textarea
              value={barangayInfo}
              onChange={(e) => setBarangayInfo(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-green-500"
              rows={4}
            />
          ) : (
            <p className="text-gray-700 text-justify leading-relaxed">
              {barangayInfo}
            </p>
          )}
          <EditButton onClick={() => setIsEditingInfo(!isEditingInfo)} />
        </div>

        {/* Barangay History */}
        <div className={sectionClasses}>
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Barangay History
          </h2>
          {isEditingHistory ? (
            <textarea
              value={barangayHistory}
              onChange={(e) => setBarangayHistory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-green-500"
              rows={4}
            />
          ) : (
            <p className="text-gray-700 text-justify leading-relaxed">
              {barangayHistory}
            </p>
          )}
          <EditButton onClick={() => setIsEditingHistory(!isEditingHistory)} />
        </div>

        {/* Mission */}
        <div className={sectionClasses}>
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Our Mission
          </h2>
          {isEditingMission ? (
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          ) : (
            <p className="text-gray-700 text-justify leading-relaxed">{mission}</p>
          )}
          <EditButton onClick={() => setIsEditingMission(!isEditingMission)} />
        </div>

        {/* Vision */}
        <div className={sectionClasses}>
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Our Vision
          </h2>
          {isEditingVision ? (
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          ) : (
            <p className="text-gray-700 text-justify leading-relaxed">{vision}</p>
          )}
          <EditButton onClick={() => setIsEditingVision(!isEditingVision)} />
        </div>

        {/* Officials */}
        <div className={sectionClasses}>
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            Barangay Officials
          </h2>
          {officials.map((official, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md p-[10px] mb-3 flex justify-between items-center"
            >
              {isEditingOfficials ? (
                <div className="w-full grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={official.role}
                    onChange={(e) =>
                      handleOfficialChange(index, "role", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    value={official.name}
                    onChange={(e) =>
                      handleOfficialChange(index, "name", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-gray-800">{official.role}</p>
                  <p className="text-gray-600 text-sm">{official.name}</p>
                </div>
              )}
            </div>
          ))}
          <EditButton onClick={() => setIsEditingOfficials(!isEditingOfficials)} />
        </div>

        {/* Save Button */}
        {(isEditingInfo ||
          isEditingHistory ||
          isEditingMission ||
          isEditingVision ||
          isEditingOfficials) && (
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md font-semibold"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
