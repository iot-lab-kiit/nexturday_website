/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEventStore } from "../../../zustand/useEventStore";
import Carousel from "./Carousel";
import Fancybox from "./Fancybox";

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
    <div>
      <Fancybox
        options={{
          Carousel: {
            infinite: false,
          },
        }}
      >
        <Carousel options={{ infinite: false }}>
          {filteredUpcomingEvents?.map((event, index) => (
            <div
              key={index}
              className="f-carousel__slide"
              data-fancybox="gallery"
              data-src={event.images[0]?.url}
              data-thumb-src={event.images[0]?.url}
            >
              <img alt="" src={event.images[0]?.url} width="400" height="300" />
            </div>
          ))}
        </Carousel>
      </Fancybox>
    </div>
  );
}
