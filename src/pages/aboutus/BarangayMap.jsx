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
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
          <span className="text-5xl">📍</span>
        </div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-4">
          Find Our Barangay
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Visit us at our office or explore our location on the map below
        </p>
      </div>

      {/* Map Container */}
      <div className="max-w-5xl mx-auto bg-white border-2 border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
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
        <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-10 border-t-2 border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Location Info */}
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <MapPin className="w-7 h-7 text-green-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {barangayCoordinates.name}
                </h3>
                <p className="text-base text-gray-700 mb-4 flex items-start gap-2">
                  <span className="flex-shrink-0">📍</span>
                  <span>{barangayCoordinates.address}</span>
                </p>
                <div className="text-base text-gray-700 space-y-2">
                  <p className="flex items-center gap-2">
                    <span>📞</span>
                    <span className="font-medium">Phone: (63)+917-5586735</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>✉️</span>
                    <span className="font-medium">Email: barangay.talipapa2018@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours and Action */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🕒</span>
                  <span>Office Hours:</span>
                </p>
                <p className="text-gray-700 font-medium">Monday - Friday</p>
                <p className="text-gray-700 font-medium">8:00 AM - 5:00 PM</p>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
              >
                <ExternalLink className="w-5 h-5" />
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