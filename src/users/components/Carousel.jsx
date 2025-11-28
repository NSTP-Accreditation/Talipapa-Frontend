import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBrgyInfo } from '@/contexts/BrgyInfoContext';
import { logger } from '@/utils/logger';

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
  const { pageContent } = useBrgyInfo();

  // Prefer pageContent from context (admin edits update this). If not available, fall back to fetching /carousel
  useEffect(() => {
    if (
      pageContent &&
      Array.isArray(pageContent.carousel) &&
      pageContent.carousel.length > 0
    ) {
      const mapped = pageContent.carousel.map((s) => ({
        image: s.image?.url || s.image || '',
        title: s.title || s.title || '',
        subtitle: s.subtitle || (s.subTitle ?? '') || '',
      }));
      setSlides(mapped);
      return; // don't run the fetch fallback
    }

    // fallback: fetch from public API endpoint
    const base = import.meta.env.VITE_API_URL || '';
    const url = `${base}/carousel`;

    let cancelled = false;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          // 404 is expected if carousel endpoint doesn't exist
          // Just use fallback slides silently
          logger.debug(
            `Carousel endpoint not found (${res.status}), using fallback slides`
          );
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        const items = data?.items || data || [];
        if (Array.isArray(items) && items.length > 0) {
          const mapped = items.map((s) => ({
            image: s.image?.url || s.image || '',
            title: s.title || '',
            subtitle: s.subtitle || '',
          }));
          setSlides(mapped);
          logger.debug('Carousel slides loaded from API');
        }
      })
      .catch((error) => {
        // Network error or parse error - use fallback slides
        logger.debug(
          'Carousel API fetch failed, using fallback slides:',
          error.message
        );
      });

    return () => {
      cancelled = true;
    };
    // depend on pageContent so changes propagate
  }, [pageContent]);

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
      className="relative group w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px] overflow-hidden bg-gray-900"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Blurred background images - smooth crossfade */}
      {slides.map((s, idx) => (
        <img
          key={`bg-${idx}`}
          src={s.image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover blur-3xl scale-110 transition-opacity duration-[2000ms] ease-in-out ${
            idx === current
              ? 'opacity-40 z-0'
              : 'opacity-0 z-0 pointer-events-none'
          }`}
          style={{ willChange: 'opacity' }}
        />
      ))}

      {/* Main images - smooth crossfade with subtle zoom */}
      {slides.map((s, idx) => (
        <img
          key={idx}
          src={s.image}
          alt={s.title || `Slide ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-[1200ms] ease-in-out ${
            idx === current
              ? 'opacity-100 z-10 scale-100'
              : 'opacity-0 z-0 pointer-events-none scale-95'
          }`}
          style={{ willChange: 'opacity, transform' }}
        />
      ))}

      {/* Gradient Overlay (hide on hover/pause). Hidden on mobile to keep images fully visible */}
      <div
        className={`absolute inset-0 hidden md:block bg-gradient-to-b from-black/20 via-black/30 to-black/50 pointer-events-none transition-opacity duration-300 ${
          isPaused ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Full-width gradient overlay at bottom with elegant text */}
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
        {/* Gradient background that fades from bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent h-64 sm:h-72 md:h-86"></div>

        {/* Text content */}
        <div
          key={current}
          className={`relative flex items-end justify-center pb-24 sm:pb-28 md:pb-32 px-6 sm:px-8 md:px-12 transition-all duration-700 ease-out ${
            slides[current] && !isPaused
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="text-white text-center max-w-4xl w-full">
            <h2
              className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 tracking-tight leading-tight transition-all duration-500 ${
                slides[current] && !isPaused ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                textShadow:
                  '0 2px 12px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.5)',
              }}
            >
              {slides[current]?.title}
            </h2>

            <p
              className={`text-lg sm:text-xl md:text-3xl font-light tracking-wide leading-relaxed transition-all duration-500 delay-100 ${
                slides[current] && !isPaused ? 'opacity-90' : 'opacity-0'
              }`}
              style={{
                textShadow:
                  '0 1px 10px rgba(0,0,0,0.6), 0 2px 16px rgba(0,0,0,0.4)',
              }}
            >
              {slides[current]?.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Previous Button - smooth fade and slide */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-full transition-all duration-500 ease-out opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto z-20 hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white transition-transform duration-300" />
      </button>

      {/* Next Button - smooth fade and slide */}
      <button
        onClick={() => nextSlide(true)}
        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-full transition-all duration-500 ease-out opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto z-20 hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white transition-transform duration-300" />
      </button>

      {/* Slide Indicators - smooth width transitions */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-4 sm:h-5 md:h-6 rounded-full transition-all duration-500 ease-in-out ${
              index === current
                ? 'bg-white w-10 sm:w-12 md:w-16 shadow-lg scale-110'
                : 'bg-white/50 hover:bg-white/70 w-4 sm:w-5 md:w-6 hover:scale-105'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
