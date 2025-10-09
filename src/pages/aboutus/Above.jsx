import { Link } from 'react-router-dom';
import { Pencil, Target, Eye } from 'lucide-react';

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

      {/* Main content with fixed width and centered layout */}
      <div className="min-h-screen bg-white-50 flex justify-center p-6">
        <div className="w-[1024px] flex-none">
          {/* Header with Edit button */}
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
          <br></br>
          {/* Barangay Info Card 1 */}
          <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-none my-6">
            <div className="p-6 md:p-8">
              <h2 className="text-[30px] font-bold text-green-600 mb-6">
                Barangay Information
              </h2>

              <div>
                <p className="text-gray-800 text-base leading-relaxed text-justify">
                  Barangay Talipapa was founded in 1854 by Lieutenant General Manuel Pavia y Marquez de Novaliches. He named the area after seeing a store called “Talipapa.” Sitios under this barrio are San Agustin, Sangandaan, Sauyo, Libis, and Kabaruhan. It is the birthplace of Melchora Aquino (Tandang Sora).
                </p>
              </div>
            </div>
          </div>
          <br></br>
          <br></br>

          {/* Mission & Vision Section */}
          <section className="py-12">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[100px] max-w-[1000px] mx-auto items-start">
              {/* Mission */}
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

              {/* Vision */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 text-center self-start">
                <div className="flex justify-center mb-4">
                  <Eye className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-700 mb-3">
                  Our Vision
                </h3>
                <p className="text-gray-700 text-justify">
                  To be a model eco-friendly barangay that exemplifies
                  sustainable living, where every resident enjoys a high quality
                  of life in harmony with nature.
                </p>
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            {/* Barangay History Card */}
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-none my-6">
              <div className="p-6 md:p-8">
                <h2 className="text-[30px] font-bold text-green-600 mb-6">
                  Barangay History
                </h2>
                <div>
                  <p className="text-gray-800 text-base leading-relaxed text-justify">
                    Barangay San Isidro is a vibrant community dedicated to
                    serving its residents with excellence. Established in 1950, we
                    have grown into a progressive barangay that values unity,
                    development, and sustainable growth.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
