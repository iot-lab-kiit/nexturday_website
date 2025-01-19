/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEventStore } from "../../../zustand/useEventStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
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
    <div className="w-[80%] h-full mx-auto md:py-12">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: -75,
          depth: 250,
          modifier: 3.5,
          slideShadows: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[EffectCoverflow, Navigation,Autoplay]}
      >
        {filteredUpcomingEvents?.map((event, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full flex justify-center items-center rounded-lg">
              <a
                href={`/event-details/${event.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className="border-2 border-white p-2 rounded-lg bg-blur">
                  <div className="w-84 h-80 relative rounded-lg overflow-hidden ">
                    <img
                      src={event.images[0]?.url}
                      alt={`Slide ${index}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </a>
            </div>
          </SwiperSlide>
        ))}
        
      </Swiper>
    </div>
  );
}
