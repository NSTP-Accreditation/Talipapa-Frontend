import React from 'react';

const achievements = [
  {
    title: 'Barangay Clean-up Drive Award',
    description:
      'Recognized for outstanding environmental efforts in maintaining a clean and green community.',
    link: 'https://example.com/cleanup-award',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500',
  },
  {
    title: 'Health and Wellness Initiative',
    description:
      'Awarded for promoting community health through sustainable wellness programs.',
    link: 'https://example.com/health-initiative',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=500',
  },
  {
    title: 'Community Safety Recognition',
    description:
      'Acknowledged for exemplary disaster preparedness and safety programs.',
    link: 'https://example.com/safety-recognition',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500',
  },
  {
    title: 'Youth Empowerment Project',
    description:
      'Honored for empowering youth leaders to contribute actively to barangay programs.',
    link: 'https://example.com/youth-project',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500',
  },
  {
    title: 'Eco-Friendly Barangay',
    description:
      'Achieved for implementing innovative recycling and environmental conservation measures.',
    link: 'https://example.com/eco-barangay',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500',
  },
  {
    title: 'Best Barangay Documentation',
    description:
      'Awarded for excellence in record keeping, transparency, and governance.',
    link: 'https://example.com/documentation-award',
    image: '',
  },
];

export default function Achievements() {
  return (
    <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-20 flex justify-center">
      <div className="max-w-6xl w-full px-6">
        {/* Section Header */}
        <header className="text-center mb-16">
          <div className="inline-block p-4 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-full mb-6 shadow-lg">
            <span className="text-5xl">🏆</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-700 to-yellow-700 bg-clip-text text-transparent mb-4">
            Achievements
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Celebrating our community's milestones and recognition for
            excellence in service
          </p>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl flex flex-col items-center text-center border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full max-w-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Image Container */}
                <div className="flex items-center justify-center w-full h-52 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || 'Achievement image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-6xl mb-2">🏆</span>
                      <span className="text-gray-400 text-sm font-medium">
                        No image available
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-orange-700 transition-colors">
                  {item.title || 'Achievement'}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                  {item.description || 'Description'}
                </p>

                {/* Link */}
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 text-sm font-bold hover:text-orange-700 hover:underline bg-orange-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    Learn more →
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">
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
