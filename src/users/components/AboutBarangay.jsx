import { Target, Eye, Scroll } from 'lucide-react';
import { useEffect, useState } from 'react';
import useFetchData from '@/admin/hooks/useFetchData';

export default function AboutBarangay() {
  const [pageContent, setPageContent] = useState();
  const { data, loading, error } = useFetchData(
    `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`
  );

  useEffect(() => {
    if (data && !loading && !error) {
      setPageContent(data);
    }
  }, [data, loading, error]);

  return (
    <>
      {/* Video Section */}
      <div className="relative w-full h-[500px] overflow-hidden shadow-2xl">
        <iframe
          src="https://www.youtube.com/embed/_A71fgP5Xt8?autoplay=1&mute=1&loop=1&playlist=_A71fgP5Xt8"
          title="Barangay Talipapa Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>

        {/* Gradient Overlay for better text visibility if needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
              <span className="text-5xl">🏘️</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-6">
              About Barangay Talipapa
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {pageContent?.barangayDescription}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-16">
            <div className="bg-white border-2 border-green-100 rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Target className="w-10 h-10 text-green-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Our Mission
                </h3>
                <p className="text-gray-700 text-base leading-relaxed text-justify">
                  {pageContent?.mission}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-green-100 rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Eye className="w-10 h-10 text-green-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Our Vision
                </h3>
                <p className="text-gray-700 text-base leading-relaxed text-justify">
                  {pageContent?.vision}
                </p>
              </div>
            </div>
          </div>

          {/* Barangay History */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
                  <Scroll className="w-8 h-8 text-green-700" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Barangay History
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed text-justify">
                {pageContent?.barangayHistory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
