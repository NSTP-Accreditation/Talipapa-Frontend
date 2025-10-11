import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const BarangayMap = () => {
  // Barangay Talipapa coordinates - Talipapa Barangay Hall on Quirino Highway
  const barangayCoordinates = {
    lat: 14.6879389,
    lng: 121.0252778,
    name: 'Talipapa Barangay Hall',
    address: '506 Quirino Hwy, Novaliches, Quezon City'
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${barangayCoordinates.lat},${barangayCoordinates.lng}`;

  return (
    <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Find Our Barangay
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visit us at our office or explore our location on the map below
        </p>
      </div>

      {/* Map Container */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Full Width Map */}
        <div className="w-full h-96 overflow-hidden">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.2284682435453!2d121.02444617082957!3d14.687906698469316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ba0142bacae1%3A0x1d4df110b3ed21dd!2sTalipapa%20Barangay%20Hall!5e0!3m2!1sen!2sph!4v1697000000000!5m2!1sen!2sph`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Talipapa Barangay Hall"
          ></iframe>
        </div>

        {/* Bottom Info Bar */}
        <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Location Info */}
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 text-base mb-2">
                  {barangayCoordinates.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  📍 {barangayCoordinates.address}
                </p>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>📞 Phone: (63)+917-5586735</p>
                  <p>✉️ Email: barangay.talipapa2018@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Office Hours and Action */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Office Hours:</p>
                <p>🕒 8:00 AM - 5:00 PM (Monday - Friday)</p>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangayMap;