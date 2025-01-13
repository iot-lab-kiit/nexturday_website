import React from "react";
import { Waves } from "lucide-react";
import { useAuthStore } from "../../zustand/UseAuthStore";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`rounded-lg shadow-lg ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={className}>{children}</div>
);

// src/components/Carousel/Carousel.tsx
import { useState } from "react";

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const authData = useAuthStore((state) => state.authData);

  return (
    <>
      <header className="py-4 flex justify-between items-center mt-4 px-4 mb-4">
        <div className="flex items-center gap-2">
          <Waves className="text-yellow-400 w-6 h-6" />
          <span className="text-lg font-semibold">
            Hi, {authData.displayName}
          </span>
        </div>
      </header>

      <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-50"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            zIndex: -1,
          }}
        ></div>

        <div className="relative z-10">
          <div
            className="flex transition-transform duration-500 ease-in-out h-[400px]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
          >
            &#10095;
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
