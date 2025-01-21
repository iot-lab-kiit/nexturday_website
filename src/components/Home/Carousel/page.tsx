import { useEventStore } from "../../../zustand/useEventStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "./style.css";

export default function App() {
  const eventDetails = useEventStore((state) => state.eventDetails);
  const filteredUpcomingEvents = eventDetails?.recent
    .filter((event) => {
      const eventDate = new Date(event.from);
      const currentDate = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(currentDate.getDate() + 7);
      return eventDate >= currentDate && eventDate <= sevenDaysLater;
    })
    .sort((a, b) => {
      const aDate: any = new Date(a.from);
      const bDate: any = new Date(b.from);
      return aDate - bDate;
    })
    .slice(0, 5);

  return (
    <div className="w-full max-w-[1400px] h-full mx-auto py-8 md:py-16 px-4">
      <div className="relative">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 blur-[200px] -z-10" /> */}
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
              slidesPerView: 1.5,
            },
            768: {
              slidesPerView: 2.2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          coverflowEffect={{
            rotate: 5,
            stretch: -50,
            depth: 200,
            modifier: 2,
            slideShadows: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="mySwiper"
        >
          {filteredUpcomingEvents?.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full flex justify-center items-center rounded-full transform transition-transform duration-300 hover:scale-105">
                <a
                  href={`/event-details/${event.id}`}
                  rel="noreferrer"
                  className="w-full block group"
                >
                  <div className="bg-gradient-to-b from-purple-900/30 to-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden shadow-xl transition-all duration-300">

                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                       loading="lazy"
                        src={event.images[0]?.url}
                        alt={`Event ${index + 1}`}
                        className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" /> */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                        <h3 className="text-white font-bold text-xl mb-2 truncate transition-colors">
                          {event.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                          <p className="text-purple-200 text-sm">
                            {new Date(event.from).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
