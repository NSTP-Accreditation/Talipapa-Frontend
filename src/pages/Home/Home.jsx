import React from 'react';
import Carousel from './Carousel';
import MissionVision from './MissionVision';

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

      {/* Header */}
      <header className="text-center mb-12 pt-8">
        <h1 className="text-3xl font-medium text-primary mb-2">
          Welcome to Talipapa Web
        </h1>
        <p className="text-lg text-muted-foreground">
          Your marketplace solution
        </p>
      </header>

      <Carousel />
      <MissionVision />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4">
        <section className="bg-card p-12 rounded-xl text-center shadow-sm">
          <h2 className="text-2xl font-medium mb-4 text-primary">
            Get Started
          </h2>
          <p className="text-base text-muted-foreground">
            This is your home page. Start building your application here!
          </p>
        </section>
      </main>
    </div>
  );
};

export default Home;
