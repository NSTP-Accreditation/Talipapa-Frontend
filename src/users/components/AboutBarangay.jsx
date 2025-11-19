import { Target, Eye, Scroll } from 'lucide-react';
import { useEffect, useState } from 'react';
import usePublicFetch from '@/hooks/usePublicFetch';

export default function AboutBarangay() {
  const [pageContent, setPageContent] = useState();
  const { data, loading, error } = usePublicFetch(
    `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`
  );

  useEffect(() => {
    if (data && !loading && !error) {
      setPageContent(data);
    }
  }, [data, loading, error]);

  // Helper function to convert YouTube URL to embed format
  const convertToEmbedUrl = (url) => {
    if (!url) return '';

    // Already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // Extract video ID from various YouTube URL formats
    let videoId = '';

    // https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch?v=')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    }
    // https://youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    // https://www.youtube.com/v/VIDEO_ID
    else if (url.includes('youtube.com/v/')) {
      videoId = url.split('youtube.com/v/')[1]?.split('?')[0] || '';
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <>
      {/* Video Section */}
      <div className="relative w-full h-[400px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden shadow-2xl">
        <iframe
          src={
            convertToEmbedUrl(pageContent?.youtubeUrl) ||
            'https://www.youtube.com/embed/_A71fgP5Xt8?autoplay=1&mute=1&loop=1&playlist=_A71fgP5Xt8'
          }
          title="Barangay Talipapa Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>

        {/* Gradient Overlay for better text visibility if needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-16 px-4 sm:px-0">
            <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4 sm:mb-6 shadow-lg">
              <span className="text-4xl sm:text-5xl">🏘️</span>
            </div>
            <h1 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-4 sm:mb-6 leading-normal">
              About Barangay Talipapa
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-normal">
              {pageContent?.barangayDescription}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-0">
            <div className="bg-white border-2 border-green-100 rounded-2xl shadow-xl p-6 sm:p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-green-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 leading-normal">
                  Our Mission
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-normal text-justify">
                  {pageContent?.mission}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-green-100 rounded-2xl shadow-xl p-6 sm:p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-green-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 leading-normal">
                  Our Vision
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-normal text-justify">
                  {pageContent?.vision}
                </p>
              </div>
            </div>
          </div>

          {/* Barangay History */}
          <div className="max-w-4xl mx-auto px-4 sm:px-0">
            <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-6 sm:p-10 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
                  <Scroll className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-normal">
                  Barangay History
                </h2>
              </div>
              <p className="text-gray-700 text-base sm:text-lg leading-normal text-justify">
                {pageContent?.barangayHistory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
