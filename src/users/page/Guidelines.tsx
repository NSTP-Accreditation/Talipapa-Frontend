import {
  FileText,
  File,
  Building2,
  House,
  TrafficCone,
  ThumbsUp,
  ScrollText,
  IdCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Guidelines() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

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
  ];

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
            <span className="text-green-700 font-semibold">
              📖 How to Guides
            </span>
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
          {guides.map((guide, index) => {
            const IconComponent = guide.icon;
            return (
              <Link key={index} to={guide.path} className="group">
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
