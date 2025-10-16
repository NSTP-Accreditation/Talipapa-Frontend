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
    if(data && !loading && !error) {
      const guides = Array.isArray(data) ? data.slice(0, 9) : []
      setGuides(guides);
    }
  }, [data, loading, error])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
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
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>How-To Guides</span>
            </div>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-12 px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
            <span className="text-6xl">📚</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
            Talipapa How-To Guides
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Step-by-step instructions for barangay services and requirements
          </p>
        </div>

        {/* Guide Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading && <p>Loading guides...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {guides.map((guide: any) => {
            const IconComponent = getIconForCategory(guide.category);
            return (
              <Link
                key={guide._id}
                to={`/guidelines/${guide._id}`}
                className="group"
              >
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:shadow-2xl hover:border-green-300 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md"
                      style={{ backgroundColor: '#e8f5e9' }}
                    >
                      <IconComponent
                        className="w-10 h-10"
                        style={{ color: '#1b4c2e' }}
                      />
                    </div>
                    <h3 className="text-gray-800 text-lg font-semibold leading-relaxed group-hover:text-green-700 transition-colors">
                      {guide.title}
                    </h3>
                    {guide.description && (
                      <p className="text-sm text-gray-500 mt-2">
                        {guide.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Need More Help?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Explore our complete collection of guides and resources
          </p>
          <Link to="/guidelines/more">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              View All Guides
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
