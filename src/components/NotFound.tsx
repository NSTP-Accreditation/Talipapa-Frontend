import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: '#F6F6F6' }}
    >
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Error Info */}
            <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              {/* Error Icon */}
              <div className="mb-8">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto lg:mx-0 shadow-lg"
                  style={{ backgroundColor: '#F6F6F6' }}
                >
                  <AlertCircle
                    className="w-12 h-12 sm:w-14 sm:h-14"
                    style={{ color: '#1a4d2e' }}
                  />
                </div>
              </div>

              {/* Error Text */}
              <div className="text-center lg:text-left mb-8">
                <h1
                  className="text-7xl sm:text-8xl lg:text-9xl font-black mb-4"
                  style={{ color: '#1a4d2e' }}
                >
                  404
                </h1>
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
                  style={{ color: '#1a4d2e' }}
                >
                  Page Not Found
                </h2>
                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ color: '#838383' }}
                >
                  Oops! The page you're looking for doesn't exist. It might have
                  been moved or deleted.
                </p>
              </div>

              {/* Current Path Info */}
              {location.pathname && (
                <div
                  className="mb-8 p-4 rounded-xl"
                  style={{ backgroundColor: '#F6F6F6' }}
                >
                  <p
                    className="text-xs sm:text-sm font-semibold mb-2"
                    style={{ color: '#838383' }}
                  >
                    You tried to access:
                  </p>
                  <p
                    className="text-sm sm:text-base font-mono break-all"
                    style={{ color: '#1a4d2e' }}
                  >
                    {location.pathname}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGoHome}
                  className="flex items-center justify-center gap-3 px-6 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300"
                  style={{ backgroundColor: '#1a4d2e' }}
                >
                  <Home className="w-5 h-5" />
                  <span>Go Home</span>
                </button>
                <button
                  onClick={handleGoBack}
                  className="flex items-center justify-center gap-3 px-6 py-4 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: '#F6F6F6',
                    color: '#1a4d2e',
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Go Back</span>
                </button>
              </div>
            </div>

            {/* Right Side - Decorative Illustration */}
            <div
              className="hidden lg:flex w-full lg:w-1/2 relative overflow-hidden p-12"
              style={{ backgroundColor: '#1a4d2e' }}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center items-center text-center text-white h-full">
                <Search className="w-32 h-32 mb-8 opacity-80" />
                <h3 className="text-3xl font-black mb-4">Lost?</h3>
                <p className="text-lg font-light opacity-90 leading-relaxed max-w-md">
                  Don't worry! You can navigate back to safety using the buttons
                  on the left, or explore our main pages below.
                </p>

                {/* Quick Links */}
                <div className="mt-12 space-y-3 w-full max-w-xs">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-left font-semibold"
                  >
                    → Home
                  </button>
                  <button
                    onClick={() => navigate('/guidelines')}
                    className="w-full py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-left font-semibold"
                  >
                    → Guidelines
                  </button>
                  <button
                    onClick={() => navigate('/trading')}
                    className="w-full py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-left font-semibold"
                  >
                    → Trading
                  </button>
                  <button
                    onClick={() => navigate('/aboutus')}
                    className="w-full py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-left font-semibold"
                  >
                    → About Us
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Quick Links */}
          <div
            className="lg:hidden px-8 py-8"
            style={{ backgroundColor: '#F6F6F6' }}
          >
            <h3
              className="text-xl font-bold mb-4 text-center"
              style={{ color: '#1a4d2e' }}
            >
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/')}
                className="py-3 px-4 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#1a4d2e' }}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/guidelines')}
                className="py-3 px-4 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#1a4d2e' }}
              >
                Guidelines
              </button>
              <button
                onClick={() => navigate('/trading')}
                className="py-3 px-4 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#1a4d2e' }}
              >
                Trading
              </button>
              <button
                onClick={() => navigate('/aboutus')}
                className="py-3 px-4 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#1a4d2e' }}
              >
                About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
