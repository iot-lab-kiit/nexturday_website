/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEventStore } from "../../../zustand/useEventStore";
// import Carousel from "./Carousel";
// import Fancybox from "./Fancybox";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Autoplay, Pagination } from "swiper/modules";
import "./style.css";

export default function App() {
  const eventDetails = useEventStore((state) => state.eventDetails);
  const filteredUpcomingEvents = eventDetails?.upcoming
    .sort((a, b) => {
      const aDate: any = new Date(a.from);
      const bDate: any = new Date(b.from);
      return bDate - aDate;
    })
    .slice(0, 5);

  return (
    <div style={{ width: "80vh", height: "70vh" }} className="mx-auto md:py-12">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        style={{ height: "100%" }}
       
      >
        {filteredUpcomingEvents?.map((event, index) => (
          <SwiperSlide key={index}>
            <a
              href={`/event-details/${event.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={event.images[0]?.url}
                alt={`Slide ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0.4rem",
                }}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
