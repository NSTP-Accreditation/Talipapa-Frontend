import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <header className="bg-[#1b4c2e] text-white w-full relative pt-10">
      {/* Top bar with date and time */}
      <div
        className="bg-[#0d2617] px-4 sm:px-6 py-1 flex justify-between items-center font-bold relative text-base md:text-lg"
      >
        <span className="tracking-wide truncate">{currentDate}</span>
        <span className="tracking-wide ml-2">{currentTime}</span>
      </div>

      {/* Main navbar */}
      <nav className="px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Left Side: Hamburger (mobile) or Navigation Links (desktop) */}
        <div className="flex items-center">
          {/* Mobile Hamburger Button */}
          <button
            className="text-white hover:text-gray-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            style={{ display: window.innerWidth >= 768 ? 'none' : 'block' }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation Links */}
          <div 
            className="items-center space-x-3 sm:space-x-6"
            style={{ display: window.innerWidth >= 768 ? 'flex' : 'none' }}
          >
            <Link
              to="/"
              className="hover:text-gray-200 px-2 sm:px-3 py-1 transition-colors font-semibold text-base md:text-lg"
            >
              Home
            </Link>
            <Link
              to="/guidelines"
              className="hover:text-gray-200 px-2 sm:px-3 py-1 transition-colors font-semibold text-base md:text-lg"
            >
              Guides
            </Link>
            <Link
              to="/trading"
              className="hover:text-gray-200 px-2 sm:px-3 py-1 transition-colors font-semibold text-base md:text-lg"
            >
              EcoCycle
            </Link>
            <Link
              to="/aboutus"
              className="hover:text-gray-200 px-2 sm:px-3 py-1 transition-colors font-semibold text-base md:text-lg"
            >
              About Us
            </Link>
          </div>
        </div>

        {/* All Icons on the Right Side */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="block">
            <img
              src="/brgy talipapa.png"
              alt="Barangay Talipapa Lungsod Quezon Logo"
              className="h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
            />
          </Link>
          <a
            href="https://quezoncity.gov.ph/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src="/qc.png"
              alt="Lungsod Quezon Pilipinas Logo"
              className="h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
            />
          </a>
          <a
            href="https://qcu.edu.ph/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src="/qcu.png"
              alt="QCU Logo"
              className="h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
            />
          </a>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="bg-[#0d2617] px-4 py-3 space-y-2"
          style={{ display: window.innerWidth >= 768 ? 'none' : 'block' }}
        >
          <Link
            to="/"
            className="block hover:text-gray-200 px-3 py-2 transition-colors font-semibold text-base rounded hover:bg-[#1b4c2e]"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/guidelines"
            className="block hover:text-gray-200 px-3 py-2 transition-colors font-semibold text-base rounded hover:bg-[#1b4c2e]"
            onClick={() => setIsMenuOpen(false)}
          >
            Guides
          </Link>
          <Link
            to="/trading"
            className="block hover:text-gray-200 px-3 py-2 transition-colors font-semibold text-base rounded hover:bg-[#1b4c2e]"
            onClick={() => setIsMenuOpen(false)}
          >
            EcoCycle
          </Link>
          <Link
            to="/aboutus"
            className="block hover:text-gray-200 px-3 py-2 transition-colors font-semibold text-base rounded hover:bg-[#1b4c2e]"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
        </div>
      )}
    </header>
  );
}
