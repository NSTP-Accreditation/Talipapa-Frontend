import { useState, useEffect } from 'react';

const slides = [
  { image: 'https://placebear.com/1600/800' },
  { image: 'https://placebear.com/1601/800' },
  { image: 'https://placebear.com/1602/800' },
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
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Image */}
      <img
        src={slides[current].image}
        alt="carousel slide"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay Text */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-6 py-4 rounded-lg text-center max-w-[90%] mb-[200px]">
        <h2 className="text-[30px] font-bold">Welcome to Barangay Talipapa!</h2>
        <p className="text-[20px]">Your community, our pride.</p>
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full z-20"
        aria-label="Previous"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full z-20 ml-[1375px]"
        aria-label="Next"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
