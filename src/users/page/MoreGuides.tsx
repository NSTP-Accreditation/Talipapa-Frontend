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
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { useLoadingState } from '../../hooks/useLoadingState';
import { PageLoadingSkeleton } from '../../components/LoadingSkeletons';

export default function MoreGuides() {
  // Add loading state with minimum 2 second display
  const { isLoading } = useLoadingState(2000);

  const guides = [
    {
      icon: FileText,
      title: 'Barangay Clearance',
      path: '/guidelines/barangay-clearance',
    },
    {
      icon: File,
      title: 'Certificate of Indigency',
      path: '/guidelines/certificate-of-indigency',
    },
    {
      icon: House,
      title: 'Certificate of Residency',
      path: '/guidelines/certificate-of-residency',
    },
    {
      icon: Building2,
      title: 'Business Clearance',
      path: '/guidelines/business-clearance',
    },
    {
      icon: TrafficCone,
      title: 'Traffic Clearance',
      path: '/guidelines/traffic-clearance',
    },
    {
      icon: ThumbsUp,
      title: 'Good Moral Character',
      path: '/guidelines/good-moral-character',
    },
    {
      icon: ScrollText,
      title: 'Barangay Affidavit',
      path: '/guidelines/barangay-affidavit',
    },
    { icon: IdCard, title: 'Philsys ID', path: '/guidelines/philsys-id' },
    {
      icon: IdCard,
      title: 'Quezon City ID',
      path: '/guidelines/quezon-city-id',
    },
    {
      icon: Stethoscope,
      title: 'Health Certificate',
      path: '/guidelines/health-certificate',
    },
    {
      icon: Waves,
      title: 'Flood Assistance',
      path: '/guidelines/flood-assistance',
    },
    {
      icon: Mountain,
      title: 'Land Use Permit',
      path: '/guidelines/land-use-permit',
    },
    {
      icon: CircleSlash,
      title: 'Restricted Area Pass',
      path: '/guidelines/restricted-area-pass',
    },
  ];

  // Show loading skeleton while loading
  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 px-6 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 transition-colors">
              🏠 Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link
              to="/guidelines"
              className="hover:text-green-600 transition-colors"
            >
              📖 How to Guides
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-green-700 font-semibold">📚 More Guides</span>
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
            Complete Guide Collection
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive resources and step-by-step instructions for all
            barangay services
          </p>
        </div>

        {/* Guides Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {guides.map((guide, index) => {
            const IconComponent = guide.icon;
            return (
              <Link key={index} to={guide.path} className="group">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-2xl hover:border-green-300 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                        <IconComponent
                          className="w-7 h-7 text-green-700"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 text-lg font-bold mb-2 group-hover:text-green-700 transition-colors">
                          {guide.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">
                      Complete step-by-step guide for{' '}
                      {guide.title.toLowerCase()} including requirements,
                      process, and helpful tips.
                    </p>
                    <div className="pt-4 border-t border-gray-100">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg py-2 font-semibold transition-all duration-300 group-hover:shadow-lg">
                        View Guide →
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional Resources Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-gray-800 text-2xl font-bold">
                Forms & Templates
              </h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Download commonly used forms, templates, and printable checklists
              to speed up your application process.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                <span className="text-blue-600">📋</span>
                <span>Application Form (PDF)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                <span className="text-blue-600">📝</span>
                <span>Affidavit Template (DOCX)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                <span className="text-blue-600">✅</span>
                <span>Checklist for Residency (PDF)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <span className="text-2xl">❓</span>
              </div>
              <h3 className="text-gray-800 text-2xl font-bold">FAQ</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Answers to common questions about requirements, fees, and
              processing times.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                <span className="text-purple-600 flex-shrink-0">💬</span>
                <span>How long does processing take?</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                <span className="text-purple-600 flex-shrink-0">📂</span>
                <span>What documents are required?</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                <span className="text-purple-600 flex-shrink-0">📍</span>
                <span>Where to submit the application?</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Return to the main guides page or select a specific guide above
          </p>
          <Link to="/guidelines" className="inline-block">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              ← Back to Guides
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
