import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format date as "Sunday, October 5, 2025"
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
      
      // Format time as "10:38:45 PM"
      const timeOptions = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
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
            className="h-[80px] w-[80px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
      </div>

      {/* Top bar with date and time */}
      <div className="bg-[#0d2617] px-6 py-1 flex justify-between items-center font-bold relative" style={{ fontSize: '14px' }}>
        <span className="tracking-wide">{currentDate}</span>
        <span className="tracking-wide">{currentTime}</span>
      </div>
      
      {/* Main navbar */}
      <nav className="px-6 py-2 flex items-center justify-between" style={{ fontSize: '16px' }}>
        <div className="flex items-center space-x-3">
          <a href="https://quezoncity.gov.ph/" target="_blank" rel="noopener noreferrer" className="block">
            <img 
              src="/qc.png" 
              alt="Lungsod Quezon Pilipinas Logo" 
              className="h-[45px] w-[45px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
            />
          </a>
          <a href="https://qcu.edu.ph/" target="_blank" rel="noopener noreferrer" className="block">
            <img 
              src="/qcu.png" 
              alt="QCU Logo" 
              className="h-[45px] w-[45px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
            />
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-200 px-3 py-1 transition-colors font-semibold" style={{ fontSize: '16px' }}>Home</Link>
          <Link to="/guidelines" className="hover:text-gray-200 px-3 py-1 transition-colors font-semibold" style={{ fontSize: '16px' }}>Guides</Link>
          <Link to="/trading" className="hover:text-gray-200 px-3 py-1 transition-colors font-semibold" style={{ fontSize: '16px' }}>EcoCycle</Link>
          <a href="" className="hover:text-gray-200 px-3 py-1 transition-colors font-semibold" style={{ fontSize: '16px' }}>Services</a>
          <Link to="/aboutus" className="hover:text-gray-200 px-3 py-1 transition-colors font-semibold" style={{ fontSize: '16px' }}>About Us</Link>
        </div>
      </nav>
    </header>
  );
}
