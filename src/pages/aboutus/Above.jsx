import { Link } from 'react-router-dom';
import { Target, Eye } from 'lucide-react';

export default function AboutBarangay() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>About Us</span>
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
      <div className="min-h-screen bg-white-50 flex justify-center p-6">
        <div className="w-[1024px] flex-none">
          <div className="flex items-start justify-between mb-6">
            <div className="mt-[50px] mr-0 mb-[70px] ml-[20px]">
              <h1 className="text-4xl font-extrabold text-green-700 mb-4">
                About Us - Our Barangay
              </h1>
              <p className="text-base text-green-600">
                Manage barangay information and officials
              </p>
            </div>
          </div>

          {/* Barangay Info Card */}
          <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-none my-6">
            <div className="p-6 md:p-8">
              <h2 className="text-[30px] font-bold text-green-600 mb-6">
                Barangay Information
              </h2>

            </div>
          </div>

          {/* Mission & Vision */}
          <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[100px] max-w-[1000px] mx-auto items-start">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-[30px] text-center self-start">
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

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 text-center self-start">
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
            <br></br><br></br>
            {/* Barangay History */}
            <div className=" w-[2000px] mt-16">
              <div className="w-[1000px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col items-left">
                  <div className="w-full max-w-[820px]">
                    <h2 className="text-[30px] font-bold text-green-600 mb-6">
                      Barangay History
                    </h2>
                    <p className="text-gray-800 text-base leading-relaxed text-justify">
                      Barangay San Isidro is a vibrant community dedicated to
                      serving its residents with excellence. Established in 1950,
                      we have grown into a progressive barangay that values unity,
                      development, and sustainable growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
