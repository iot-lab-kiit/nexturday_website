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

  // Start from 2nd slide (index 1) and limit range to exclude first and last
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!slideData || slideData.length <= 2) return;

    const interval = setInterval(() => {
      setCurrent((prev) => {
        // Cycle from index 1 to slideData.length - 2 (second to second-last)
        const next = prev + 1;
        if (next >= slideData.length - 1) {
          return 1; // Reset to second card
        }
        return next;
      });
    }, 4000); // Auto-rotate every 4 seconds

    return () => clearInterval(interval);
  }, [slideData]);

  // Navigation handlers - limited to second through second-last cards
  const handlePrev = () => {
    if (!slideData || slideData.length <= 2) return;
    setCurrent((prev) => {
      if (prev <= 1) {
        return slideData.length - 2; // Go to second-last card
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    if (!slideData || slideData.length <= 2) return;
    setCurrent((prev) => {
      if (prev >= slideData.length - 2) {
        return 1; // Go to second card
      }
      return prev + 1;
    });
  };

  return (
    <div className="relative w-full h-[200px] md:h-[250px] py-4 mb-8 md:mb-12 carousel-container">
      {slideData && (
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
