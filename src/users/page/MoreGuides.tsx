import {
  FileText,
  File,
  Building2,
  Stethoscope,
  Waves,
  Mountain,
  House,
  TrafficCone,
  ThumbsUp,
  CircleSlash,
  ScrollText,
  IdCard,
  Home,
  ChevronRight,
  BookOpen,
  Library,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import UnifiedBackground from '../components/UnifiedBackground';
import { ResponsiveSkeleton } from '../../components/ResponsiveSkeleton';
import { useEffect, useState } from 'react';
import usePublicFetch from '@/hooks/usePublicFetch';

export default function MoreGuides() {
  const { data, loading, error } = usePublicFetch('/guidelines');
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    if (data && !loading && !error) {
      const guides = Array.isArray(data) ? data : [];
      setGuides(guides);
    }
  }, [data, loading, error]);

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
    return <ResponsiveSkeleton page="guidelines" />;
  }

  return (
    <UnifiedBackground>
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-1.5 text-green-100 hover:text-white transition-colors group"
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <Link
              to="/guidelines"
              className="flex items-center gap-1 sm:gap-1.5 text-green-100 hover:text-white transition-colors group"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Guides</span>
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <div className="flex items-center gap-1 sm:gap-1.5 text-white font-semibold">
              <Library className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>More Guides</span>
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
            Complete Guide Collection
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Comprehensive resources and step-by-step instructions for all
            barangay services
          </p>
        </div>

        {/* Guides Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {guides.map((guide, index) => {
            const IconComponent = getIconForCategory(guide.category);
            return (
              <div key={guide._id} className="group">
                <div className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-xl sm:hover:shadow-2xl hover:border-green-300 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 h-full flex flex-col relative overflow-hidden active:scale-95">
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-105 sm:group-hover:scale-110 group-hover:rotate-1 sm:group-hover:rotate-3 transition-all duration-300 shadow-md">
                        <IconComponent
                          className="w-6 h-6 sm:w-7 sm:h-7 text-green-700"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-800 text-base sm:text-lg font-bold mb-1 sm:mb-2 group-hover:text-green-700 transition-colors leading-tight">
                          {guide.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed flex-1">
                      Complete step-by-step guide for{' '}
                      {guide.title.toLowerCase()} including requirements,
                      process, and helpful tips.
                    </p>
                    <div className="pt-3 sm:pt-4 border-t border-gray-100">
                      <Link to={`/guidelines/${guide._id}`} className="block">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg py-2 font-semibold transition-all duration-300 group-hover:shadow-lg text-sm sm:text-base active:scale-95">
                          View Guide →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpful Tips Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 lg:mb-12 shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-2xl sm:text-3xl">�</span>
            </div>
            <h3 className="text-gray-900 text-xl sm:text-2xl lg:text-3xl font-bold">
              Helpful Tips for Using These Guides
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-green-200 shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📖</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                  Read Thoroughly
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  Follow each step carefully and prepare all required documents
                  beforehand
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-green-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⏰</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                  Check Office Hours
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  Visit during official hours (Mon-Fri, 8:00 AM - 5:00 PM) to
                  avoid delays
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-green-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                  Contact for Questions
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  Call the Barangay Hall if you need clarification on
                  requirements
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-green-200 shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                  Bring Valid ID
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  Always bring a government-issued ID and photocopies for
                  verification
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base px-4">
            Return to the main guides page or select a specific guide above
          </p>
          <Link to="/guidelines" className="inline-block">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-6 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95">
              ← Back to Guides
            </Button>
          </Link>
        </div>
      </main>
    </UnifiedBackground>
  );
}
