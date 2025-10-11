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
    <section className="bg-gray-50 py-20 flex justify-center">
      <div className="max-w-6xl w-full px-6">
        {/* 🏆 Section Header */}
        <header className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800">Achievements</h2>
        </header>

        {/* 🧩 Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl flex flex-col items-center text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-72"
            >
              {/* 🖼 Image Container */}
              <div className="flex items-center justify-center w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || 'Achievement image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No image available</span>
                )}
              </div>

              {/* 🏷 Title */}
              <h3 className="font-semibold text-base text-green-800 mb-1">
                {item.title || 'Achievement'}
              </h3>

              {/* 📝 Description */}
              <p className="text-gray-600 text-sm mb-2">
                {item.description || 'Description'}
              </p>

              {/* 🔗 Link */}
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 text-sm font-medium hover:underline"
                >
                  Learn more
                </a>
              ) : (
                <span className="text-gray-400 text-sm">No link</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

