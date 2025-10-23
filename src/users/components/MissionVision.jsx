import { Eye, Target, Leaf, Heart, ShieldCheck } from 'lucide-react';

export default function MissionVision() {
  // Mock data for demo purposes
  const mission =
    'To provide efficient, transparent, and sustainable governance that promotes the welfare of all residents while preserving our environment for future generations.';
  const vision =
    'To be a model eco-friendly barangay that exemplifies sustainable living, where every resident enjoys a high quality of life in harmony with nature.';
  const loading = false;
  const error = null;

  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 flex flex-col items-center">
      {/* Header */}
      <header className="max-w-3xl text-center mb-8 sm:mb-12 md:mb-16">
        <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4 sm:mb-6 shadow-lg">
          <span className="text-3xl sm:text-4xl md:text-5xl">🎯</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
          Our Mission & Vision
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-4">
          Guided by our commitment to sustainable development and community
          welfare, we strive to build a better future for all residents of
          Barangay Talipapa.
        </p>
      </header>

      {/* Mission & Vision Cards */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-5xl w-full mb-12 sm:mb-16 px-4">
        {/* Mission */}
        <div className="bg-white border-2 border-green-100 shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Target className="text-green-700" size={40} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-gray-800">
              Our Mission
            </h3>
            {loading && (
              <p className="text-gray-700 text-sm sm:text-base">
                Loading mission...
              </p>
            )}
            {error && (
              <p className="text-red-500 text-sm sm:text-base">{error}</p>
            )}
            {!loading && !error && (
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center">
                {mission}
              </p>
            )}
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white border-2 border-green-100 shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Eye className="text-green-700" size={40} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-gray-800">
              Our Vision
            </h3>
            {loading && (
              <p className="text-gray-700 text-sm sm:text-base">
                Loading vision...
              </p>
            )}
            {error && (
              <p className="text-red-500 text-sm sm:text-base">{error}</p>
            )}
            {!loading && !error && (
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center">
                {vision}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-2xl sm:rounded-3xl py-10 sm:py-12 md:py-16 px-6 sm:px-8 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Soft floating background effect */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)] pointer-events-none"></div>

          {/* Talino */}
          <div className="relative flex flex-col items-center text-center group hover:-translate-y-3 transition-all duration-500">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/30">
              <Leaf
                size={36}
                className="text-lime-300 group-hover:text-white transition-colors duration-300 sm:w-9 sm:h-9 md:w-10 md:h-10"
              />
            </div>
            <h4 className="font-extrabold text-xl sm:text-2xl mb-2 tracking-wide bg-gradient-to-r from-lime-200 to-white bg-clip-text text-transparent drop-shadow-md">
              Talino
            </h4>
            <p className="text-xs sm:text-sm text-lime-100 max-w-xs px-2">
              Protecting our environment and promoting sustainability.
            </p>
          </div>

          {/* Pakikisama */}
          <div className="relative flex flex-col items-center text-center group hover:-translate-y-3 transition-all duration-500">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/30">
              <ShieldCheck
                size={36}
                className="text-sky-300 group-hover:text-white transition-colors duration-300 sm:w-9 sm:h-9 md:w-10 md:h-10"
              />
            </div>
            <h4 className="font-extrabold text-xl sm:text-2xl mb-2 tracking-wide bg-gradient-to-r from-sky-200 to-white bg-clip-text text-transparent drop-shadow-md">
              Pakikisama
            </h4>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xs px-2">
              Caring for our community through empathy and collaboration.
            </p>
          </div>

          {/* Pagmamahal */}
          <div className="relative flex flex-col items-center text-center group hover:-translate-y-3 transition-all duration-500 sm:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/30">
              <Heart
                size={36}
                className="text-rose-300 group-hover:text-white transition-colors duration-300 sm:w-9 sm:h-9 md:w-10 md:h-10"
              />
            </div>
            <h4 className="font-extrabold text-xl sm:text-2xl mb-2 tracking-wide bg-gradient-to-r from-rose-200 to-white bg-clip-text text-transparent drop-shadow-md">
              Pagmamahal
            </h4>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xs px-2">
              Open, accountable, and guided by love for our people.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
