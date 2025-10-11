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

export default function MoreGuides() {
  const guides = [
    { icon: FileText, title: 'Barangay Clearance', path: '/guidelines/barangay-clearance' },
    { icon: File, title: 'Certificate of Indigency', path: '/guidelines/certificate-of-indigency' },
    { icon: House, title: 'Certificate of Residency', path: '/guidelines/certificate-of-residency' },
    { icon: Building2, title: 'Business Clearance', path: '/guidelines/business-clearance' },
    { icon: TrafficCone, title: 'Traffic Clearance', path: '/guidelines/traffic-clearance' },
    { icon: ThumbsUp, title: 'Good Moral Character', path: '/guidelines/good-moral-character' },
    { icon: ScrollText, title: 'Barangay Affidavit', path: '/guidelines/barangay-affidavit' },
    { icon: IdCard, title: 'Philsys ID', path: '/guidelines/philsys-id' },
    { icon: IdCard, title: 'Quezon City ID', path: '/guidelines/quezon-city-id' },
    { icon: Stethoscope, title: 'Health Certificate', path: '/guidelines/health-certificate' },
    { icon: Waves, title: 'Flood Assistance', path: '/guidelines/flood-assistance' },
    { icon: Mountain, title: 'Land Use Permit', path: '/guidelines/land-use-permit' },
    { icon: CircleSlash, title: 'Restricted Area Pass', path: '/guidelines/restricted-area-pass' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/guidelines" className="hover:underline">
              How to Guides
            </Link>
            <span className="mx-2">/</span>
            <span>More Guides</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-8 text-gray-800 tracking-wider">
            TALIPAPA - MORE GUIDES
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A larger collection of how-to guides and resources. Use the cards
            below to explore detailed steps and requirements.
          </p>
        </div>

        {/* Larger Guides Grid with more containers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide, index) => {
            const IconComponent = guide.icon;
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mt-1 group-hover:bg-green-200 transition-colors">
                    <IconComponent className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 text-lg font-medium">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      A short description of {guide.title} that helps the user
                      understand what this guide is for and what documents are
                      needed.
                    </p>
                    <div className="mt-4">
                      <Link to={guide.path}>
                        <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional section with grouped containers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-gray-800 text-xl mb-4">Forms & Templates</h3>
            <p className="text-gray-600 mb-6">
              Download commonly used forms, templates, and printable checklists
              to speed up your application.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>- Application Form (PDF)</li>
              <li>- Affidavit Template (DOCX)</li>
              <li>- Checklist for Residency (PDF)</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-gray-800 text-xl mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-600 mb-6">
              Answers to common questions about requirements, fees, and
              processing times.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>How long does processing take?</li>
              <li>What documents are required?</li>
              <li>Where to submit the application?</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link to="/guidelines" className="inline-block">
            <Button
              className="text-white px-8 py-3 rounded"
              style={{ backgroundColor: '#1b4c2e' }}
            >
              Back to Guides
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
