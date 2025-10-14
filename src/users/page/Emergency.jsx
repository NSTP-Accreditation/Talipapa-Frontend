import React from 'react';

export default function Emergency() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Talipapa Hotline Section */}
      <div className="w-full flex justify-center items-center bg-gradient-to-r from-red-100 to-red-200 py-8 mb-8 shadow-lg rounded-2xl">
        <img
          src="/brgy talipapa.png"
          alt="Barangay Talipapa Logo"
          className="h-32 w-32 object-contain rounded-2xl border-4 border-red-300 shadow-xl bg-white"
        />
        <div className="ml-8">
          <h1 className="text-5xl font-extrabold text-red-700 mb-2">
            Emergency Hotline
          </h1>
          <p className="text-xl text-gray-700 font-semibold">
            Call <span className="text-red-700">0912-345-6789</span> for urgent
            help
          </p>
        </div>
      </div>

      <div className="p-8">
        {/* QC Hotline Banner Image (replaces emergency contacts section) */}
        <div className="w-full flex justify-center items-center mb-10">
          <img
            src="/public/gp1ss.png"
            alt="Quezon City Helpline Banner"
            className="w-full max-w-6xl rounded-2xl shadow-2xl border-4 border-blue-200"
          />
        </div>

        {/* Emergency Tips: Flood + Flood Map (horizontal, matches earthquake style) */}
        <div className="flex flex-row gap-10 mb-12 w-full max-w-[1600px] mx-auto items-stretch">
          <div className="bg-blue-50 border-4 border-blue-300 rounded-3xl shadow-2xl p-10 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-3">
              <svg
                className="w-10 h-10 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 008 0m0 0a4 4 0 008 0m-8 0V3"
                />
              </svg>
              Flood Emergency Tips
            </h2>
            <ul className="list-disc pl-6 space-y-4 text-lg text-blue-900 font-medium">
              <li>
                Move to higher ground immediately if there is a flood warning.
              </li>
              <li>Avoid walking or driving through floodwaters.</li>
              <li>
                Disconnect electrical appliances to prevent electrocution.
              </li>
              <li>Prepare an emergency kit with food, water, and medicines.</li>
              <li>Listen to local authorities for evacuation instructions.</li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg p-4 w-full flex flex-col items-center justify-center">
              <img
                src="/public/noah pic.png"
                alt="Flood Map of Brgy. Talipapa"
                className="w-full max-w-xl rounded-xl shadow-md mb-2"
              />
              <span className="text-blue-700 font-bold text-lg mb-1">
                Flood Hazard Map: Brgy. Talipapa
              </span>
              <span className="text-sm text-gray-500 mb-2">
                Source: NOAH Map
              </span>
              <a
                href="https://noah.up.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-semibold mb-2"
              >
                Click to View Interactive NOAH Flood Map
              </a>
              <span className="text-xs text-gray-500 text-center">
                Click the link above and use the search bar to find your
                barangay for real-time flood info.
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Tips: Earthquake + Fault Line Map (horizontal, wider, bullets) */}
        <div className="flex flex-row gap-10 mb-12 w-full max-w-[1600px] mx-auto items-stretch">
          <div className="bg-yellow-50 border-4 border-yellow-300 rounded-3xl shadow-2xl p-10 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-yellow-700 mb-6 flex items-center gap-3">
              <svg
                className="w-10 h-10 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 17l6-6 6 6"
                />
              </svg>
              Earthquake Emergency Tips
            </h2>
            <ul className="list-disc pl-6 space-y-4 text-lg text-yellow-900 font-medium">
              <li>Drop, cover, and hold on during an earthquake.</li>
              <li>Stay away from windows, glass, and heavy objects.</li>
              <li>
                If outdoors, move to an open area away from buildings and trees.
              </li>
              <li>After shaking stops, check for injuries and hazards.</li>
              <li>
                Be prepared for aftershocks and follow official instructions.
              </li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white border-2 border-yellow-200 rounded-2xl shadow-lg p-4 w-full flex flex-col items-center justify-center">
              <img
                src="/fault-line-talipapa.png"
                alt="Fault Line Map of Brgy. Talipapa"
                className="w-full max-w-xl rounded-xl shadow-md mb-2"
              />
              <span className="text-yellow-700 font-bold text-lg mb-1">
                Fault Line Map: Brgy. Talipapa
              </span>
              <span className="text-sm text-gray-500 mb-2">
                Source: PHIVOLCS, OpenStreetMap
              </span>
              <a
                href="https://faultfinder.phivolcs.dost.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 underline font-semibold mb-2"
              >
                View Interactive PHIVOLCS Fault Finder
              </a>
              <span className="text-xs text-gray-500 text-center">
                Click the link above and use the search bar to find your
                barangay and see fault line proximity.
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Tips: Fire */}
        <div className="bg-red-50 border-4 border-red-300 rounded-3xl shadow-2xl p-10 mb-10 w-full max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-extrabold text-red-700 mb-6 flex items-center gap-3">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v12m0 0a4 4 0 01-4-4V7a4 4 0 018 0v4a4 4 0 01-4 4z"
              />
            </svg>
            Fire Emergency Tips
          </h2>
          <ul className="space-y-4 text-lg text-red-900 font-medium">
            <li>Stay low to avoid smoke inhalation when escaping a fire.</li>
            <li>Never use elevators during a fire evacuation.</li>
            <li>Call the fire department immediately (160).</li>
            <li>If clothes catch fire, stop, drop, and roll.</li>
            <li>Have a fire extinguisher accessible and know how to use it.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
