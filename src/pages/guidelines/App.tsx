import './index.css';
import {
  Heart,
  Zap,
  Shield,
  Briefcase,
  Home,
  Stethoscope,
  Droplets,
  Waves,
  Mountain,
  User,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { useState, useEffect } from "react";

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const guides = [
    {
      icon: Heart,
      title: "Quezon City Health Centers",
    },
    {
      icon: Zap,
      title: "What to Do In Case of Tropical Cyclone",
    },
    {
      icon: Shield,
      title: "How to Avail of the Emergency Disaster Relief",
    },
    {
      icon: Briefcase,
      title: "Preparing an Emergency Go Bag",
    },
    {
      icon: Home,
      title: "Quezon City Evacuation Centers",
    },
    {
      icon: Stethoscope,
      title: "How to Request for Medical Assistance",
    },
    {
      icon: Heart,
      title: "Tips to Avoid Leptospirosis",
    },
    {
      icon: Waves,
      title: "What to Do In Case of Flood",
    },
    {
      icon: Mountain,
      title: "What to Do In Case of Landslide",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>How to Guides</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-8 text-gray-800 tracking-wider">
            QCITIZEN GUIDES
          </h1>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide, index) => {
            const IconComponent = guide.icon;
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <IconComponent className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-gray-700 leading-relaxed">
                  {guide.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* More Guides Button */}
        <div className="text-center">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded">
            More Guides
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="mb-4">Palengke Talipapa</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A green and sustainable community where nature and
              people thrive together.
            </p>
            <div className="flex space-x-4 mt-4">
              <div className="w-6 h-6 bg-gray-700 rounded"></div>
              <div className="w-6 h-6 bg-gray-700 rounded"></div>
              <div className="w-6 h-6 bg-gray-700 rounded"></div>
            </div>
          </div>

          <div>
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  News & Updates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Contact Information</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Palengke Rd., Talipapa, Quezon City</li>
              <li>(02) 123-4567</li>
              <li>info@palengketalipapa.gov.ph</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}