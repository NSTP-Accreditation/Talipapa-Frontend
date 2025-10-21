import React from 'react';
import {
  Globe,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About Section - Compact */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-xl">🏘️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Barangay Talipapa
                </h3>
                <p className="text-green-200 text-xs">Quezon City, PH</p>
              </div>
            </div>

            <p className="text-center text-green-50 text-lg sm:text-xl font-medium italic leading-relaxed mb-6 animate-fadeIn">
  “Sa <span className="font-extrabold text-lime-300">#TaliPaPaNATIN</span> may 
  <span className="font-bold text-lime-200"> TALI</span>ino, 
  <span className="font-bold text-yellow-200"> PA</span>kikisama, at 
  <span className="font-bold text-rose-200"> PA</span>gmamahal.”
</p>


            {/* Social Links - Compact */}
            <div className="flex gap-2">
              <a
                href="https://web.facebook.com/TalipapaPeoplesCivicCenterD6"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 transition-all duration-300 border border-white/20"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>

              <a
                href="https://www.youtube.com/@barangaytalipapa758"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-red-600 transition-all duration-300 border border-white/20"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>

              <a
                href="https://quezoncity.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official website"
                className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-green-600 transition-all duration-300 border border-white/20"
              >
                <Globe className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div className="text-center md:flex md:flex-col md:items-center">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-400 rounded-full"></span>
                Quick Links
              </h3>
            <ul className="space-y-2 md:text-center">
              <li>
                <Link
                  to="/"
                  className="text-green-100 hover:text-white transition-colors text-sm flex items-center gap-2 group hover:translate-x-2 transform transition-transform duration-200"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="text-green-100 hover:text-white transition-colors text-sm flex items-center gap-2 group hover:translate-x-2 transform transition-transform duration-200"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-green-100 hover:text-white transition-colors text-sm flex items-center gap-2 group hover:translate-x-2 transform transition-transform duration-200"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></span>
                  Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/trading"
                  className="text-green-100 hover:text-white transition-colors text-sm flex items-center gap-2 group hover:translate-x-2 transform transition-transform duration-200"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></span>
                  Trading
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Compact */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-green-400 rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-green-100 leading-snug">
                  506 Quirino Hwy, Novaliches, QC
                </span>
              </li>

              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                <div className="text-green-100">
                  <p>0917-5586735</p>
                  <p>8-7110745</p>
                </div>
              </li>

              <li className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:barangay.talipapa2018@gmail.com"
                  className="text-green-100 hover:text-white transition-colors break-words"
                >
                  barangay.talipapa2018@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-green-100">Mon-Fri: 8AM - 5PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-6"></div>

        {/* Bottom Bar - Compact */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-green-200">
            <span>© {currentYear} Barangay Talipapa</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">All rights reserved</span>
          </div>

          <div className="flex items-center gap-1 text-green-300">
            <span>Made with</span>
            <Link to="/admin" aria-label="Go to admin" className="text-red-400 ">
              <span>❤️</span>
            </Link>
            <span>for the community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
