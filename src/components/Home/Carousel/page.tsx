"use client";

import { useEventStore } from "../../../zustand/useEventStore";
import { Carousel } from "../../ui/carousel";
import { useEffect, useState } from "react";

export default function EventCarousel() {
  const eventDetails = useEventStore((state) => state.eventDetails);

  const filteredUpcomingEvents = eventDetails?.recent
    .sort((a, b) => {
      return new Date(a.from).getTime() - new Date(b.from).getTime();
    })
    .slice(0, 10);

  const slideData = filteredUpcomingEvents?.map((event) => ({
    title: event.name,
    src: event.images[0]?.url,
    href: `/event-details/${event.id}`,
    date: new Date(event.from).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    button: "View Event",
  }));

  const [current, setCurrent] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (!slideData || slideData.length <= 1) return;

    const interval = setInterval(() => {
      if (!isChanging) {
        setCurrent((prev) => (prev + 1) % slideData.length);
      }
    }, 5000); // Increased to 5 seconds for better UX

    return () => clearInterval(interval);
  }, [slideData, isChanging]);

  const handlePrev = () => {
    if (!slideData || slideData.length <= 1 || isChanging) return;
    setIsChanging(true);
    setCurrent((prev) => (prev - 1 + slideData.length) % slideData.length);
    setTimeout(() => setIsChanging(false), 300);
  };

  const handleNext = () => {
    if (!slideData || slideData.length <= 1 || isChanging) return;
    setIsChanging(true);
    setCurrent((prev) => (prev + 1) % slideData.length);
    setTimeout(() => setIsChanging(false), 300);
  };

  return (
    <div className="relative w-full py-4 md:py-6 mb-6 md:mb-8">
      {slideData && slideData.length > 0 && (
        <Carousel
          slides={slideData}
          current={current}
          onPrev={handlePrev}
          onNext={handleNext}
          showNavButtons={true}
        />
      )}
    </div>
  );
}
