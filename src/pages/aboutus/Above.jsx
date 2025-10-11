import { Link } from 'react-router-dom';
import { Target, Eye } from 'lucide-react';

export default function AboutBarangay() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white py-3 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-700">
            <Link to="/" className="hover:underline hover:text-[#0c2716]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#0c2716] font-medium">About Us</span>
          </nav>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/_A71fgP5Xt8?autoplay=1&mute=1&loop=1&playlist=_A71fgP5Xt8"
          title="Barangay Talipapa Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-green-700 mb-4">
              About Us - Our Barangay
            </h1>
            <p className="text-base text-green-600">
              Manage barangay information and officials
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <div className="flex justify-center mb-4">
                <Target className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-700 text-justify">
                To provide efficient, transparent, and sustainable governance
                that promotes the welfare of all residents while preserving
                our environment for future generations.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <div className="flex justify-center mb-4">
                <Eye className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-700 text-justify">
                To be a model eco-friendly barangay that exemplifies sustainable
                living, where every resident enjoys a high quality of life in
                harmony with nature.
              </p>
            </div>
          </div>
          
          {/* Barangay History */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Barangay History
              </h2>
              <p className="text-gray-800 text-base leading-relaxed text-justify">
                Barangay Talipapa is a vibrant community dedicated to
                serving its residents with excellence. Established in 1950,
                we have grown into a progressive barangay that values unity,
                development, and sustainable growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
