import { useEventStore } from "../../zustand/useEventStore";
import { EventCard } from "./EventCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { FreeMode, Pagination, Mousewheel, Keyboard } from "swiper/modules";

const PopularEvents = () => {
  const popularEvents = useEventStore((state) => state.eventDetails)?.popular;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-2xl text-center font-bold text-white">
        Popular Events
      </h1>

      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        freeMode={true}
        // mousewheel={true}
        keyboard={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Pagination, Mousewheel, Keyboard]}
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
