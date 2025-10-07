import './index.css';
import {
  FileText,
  File,
  Building2,
  House,
  TrafficCone,
  ThumbsUp,
  CircleSlash,
  ScrollText,
  IdCard,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

export default function Guidelines() {
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
    { icon: FileText, title: "Barangay Clearance" },
    { icon: File, title: "Certificate of Indigency" },
    { icon: House, title: "Certificate of Residency" },
    { icon: Building2, title: "Business Clearance" },
    { icon: TrafficCone, title: "Traffic Clearance" },
    { icon: ThumbsUp, title: "Good Moral Character" },
    { icon: ScrollText, title: "Barangay Affidavit" },
    { icon: IdCard, title: "Philsys ID" },
    { icon: IdCard, title: "Quezon City ID" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span>How to Guides</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-8 text-gray-800 tracking-wider">
            TALIPAPA HOW TO GUIDES
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide, index) => {
            const IconComponent = guide.icon;
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:opacity-90 transition-opacity" style={{backgroundColor: '#e8f5e9'}}>
                  <IconComponent className="w-8 h-8" style={{color: '#1b4c2e'}} />
                </div>
                <h3 className="text-gray-700 leading-relaxed">{guide.title}</h3>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/guidelines/more">
            <Button className="text-white px-8 py-3 rounded" style={{backgroundColor: '#1b4c2e'}}>More Guides</Button>
          </Link>
        </div>
      </main>

      
    </div>
  );
}
