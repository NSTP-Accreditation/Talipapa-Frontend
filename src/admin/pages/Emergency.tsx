import React from 'react';

export default function Emergency() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4 flex items-center gap-3">
        <span className="inline-block w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3"
            />
          </svg>
        </span>
        Emergency
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        This page provides important emergency contacts and procedures for the
        community.
      </p>
      {/* Add emergency info, contacts, procedures, etc. here */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Emergency Contacts
        </h2>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">
              Barangay Hotline:
            </span>
            <span className="text-red-700">0912-345-6789</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">
              Fire Department:
            </span>
            <span className="text-red-700">160</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">Police:</span>
            <span className="text-red-700">117</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">
              Medical Emergency:
            </span>
            <span className="text-red-700">911</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
