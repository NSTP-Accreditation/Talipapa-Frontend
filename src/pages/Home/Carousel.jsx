import { useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://placebear.com/800/300',
  },
  {
    image: 'https://placebear.com/801/300',
  },
  {
    image: 'https://placebear.com/802/300',
  },
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
    <div className="w-[1200px] max-w-4xl mx-auto mt-20 mb-20">
      <div className="relative rounded-lg overflow-hidden">
        {/* Image */}<br></br>
        <h1 className="text-[40px] font-bold text-green-800 text-center mb-6">
          Welcome to Barangay Talipapa
        </h1>
        <img
          src={slides[current].image}
          alt="carousel slide"
          className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover block relative z-0"
        />

        {/* Text Overlay */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white p-3 rounded-lg max-w-[200px]">
          <h2 className="text-xl font-semibold">{slides[current].title}</h2>
          <p className="text-sm">{slides[current].description}</p>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="opacity-0 hover:opacity-100 transition-opacity duration-300 absolute left-[10px] top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-70 hover:bg-opacity-100 text-white p-2 rounded-full z-20"
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
        <br></br><br></br><br></br>
        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="opacity-0 hover:opacity-100 transition-opacity duration-300 absolute right-[10px] top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-70 hover:bg-opacity-100 text-white p-2 rounded-full z-20"
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
    </div>
  );
}
