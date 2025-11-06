import AboutBarangay from '../components/AboutBarangay';
import UnifiedBackground from '../components/UnifiedBackground';
import { User, MapPin, ExternalLink, Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoadingState } from '../../hooks/useLoadingState';
import { ResponsiveSkeleton } from '../../components/ResponsiveSkeleton';
import { useEffect, useState } from 'react';
import usePublicFetch from '@/hooks/usePublicFetch';

const AboutUs = () => {
  // Add loading state with 1 second display
  const { isLoading } = useLoadingState(1000);

  // Show loading skeleton while loading
  if (isLoading) {
    return <ResponsiveSkeleton page="aboutus" />;
  }

  return (
    <UnifiedBackground>
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-green-100 hover:text-white transition-colors group"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-green-400" />
            <span className="text-white font-semibold">About Us</span>
          </nav>
        </div>
      </div>

      <AboutBarangay />

      {/* Consistent container for officials and map */}
      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <BarangayOfficials />
          <BarangayMap />
        </div>
      </div>
    </UnifiedBackground>
  );
};

export default AboutUs;

// BARANGAY  OFFICIALS
const BarangayOfficials = () => {
  const [officials, setOfficials] = useState([]);
  const { data, loading, error } = usePublicFetch(`/officials`);
  useEffect(() => {
    if (data && !loading && !error) {
      setOfficials(data);
    }
  }, [data, loading, error]);

  return (
    <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-24">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4 sm:mb-6 shadow-lg">
          <span className="text-3xl sm:text-5xl">👥</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-3 sm:mb-4 leading-normal">
          Barangay Officials
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4 leading-normal">
          Meet the dedicated leaders serving our community with passion and
          integrity
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:gap-10">
        <div className="flex flex-wrap sm:flex-row gap-4 sm:gap-5 items-center justify-center">
          {officials.slice(0, 1).map((official, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 sm:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-gray-100 relative overflow-hidden w-[160px] sm:w-[240px] md:w-[250px] group"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 overflow-hidden">
                  {official.image ? (
                    <img
                      src={
                        typeof official.image === 'string'
                          ? official.image
                          : official.image.url
                      }
                      alt={official.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 sm:w-10 sm:h-10 text-green-700" />
                  )}
                </div>

                {/* Name */}
                <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 leading-normal text-center group-hover:text-green-700 transition-colors">
                  {official.name}
                </h3>

                {/* Position */}
                <p className="text-gray-600 text-xs sm:text-sm leading-tight text-center font-medium mb-2">
                  {official.position}
                </p>

                {/* Biography */}
                {official.biography && official.biography.trim() && (
                  <p className="text-gray-500 text-xs leading-snug text-center line-clamp-3 px-2">
                    {official.biography}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap sm:flex-row gap-4 sm:gap-20 items-center justify-center">
          {officials.slice(1, 3).map((official, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 sm:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-gray-100 relative overflow-hidden w-[160px] sm:w-[240px] md:w-[250px] group"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 overflow-hidden">
                  {official.image ? (
                    <img
                      src={
                        typeof official.image === 'string'
                          ? official.image
                          : official.image.url
                      }
                      alt={official.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 sm:w-10 sm:h-10 text-green-700" />
                  )}
                </div>

                {/* Name */}
                <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 leading-normal text-center group-hover:text-green-700 transition-colors">
                  {official.name}
                </h3>

                {/* Position */}
                <p className="text-gray-600 text-xs sm:text-sm leading-tight text-center font-medium mb-2">
                  {official.position}
                </p>

                {/* Biography */}
                {official.biography && official.biography.trim() && (
                  <p className="text-gray-500 text-xs leading-snug text-center line-clamp-3 px-2">
                    {official.biography}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-10">
          {officials.slice(3).map((official, index) => (
            <div
              key={index + 3}
              className="bg-white rounded-2xl p-5 sm:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-gray-100 relative overflow-hidden group w-[160px] min-h-[180px] sm:w-[240px] sm:min-h-[240px]"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 overflow-hidden">
                  {official.image ? (
                    <img
                      src={
                        typeof official.image === 'string'
                          ? official.image
                          : official.image.url
                      }
                      alt={official.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 sm:w-10 sm:h-10 text-green-700" />
                  )}
                </div>

                {/* Name */}
                <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 leading-normal text-center group-hover:text-green-700 transition-colors">
                  {official.name}
                </h3>

                {/* Position */}
                <p className="text-gray-600 text-xs sm:text-sm leading-tight text-center font-medium mb-2">
                  {official.position}
                </p>

                {/* Biography */}
                {official.biography && official.biography.trim() && (
                  <p className="text-gray-500 text-xs leading-snug text-center line-clamp-3 px-2">
                    {official.biography}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// BARANGAY MAP
const BarangayMap = () => {
  // Barangay Talipapa coordinates - Talipapa Barangay Hall on Quirino Highway
  const barangayCoordinates = {
    lat: 14.6879389,
    lng: 121.0252778,
    name: 'Talipapa Barangay Hall',
    address: '506 Quirino Hwy, Novaliches, Quezon City',
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${barangayCoordinates.lat},${barangayCoordinates.lng}`;

  return (
    <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-24">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4 sm:mb-6 shadow-lg">
          <span className="text-3xl sm:text-5xl">📍</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-3 sm:mb-4 leading-normal">
          Find Our Barangay
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4 leading-normal">
          Visit us at our office or explore our location on the map below
        </p>
      </div>

      {/* Map Container */}
      <div className="max-w-5xl mx-auto bg-white border-2 border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
        {/* Full Width Map */}

        {/* 
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7718.965395150199!2d121.02455024656673!3d14.685273559216638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b12cda88be41%3A0x1d4052dfeeb726ad!2sTalipapa%20Barangay%20Hall!5e0!3m2!1sen!2sph!4v1761063554754!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        */}
        <div className="w-full h-64 sm:h-96 overflow-hidden">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7718.965395150199!2d121.02455024656673!3d14.685273559216638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b12cda88be41%3A0x1d4052dfeeb726ad!2sTalipapa%20Barangay%20Hall!5e0!3m2!1sen!2sph!4v1761063554754!5m2!1sen!2sph`}
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
        <div className="bg-gradient-to-br from-gray-50 to-white p-5 sm:p-8 md:p-10 border-t-2 border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            {/* Location Info */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-green-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1 sm:mb-2">
                  {barangayCoordinates.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 flex items-start gap-2">
                  <span className="flex-shrink-0">📍</span>
                  <span>{barangayCoordinates.address}</span>
                </p>
                <div className="text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <p className="flex items-center gap-2">
                    <span>📞</span>
                    <span className="font-medium">Phone: (63)+917-5586735</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>✉️</span>
                    <span className="font-medium">
                      Email: barangay.talipapa2018@gmail.com
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours and Action */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 w-full lg:w-auto">
                <p className="font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <span>🕒</span>
                  <span>Office Hours:</span>
                </p>
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  Monday - Friday
                </p>
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  8:00 AM - 5:00 PM
                </p>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-3 sm:px-6 sm:py-4 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-full lg:w-auto"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Open in Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
