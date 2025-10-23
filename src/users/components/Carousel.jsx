import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Image */}
      <img
        src={slides[current].image}
        alt={`Slide ${current + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">
          Welcome to Barangay Talipapa!
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center drop-shadow-md">
          Your community, our pride.
        </p>
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-white w-6 sm:w-7 md:w-8 shadow-lg'
                : 'bg-white/50 hover:bg-white/70 w-2 sm:w-2.5 md:w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
