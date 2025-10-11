import React from 'react';
import Carousel from './Carousel';
import MissionVision from './MissionVision';
import Achievements from './Achievement';
import CalendarEvents from './CalendarEvents';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Breadcrumb */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm font-semibold text-green-700">
            <span className="flex items-center gap-2">
              🏠 Home
            </span>
          </nav>
        </div>
      </div>

      <Carousel />
      <MissionVision />
      <CalendarEvents />
      <Achievements />
    </div>
  );
};

export default Home;
