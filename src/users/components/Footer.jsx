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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8">
          {/* About Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-xl sm:text-2xl">🏘️</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Barangay Talipapa
                </h3>
                <p className="text-green-200 text-xs sm:text-sm">
                  Quezon City, PH
                </p>
              </div>
            </div>

            <p className="text-green-50 text-sm sm:text-base font-medium italic leading-relaxed mb-5">
              "Sa{' '}
              <span className="font-extrabold text-lime-300">
                #TaliPaPaNATIN
              </span>{' '}
              may
              <span className="font-bold text-lime-200"> TALI</span>ino,
              <span className="font-bold text-yellow-200"> PA</span>kikisama, at
              <span className="font-bold text-rose-200"> PA</span>gmamahal."
            </p>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              <a
                href="https://web.facebook.com/TalipapaPeoplesCivicCenterD6"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 border border-white/20 active:scale-95"
              >
                <Facebook className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
              </a>

              <a
                href="https://www.youtube.com/@barangaytalipapa758"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-300 border border-white/20 active:scale-95"
              >
                <Youtube className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
              </a>

              <a
                href="https://quezoncity.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official website"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-300 border border-white/20 active:scale-95"
              >
                <Globe className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 sm:h-6 bg-green-400 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-green-100 hover:text-white transition-colors text-sm sm:text-base flex items-center gap-2.5 group hover:translate-x-1 transform transition-transform duration-200 active:scale-95"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="text-green-100 hover:text-white transition-colors text-sm sm:text-base flex items-center gap-2.5 group hover:translate-x-1 transform transition-transform duration-200 active:scale-95"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-green-100 hover:text-white transition-colors text-sm sm:text-base flex items-center gap-2.5 group hover:translate-x-1 transform transition-transform duration-200 active:scale-95"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/trading"
                  className="text-green-100 hover:text-white transition-colors text-sm sm:text-base flex items-center gap-2.5 group hover:translate-x-1 transform transition-transform duration-200 active:scale-95"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Trading
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-sm sm:text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 sm:h-6 bg-green-400 rounded-full"></span>
              Contact Us
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-green-100 leading-relaxed">
                    506 Quirino Hwy, Novaliches, QC
                  </span>
                </li>

                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0 mt-1" />
                  <div className="text-green-100 space-y-1">
                    <p>0917-5586735</p>
                    <p>8-7110745</p>
                  </div>
                </li>
              </ul>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0 mt-1" />
                  <a
                    href="mailto:barangay.talipapa2018@gmail.com"
                    className="text-green-100 hover:text-white transition-colors break-all active:scale-95 hover:underline"
                  >
                    barangay.talipapa2018@gmail.com
                  </a>
                </li>

                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-green-100">Mon-Fri: 8AM - 5PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-6 sm:my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-green-200 text-center sm:text-left">
            <span>© {currentYear} Barangay Talipapa</span>
            <span className="hidden sm:inline">•</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center gap-1.5 text-green-300">
            <span>Made with</span>
            <Link
              to="/admin"
              aria-label="Go to admin"
              className="text-red-400 hover:scale-125 transition-transform active:scale-95 inline-block"
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
