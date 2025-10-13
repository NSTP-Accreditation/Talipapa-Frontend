import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Recycle, Info, Calendar, Clock } from 'lucide-react';

export default function NavBar() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format date as "Sunday, October 5, 2025"
      const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));

      // Format time as "10:38:45 PM"
      const timeOptions = {
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

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/guidelines', label: 'Guides', icon: BookOpen },
    { path: '/trading', label: 'EcoCycle', icon: Recycle },
    { path: '/aboutus', label: 'About Us', icon: Info },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white w-full transition-all duration-300 ${
        scrolled ? 'shadow-xl' : 'shadow-md'
      }`}
    >
      {/* Top bar with date and time - Enhanced */}
      <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-950 px-4 sm:px-6 py-2 border-b border-green-700/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-green-100">
            <Calendar className="w-4 h-4 text-green-300" />
            <span className="font-medium tracking-wide truncate">{currentDate}</span>
          </div>
          <div className="flex items-center gap-2 text-green-100">
            <Clock className="w-4 h-4 text-green-300" />
            <span className="font-semibold tracking-wider tabular-nums">{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Main navbar - Enhanced */}
      <nav className="px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Side: Logo & Brand (Desktop) / Hamburger (Mobile) */}
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden text-white hover:text-green-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Brand Name (Desktop) */}
            <Link to="/" className="hidden md:block group">
              <div>
                <h1 className="text-lg font-bold text-white leading-tight group-hover:text-green-200 transition-colors">Barangay Talipapa</h1>
                <p className="text-xs text-green-200">Quezon City</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 ml-8">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-white/20 text-white shadow-md'
                      : 'text-green-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: Partner Logos */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="group">
              <div className="relative">
                <img
                  src="/brgy talipapa.png"
                  alt="Barangay Talipapa Logo"
                  className="h-11 w-11 sm:h-12 sm:w-12 object-contain transition-all duration-300 group-hover:scale-110"
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
                  className="h-11 w-11 sm:h-12 sm:w-12 object-contain transition-all duration-300 group-hover:scale-110"
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
                  className="h-11 w-11 sm:h-12 sm:w-12 object-contain transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-colors"></div>
              </div>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Enhanced */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-green-950 to-green-900 border-t border-green-700/30 shadow-2xl animate-slideDown">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all ${
                  isActive(path)
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isActive(path) ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Footer */}
          <div className="px-4 py-4 border-t border-green-700/30 bg-green-950/50">
            <p className="text-xs text-green-300 text-center">
              © 2025 Barangay Talipapa
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
