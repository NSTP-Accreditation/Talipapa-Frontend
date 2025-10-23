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
        <div className="absolute top-0 left-0 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-3 sm:mb-4">
          {/* About Section - Compact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-base sm:text-lg">🏘️</span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Barangay Talipapa
                </h3>
                <p className="text-green-200 text-xs">Quezon City, PH</p>
              </div>
            </div>

            <p className="text-green-50 text-xs sm:text-sm font-medium italic leading-relaxed mb-3">
              "Sa{' '}
              <span className="font-extrabold text-lime-300">
                #TaliPaPaNATIN
              </span>{' '}
              may
              <span className="font-bold text-lime-200"> TALI</span>ino,
              <span className="font-bold text-yellow-200"> PA</span>kikisama, at
              <span className="font-bold text-rose-200"> PA</span>gmamahal."
            </p>

            {/* Social Links - Compact */}
            <div className="flex gap-1.5">
              <a
                href="https://web.facebook.com/TalipapaPeoplesCivicCenterD6"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 transition-all duration-300 border border-white/20 active:scale-95"
              >
                <Facebook className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </a>

              <a
                href="https://www.youtube.com/@barangaytalipapa758"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-red-600 transition-all duration-300 border border-white/20 active:scale-95"
              >
                <Youtube className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </a>

              <a
                href="https://quezoncity.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official website"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-green-600 transition-all duration-300 border border-white/20 active:scale-95"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-3 sm:h-4 bg-green-400 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  className="text-green-100 hover:text-white transition-colors text-xs flex items-center gap-2 group hover:translate-x-1 transform transition-transform duration-200 active:scale-95"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="text-green-100 hover:text-white transition-colors text-xs flex items-center gap-2 group hover:translate-x-1 transform transition-transform duration-200 active:scale-95"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-green-100 hover:text-white transition-colors text-xs flex items-center gap-2 group hover:translate-x-1 transform transition-transform duration-200 active:scale-95"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></span>
                  Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/trading"
                  className="text-green-100 hover:text-white transition-colors text-xs flex items-center gap-2 group hover:translate-x-1 transform transition-transform duration-200 active:scale-95"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all"></span>
                  Trading
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Compact */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-3 sm:h-4 bg-green-400 rounded-full"></span>
              Contact Us
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-xs">
                  <MapPin className="w-3 h-3 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-green-100 leading-snug">
                    506 Quirino Hwy, Novaliches, QC
                  </span>
                </li>

                <li className="flex items-start gap-2 text-xs">
                  <Phone className="w-3 h-3 text-green-300 flex-shrink-0 mt-0.5" />
                  <div className="text-green-100">
                    <p>0917-5586735</p>
                    <p>8-7110745</p>
                  </div>
                </li>
              </ul>

              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-xs">
                  <Mail className="w-3 h-3 text-green-300 flex-shrink-0 mt-0.5" />
                  <a
                    href="mailto:barangay.talipapa2018@gmail.com"
                    className="text-green-100 hover:text-white transition-colors break-words active:scale-95"
                  >
                    barangay.talipapa2018@gmail.com
                  </a>
                </li>

                <li className="flex items-start gap-2 text-xs">
                  <Clock className="w-3 h-3 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-green-100">Mon-Fri: 8AM - 5PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-3 sm:my-4"></div>

        {/* Bottom Bar - Compact */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-green-200">
            <span>© {currentYear} Barangay Talipapa</span>
            <span className="hidden sm:inline">•</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center gap-1 text-green-300">
            <span>Made with</span>
            <Link
              to="/admin"
              aria-label="Go to admin"
              className="text-red-400 active:scale-95"
            >
              <span>❤️</span>
            </Link>
            <span>for the community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
