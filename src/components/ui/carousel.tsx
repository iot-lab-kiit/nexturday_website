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
  const slideRef = useRef<HTMLLIElement>(null);

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

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    } else {
      handleSlideClick(index);
    }
  };

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
       className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] mx-3 md:mx-4 z-10 cursor-pointer"        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
        className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-xl overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-600 ease-in-out"      
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-1000" />
          )}
        </div>

        <article
          className={`absolute bottom-3 left-3 right-3 z-20 transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-md p-3 border border-white/10">
            <h2
             className="text-base sm:text-lg md:text-xl font-semibold text-white line-clamp-1"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
            >
              {title}
            </h2>
            {date && (
              <p
                  className="text-sm md:text-base mt-1 text-gray-200"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
              >
                {date}
              </p>
            )}
          </div>
        </article>
      </li>
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

  // Use external current if provided, otherwise use internal state
  const current =
    externalCurrent !== undefined ? externalCurrent : internalCurrent;
  const setCurrent =
    externalCurrent !== undefined ? () => {} : setInternalCurrent;

  const handlePreviousClick = () => {
    if (onPrev) {
      onPrev();
    } else {
      const previous = current - 1;
      setCurrent(previous < 0 ? slides.length - 1 : previous);
    }
  };

  const handleNextClick = () => {
    if (onNext) {
      onNext();
    } else {
      const next = current + 1;
      setCurrent(next === slides.length ? 0 : next);
    }
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className="relative w-[70vmin] h-[70vmin] p-12 mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute flex mx-[-3vmin] transition-transform duration-1000 ease-in-out carousel-container "
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      {showNavButtons && (
        <>
          {/* Left Navigation Button */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30">
            <button
              className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm hover:bg-black/70 border border-white/20 rounded-full focus:outline-none focus:border-purple-400 transition duration-300 hover:scale-110"
              title="Previous slide"
              onClick={handlePreviousClick}
            >
              <IconArrowNarrowRight className="text-white w-4 h-4 rotate-180" />
            </button>
          </div>

          {/* Right Navigation Button */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30">
            <button
              className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm hover:bg-black/70 border border-white/20 rounded-full focus:outline-none focus:border-purple-400 transition duration-300 hover:scale-110"
              title="Next slide"
              onClick={handleNextClick}
            >
              <IconArrowNarrowRight className="text-white w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
