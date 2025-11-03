import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  BookOpen,
  Recycle,
  Info,
  Calendar,
  Clock,
} from 'lucide-react';
import { useBrgyInfo } from '@/contexts/BrgyInfoContext';

export default function NavBar() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { pageContent, loading, error } = useBrgyInfo();

  const imageMemo = useMemo(() => {
    if (pageContent && !loading && !error) {
      return pageContent?.image?.url;
    }
    return;
  }, [pageContent, loading, error]);

  const barangayName = useMemo(() => {
    if (pageContent && !loading && !error) {
      return pageContent?.barangayName || 'Barangay Talipapa';
    }
    return 'Barangay Talipapa';
  }, [pageContent, loading, error]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format date as "Sunday, October 5, 2025"
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));

      // Format time as "10:38:45 PM"
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // measure header height to insert a spacer when header is fixed
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.clientHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/guidelines', label: 'Guides', icon: BookOpen },
    { path: '/trading', label: 'EcoCycle', icon: Recycle },
    { path: '/aboutus', label: 'About Us', icon: Info },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white w-full transition-all duration-300 ${
          scrolled ? 'shadow-2xl backdrop-blur-sm' : 'shadow-lg'
        }`}
      >
        {/* Top bar with date and time - Enhanced & Responsive */}
        <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-950 px-3 sm:px-4 lg:px-6 py-2 border-b border-green-700/40">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs sm:text-sm gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-green-100 min-w-0 flex-1">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-300 flex-shrink-0" />
              <span className="font-medium tracking-wide truncate">
                {currentDate}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-green-100 flex-shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-300" />
              <span className="font-semibold tracking-wider tabular-nums">
                {currentTime}
              </span>
            </div>
          </div>
        </div>

        {/* Main navbar - Enhanced & Responsive */}
        <nav className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Side: Logo & Brand (Desktop) / Hamburger (Mobile) */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {/* Mobile Hamburger Button */}
              <button
                className="md:hidden text-white hover:text-green-200 transition-all duration-200 p-1.5 sm:p-2 hover:bg-white/10 rounded-lg active:scale-95 flex-shrink-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>

              {/* Brand Name - Responsive */}
              <Link to="/" className="group min-w-0 flex-shrink">
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight group-hover:text-green-200 transition-colors truncate">
                    {barangayName}
                  </h1>
                  <p className="text-[10px] sm:text-xs text-green-200 truncate">
                    Quezon City
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-0.5 lg:gap-1 ml-4 lg:ml-8">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg font-semibold text-xs lg:text-sm transition-all duration-200 whitespace-nowrap ${
                      isActive(path)
                        ? 'bg-white/20 text-white shadow-lg scale-105'
                        : 'text-green-100 hover:bg-white/10 hover:text-white hover:scale-105'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                    <span className="hidden lg:inline">{label}</span>
                    <span className="lg:hidden">{label.split(' ')[0]}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side: Partner Logos - Responsive */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
              <Link to="/" className="group">
                <div className="relative">
                  <img
                    src={imageMemo}
                    alt="Barangay Talipapa Logo"
                    className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-colors"></div>
                </div>
              </Link>
              <a
                href="https://quezoncity.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="relative">
                  <img
                    src="/qc.png"
                    alt="Quezon City Logo"
                    className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-colors"></div>
                </div>
              </a>
              <a
                href="https://qcu.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="relative">
                  <img
                    src="/qcu.png"
                    alt="QCU Logo"
                    className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-colors"></div>
                </div>
              </a>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Enhanced with Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
              style={{ top: headerHeight }}
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu Panel */}
            <div
              className="md:hidden absolute left-0 right-0 bg-gradient-to-b from-green-950 via-green-900 to-green-950 border-t border-green-700/40 shadow-2xl animate-slideDown max-h-[calc(100vh-var(--header-height))] overflow-y-auto"
              style={
                {
                  '--header-height': `${headerHeight}px`,
                } as React.CSSProperties
              }
            >
              <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all active:scale-98 ${
                      isActive(path)
                        ? 'bg-white/20 text-white shadow-lg scale-[1.02]'
                        : 'text-green-100 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all ${
                        isActive(path)
                          ? 'bg-white/20 shadow-inner'
                          : 'bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-green-700/40 bg-green-950/60">
                <p className="text-xs text-green-300 text-center font-medium">
                  © 2025 {barangayName} • Quezon City
                </p>
              </div>
            </div>
          </>
        )}
      </header>

      {/* spacer so page content doesn't jump when header is fixed */}
      <div style={{ height: headerHeight }} aria-hidden="true" />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }

        .active\\:scale-95:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
}
