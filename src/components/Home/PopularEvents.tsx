import { useEventStore } from "../../zustand/useEventStore";
import { EventCard } from "./EventCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import {
  FreeMode,
  Pagination,
  Mousewheel,
  Keyboard,
  Navigation,
} from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const PopularEvents = () => {
  const popularEvents = useEventStore((state) => state.eventDetails)?.popular;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-4 md:py-6 relative">
      <h1 className="text-xl md:text-2xl text-center font-bold text-white mb-6 md:mb-8">
        Popular Events
      </h1>
        
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        freeMode={true}
        keyboard={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Pagination, Mousewheel, Keyboard, Navigation]}
      >
        {popularEvents && popularEvents.length > 0 ? (
          popularEvents.map((event, index) => (
            <SwiperSlide key={index}>
              <EventCard {...event} />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <p className="text-gray-400 col-span-full text-center">
              No popular events found.
            </p>
          </SwiperSlide>
        )}
      </Swiper>

      {/* Navigation buttons at the bottom */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={goPrev}
          className="bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-full p-2 text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goNext}
          className="bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-full p-2 text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default PopularEvents;
