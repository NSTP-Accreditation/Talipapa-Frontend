import { useState, useEffect } from 'react';

const slides = [
  { image: './Carousel10.jpg' },
  { image: './Carousel20.jpg' },
  { image: './Carousel11.jpg' },
  { image: './Carousel4.jpg' },
  { image: './Carousel2.jpg' },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full h-[800px] overflow-hidden shadow-2xl">
      {/* Image */}
      <img
        src={slides[current].image}
        alt="carousel slide"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>

      {/* Overlay Text */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white px-12 py-8 rounded-2xl text-center max-w-[90%] ">
        <h2 className="text-3xl font-bold mb-1 drop-shadow-lg">
          Welcome to Barangay Talipapa!
        </h2>
        <p className="text-2xl fosnt-light drop-shadow-md">
          Your community, our pride.
        </p>
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full z-20 transition-all duration-300 hover:scale-110 border border-white/30 shadow-xl"
        aria-label="Previous"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full z-20 transition-all duration-300 hover:scale-110 border border-white/30 shadow-xl"
        aria-label="Next"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-white w-8 shadow-lg'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
