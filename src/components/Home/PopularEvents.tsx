import { useEventStore } from "../../zustand/useEventStore";
import { EventCard } from "./EventCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const PopularEvents = () => {
  const popularEvents = useEventStore((state) => state.eventDetails)?.popular;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Popular Events
      </h1>

      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
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
    </section>
  );
};

export default PopularEvents;
