import EventCard from './EventCard';

const Hero = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        <a href="/event-details" className="block w-full">
          <EventCard />
        </a>
      </div>
    </div>
  );
};

export default Hero;
