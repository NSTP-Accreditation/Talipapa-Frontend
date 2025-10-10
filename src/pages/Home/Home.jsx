import React from 'react';
import Carousel from './Carousel';
import MissionVision from './MissionVision';
import Achievements from './Achievement';
import CalendarEvents from './CalendarEvents';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <span>Home</span>
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
