import useFetchData from '../../admin/hooks/useFetchData';

export default function Achievements() {
  const { data, loading, error } = useFetchData('/achievements');

  const achievements = Array.isArray(data) ? data : [];

  return (
    <section className="bg-gradient-professional gradient-mesh relative py-12 sm:py-16 md:py-20 flex justify-center px-4 sm:px-6">
      <div className="max-w-6xl w-full">
        {/* Section Header */}
        <header className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-full mb-4 sm:mb-6 shadow-lg">
            <span className="text-3xl sm:text-4xl md:text-5xl">🏆</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-700 to-yellow-700 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
            Achievements
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Celebrating our community's milestones and recognition for
            excellence in service
          </p>
        </header>

        {loading && (
          <p className="text-center text-sm sm:text-base">
            Loading achievements...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 text-sm sm:text-base">
            {error}
          </p>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 justify-items-center">
          {achievements.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl flex flex-col items-center text-center border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full max-w-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Image Container */}
                <div className="flex items-center justify-center w-full h-44 sm:h-48 md:h-52 mb-4 sm:mb-5 md:mb-6 overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {item.image && item.image.url ? (
                    <img
                      src={item.image.url}
                      alt={item.title || 'Achievement image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl sm:text-5xl md:text-6xl mb-2">
                        🏆
                      </span>
                      <span className="text-gray-400 text-xs sm:text-sm font-medium">
                        No image available
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3 group-hover:text-orange-700 transition-colors">
                  {item.title || 'Achievement'}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                  {item.description || 'Description'}
                </p>

                {/* Link */}
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 text-xs sm:text-sm font-bold hover:text-orange-700 hover:underline bg-orange-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
                  >
                    Learn more →
                  </a>
                ) : (
                  <span className="text-gray-400 text-xs sm:text-sm">
                    No link available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
