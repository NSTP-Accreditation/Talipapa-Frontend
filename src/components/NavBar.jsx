import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

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
      {/* Center Barangay Talipapa Logo - Overlapping both bars */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 z-10">
        <Link to="/" className="block">
          <img
            src="/brgy talipapa.png"
            alt="Barangay Talipapa Lungsod Quezon Logo"
            className="h-[70px] w-[70px] sm:h-[80px] sm:w-[80px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
      </div>

      {/* Top bar with date and time */}
      <div
        className="bg-[#0d2617] px-4 sm:px-6 py-1 flex justify-between items-center font-bold relative text-sm"
      >
        <span className="tracking-wide truncate">{currentDate}</span>
        <span className="tracking-wide ml-2">{currentTime}</span>
      </div>

      {/* Main navbar */}
      <nav className="px-4 sm:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
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

        <div className="flex items-center space-x-3 sm:space-x-6">
          <Link
            to="/"
            className="hover:text-gray-200 px-2 sm:px-3 py-1 transition-colors font-semibold text-sm sm:text-base"
          >
            Home
          </Link>
          <Link
            to="/guidelines"
            className="hover:text-gray-200 px-2 sm:px-3 py-1 transition-colors font-semibold text-sm sm:text-base"
          >
            Guides
          </Link>
          <Link
            to="/trading"
            className="hover:text-gray-200 px-2 sm:px-3 py-1 transition-colors font-semibold text-sm sm:text-base"
          >
            EcoCycle
          </Link>
          <Link
            to="/aboutus"
            className="hover:text-gray-200 px-2 sm:px-3 py-1 transition-colors font-semibold text-sm sm:text-base"
          >
            About Us
          </Link>
        </div>
      </nav>
    </header>
  );
}
