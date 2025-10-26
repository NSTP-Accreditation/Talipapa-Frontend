import {
  FileText,
  File,
  Building2,
  TrafficCone,
  ScrollText,
  IdCard,
  Home,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GuidelinesPageSkeleton } from '@/components/LoadingSkeletons';
import useFetchData from '../../admin/hooks/useFetchData';
import { useEffect, useState } from 'react';

export default function Guidelines() {
  // fetch guides from server
  const { data, loading, error } = useFetchData('/guidelines');
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    if (data && !loading && !error) {
      const guides = Array.isArray(data) ? data.slice(0, 9) : [];
      setGuides(guides);
    }
  }, [data, loading, error]);

  // normalize category and return appropriate lucide icon component
  const getIconForCategory = (category: string | undefined) => {
    const c = (category || '').toLowerCase().replace(/[^a-z]/g, '');
    if (!c) return BookOpen;
    if (c.includes('clear')) return FileText; // Clearances
    if (c.includes('permit')) return TrafficCone; // Permits
    if (c.includes('cert') || c.includes('certificate')) return ScrollText; // Certificates
    if (c.includes('appl') || c.includes('application')) return File; // Applications
    if (c.includes('service')) return Building2; // Services
    if (c === 'id' || c.includes('idcard') || c.includes('philsys'))
      return IdCard; // ID
    return BookOpen; // default
  };

  // Show loading skeleton while loading
  if (loading) {
    return <GuidelinesPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-professional gradient-mesh relative">
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-1.5 text-green-100 hover:text-white transition-colors group"
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <div className="flex items-center gap-1 sm:gap-1.5 text-white font-semibold">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>How-To Guides</span>
            </div>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4 sm:mb-6 shadow-lg">
            <span className="text-4xl sm:text-5xl lg:text-6xl">📚</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent px-4">
            Talipapa How-To Guides
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Step-by-step instructions for barangay services and requirements
          </p>
        </div>

        {/* Guide Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {loading && <p className="text-sm sm:text-base">Loading guides...</p>}
          {error && (
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          )}
          {guides.map((guide: any) => {
            const IconComponent = getIconForCategory(guide.category);
            return (
              <div key={guide._id} className="group">
                <div className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 transform-gpu hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-xl sm:hover:shadow-2xl hover:border-green-300 group h-full flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] relative overflow-hidden active:scale-95">
                  {/* Decorative floating gradient blob */}
                  <div className="absolute -right-8 -top-8 sm:-right-10 sm:-top-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-green-100 to-transparent opacity-20 group-hover:opacity-60 transform rotate-45 transition-all duration-500 pointer-events-none"></div>
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6 group-hover:scale-110 sm:group-hover:scale-125 group-hover:-rotate-3 sm:group-hover:-rotate-6 group-hover:translate-y-[-2px] sm:group-hover:translate-y-[-4px] transition-transform duration-500 shadow-md"
                      style={{ backgroundColor: '#e8f5e9' }}
                    >
                      <IconComponent
                        className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                        style={{ color: '#1b4c2e' }}
                      />
                    </div>
                    <h3 className="text-gray-800 text-base sm:text-lg font-semibold leading-relaxed group-hover:text-green-700 transition-colors px-2">
                      {guide.title}
                    </h3>
                    {guide.description && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 px-2 line-clamp-2">
                        {guide.description}
                      </p>
                    )}

                    {/* View Details CTA */}
                    <div className="mt-4 sm:mt-5 lg:mt-6">
                      <Link
                        to={`/guidelines/${guide._id}`}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-xs sm:text-sm active:scale-95"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 sm:group-hover:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Need More Help?
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base px-4">
            Explore our complete collection of guides and resources
          </p>
          <Link to="/guidelines/more">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-6 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95">
              View All Guides
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
