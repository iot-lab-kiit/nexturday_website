"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface SlideData {
  title: string;
  button?: string;
  src: string;
  href?: string;
  date?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, title, href, date } = slide;
  const isActive = current === index;

  const handleClick = () => {
    if (href && isActive) {
      window.location.href = href;
    } else {
      handleSlideClick(index);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        ref={slideRef}
        className={`relative w-full h-full cursor-pointer transition-all duration-500 ease-out rounded-2xl md:rounded-3xl overflow-hidden will-change-transform ${
          isActive ? 'shadow-2xl shadow-purple-500/30' : 'shadow-xl shadow-black/20'
        }`}
        onClick={handleClick}
        onMouseMove={isActive ? handleMouseMove : undefined}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300 will-change-transform"
          style={{
            transform: isActive
              ? "translate3d(calc(var(--x) / 50), calc(var(--y) / 50), 0)"
              : "none",
          }}
        >
          <img
            className="w-full h-full object-cover transition-all duration-300 will-change-auto"
            style={{
              filter: isActive ? 'brightness(1.1) contrast(1.1) saturate(1.1)' : 'brightness(0.9) contrast(0.95)',
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
            isActive 
              ? 'from-black/80 via-black/30 to-transparent opacity-100' 
              : 'from-black/60 via-black/20 to-transparent opacity-90'
          }`} />
        </div>

        {/* Content overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 z-10 transition-all duration-300 will-change-transform ${
          isActive ? 'opacity-100 transform translate-y-0' : 'opacity-80 transform translate-y-2'
        }`}>
          <div className="bg-black/30 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 border border-white/20">
            <h3 className={`font-bold text-white line-clamp-2 transition-all duration-300 ${
              isActive ? 'text-lg md:text-xl lg:text-2xl' : 'text-base md:text-lg lg:text-xl'
            }`}>
              {title}
            </h3>
            {date && (
              <p className={`mt-2 text-gray-200 transition-all duration-300 ${
                isActive ? 'text-sm md:text-base opacity-100' : 'text-xs md:text-sm opacity-90'
              }`}>
                📅 {date}
              </p>
            )}
            {isActive && (
              <div className="mt-3 md:mt-4 opacity-100 animate-fade-in">
                <span className="inline-flex items-center text-xs md:text-sm text-purple-300 hover:text-purple-200 transition-colors font-medium">
                  Click to view event details
                  <IconArrowNarrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Banner-style tag */}
        {isActive && (
          <div className="absolute top-3 md:top-4 lg:top-6 left-3 md:left-4 lg:left-6 z-20">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-lg">
              Featured Event
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CarouselProps {
  slides: SlideData[];
  current?: number;
  onPrev?: () => void;
  onNext?: () => void;
  showNavButtons?: boolean;
}

export function Carousel({
  slides,
  current: externalCurrent,
  onPrev,
  onNext,
  showNavButtons = true,
}: CarouselProps) {
  const [internalCurrent, setInternalCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use external current if provided, otherwise use internal state
  const current =
    externalCurrent !== undefined ? externalCurrent : internalCurrent;
  const setCurrent =
    externalCurrent !== undefined ? () => {} : setInternalCurrent;

  const totalSlides = slides.length;

  const handlePreviousClick = () => {
    if (isTransitioning) return; // Prevent spam clicking
    setIsTransitioning(true);
    
    if (onPrev) {
      onPrev();
    } else {
      const previous = current - 1;
      setCurrent(previous < 0 ? totalSlides - 1 : previous);
    }
    
    // Reset transition lock after animation
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNextClick = () => {
    if (isTransitioning) return; // Prevent spam clicking
    setIsTransitioning(true);
    
    if (onNext) {
      onNext();
    } else {
      const next = current + 1;
      setCurrent(next >= totalSlides ? 0 : next);
    }
    
    // Reset transition lock after animation
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const id = useId();

  return (
    <div
      className="relative w-full max-w-7xl mx-auto overflow-hidden"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <div className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] flex items-center justify-center py-4">
        <div className="flex items-center justify-center w-full relative">
          {/* Cards Container */}
          <div className="flex items-center justify-center space-x-6 md:space-x-8 lg:space-x-12 px-4">
            {[-1, 0, 1].map((offset) => {
              const slideIndex = ((current + offset) % totalSlides + totalSlides) % totalSlides;
              const slide = slides[slideIndex];
              const isActive = offset === 0;
              const distance = Math.abs(offset);
              
              return (
                <div
                  key={slideIndex} // Use slideIndex instead of complex key
                  className={`transition-all duration-300 ease-out transform-gpu ${
                    distance === 0 ? 'opacity-100' : 'opacity-85'
                  }`}
                  style={{
                    transform: isActive 
                      ? 'scale(1) translateY(0px) translateZ(0)' 
                      : `scale(0.8) translateY(4px) translateZ(0)`,
                    zIndex: isActive ? 10 : Math.max(1, 10 - distance),
                  }}
                >
                  <div className={`${
                    isActive 
                      ? 'w-[70vw] h-[40vh] sm:w-[65vw] sm:h-[45vh] md:w-[55vw] md:h-[50vh] lg:w-[45vw] lg:h-[55vh]' 
                      : 'w-[50vw] h-[30vh] sm:w-[45vw] sm:h-[35vh] md:w-[35vw] md:h-[40vh] lg:w-[30vw] lg:h-[45vh]'
                  } transition-all duration-300 ease-out transform-gpu`}>
                    <Slide
                      slide={slide}
                      index={slideIndex}
                      current={current}
                      handleSlideClick={(idx) => {
                        if (!isTransitioning) {
                          setCurrent(idx);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showNavButtons && (
          <>
            {/* Left Navigation Button */}
            <div className="absolute left-4 md:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 z-30">
              <button
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm hover:from-purple-700 hover:to-blue-700 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-150 hover:scale-105 shadow-xl transform-gpu ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
                }`}
                title="Previous slide"
                onClick={handlePreviousClick}
                disabled={isTransitioning}
              >
                <IconArrowNarrowRight className="text-white w-5 h-5 md:w-6 md:h-6 rotate-180" />
              </button>
            </div>

            {/* Right Navigation Button */}
            <div className="absolute right-4 md:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 z-30">
              <button
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm hover:from-purple-700 hover:to-blue-700 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-150 hover:scale-105 shadow-xl transform-gpu ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
                }`}
                title="Next slide"
                onClick={handleNextClick}
                disabled={isTransitioning}
              >
                <IconArrowNarrowRight className="text-white w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </>
        )}

        {/* Dots indicator */}
        <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-150 rounded-full transform-gpu ${
                current === index
                  ? 'w-8 h-3 bg-white'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => !isTransitioning && setCurrent(index)}
              disabled={isTransitioning}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
