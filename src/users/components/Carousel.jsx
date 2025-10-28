import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const fallbackSlides = [
  {
    image: './Carousel10.jpg',
    title: 'Welcome to Barangay Talipapa!',
    subtitle: 'Your community, our pride.',
  },
  { image: './Carousel20.jpg', title: '', subtitle: '' },
  { image: './Carousel11.jpg', title: '', subtitle: '' },
  { image: './Carousel4.jpg', title: '', subtitle: '' },
  { image: './Carousel2.jpg', title: '', subtitle: '' },
];

export default function Carousel() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Fetch slides from API (falls back to bundled slides)
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || '';
    const url = `${base}/carousel`;

    let cancelled = false;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        // backend used in admin returns { items: Slide[] }
        const items = data?.items || data || [];
        if (Array.isArray(items) && items.length > 0) {
          const mapped = items.map((s) => ({
            image: s.image?.url || s.image || '',
            title: s.title || '',
            subtitle: s.subtitle || '',
          }));
          setSlides(mapped);
        }
      })
      .catch(() => {
        // ignore and use fallback
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const nextSlide = (manual = false) => {
    setCurrent((c) => (c + 1) % slides.length);
    if (manual) resetTimer();
  };

  const prevSlide = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3000);
  };

  useEffect(() => {
    // start autoplay
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  // pause on hover
  const onMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const onMouseLeave = () => {
    setIsPaused(false);
    resetTimer();
  };

  return (
    <div
      className="relative group w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Images (stacked) */}
      {slides.map((s, idx) => (
        <img
          key={idx}
          src={s.image}
          alt={s.title || `Slide ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2500 ease-[cubic-bezier(.25,.1,.25,1)] ${
            idx === current
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0 pointer-events-none'
          }`}
          style={{ willChange: 'opacity' }}
        />
      ))}

      {/* Gradient Overlay (hide on hover/pause). Hidden on mobile to keep images fully visible */}
      <div
        className={`absolute inset-0 hidden md:block bg-gradient-to-b from-black/20 via-black/30 to-black/50 pointer-events-none transition-opacity duration-300 ${
          isPaused ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Centered Overlay Text (glass card) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
        <div
          key={current}
          className={`text-white rounded-2xl md:rounded-3xl text-center transition-opacity duration-500 ease-[cubic-bezier(.25,.1,.25,1)] max-w-sm sm:max-w-xl md:max-w-4xl w-full ${
            slides[current] && !isPaused ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        >
          {/* Mobile: no backdrop/blur, smaller padding and text. Desktop (md+): translucent white + blur + larger padding/text */}
          <div className="w-full mx-auto bg-black/10 backdrop-blur-sm md:bg-black/30 md:backdrop-blur-xl border border-transparent md:border-black/30 shadow-2xl px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-8 rounded-2xl md:rounded-3xl pointer-events-none">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 drop-shadow-lg">
              {slides[current]?.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-light drop-shadow-md">
              {slides[current]?.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-full transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Next Button */}
      <button
        onClick={() => nextSlide(true)}
        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-full transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
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
