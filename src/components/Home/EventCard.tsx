import { Event } from "../../types/types";
import { formatDate } from "../../utils/utils";

export const EventCard = (event: Event) => {
  const eventDate = formatDate(event.from);

  const renderImage = () => {
    if (!event.images?.[0]?.url) {
      return (
        <div className=" w-full h-full rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-24 h-24 text-purple-400/80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5 2V9.85999C15.5 10.3 14.98 10.52 14.66 10.23L12.34 8.09003C12.15 7.91003 11.85 7.91003 11.66 8.09003L9.34003 10.23C9.02003 10.52 8.5 10.3 8.5 9.85999V2H15.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 14H17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 18H17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-zinc-400 text-center">
              Event Preview
            </div>
          </div>
        </div>
      );
    }

    return (
      <img
        src={event.images[0].url}
        alt={event.name}
         loading="lazy"
        className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center p-8">
                            <div class="flex flex-col items-center gap-4">
                                <svg class="w-24 h-24 text-purple-400/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M15.5 2V9.85999C15.5 10.3 14.98 10.52 14.66 10.23L12.34 8.09003C12.15 7.91003 11.85 7.91003 11.66 8.09003L9.34003 10.23C9.02003 10.52 8.5 10.3 8.5 9.85999V2H15.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M13.5 14H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9 18H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <div class="text-sm text-zinc-400 text-center">Event Preview</div>
                            </div>
                        </div>
                    `;
        }}
      />
    );
  };

  return (
    <a
      href={`/event-details/${event.id}`}
      className="group relative rounded-2xl overflow-hidden backdrop-blur-sm border border-zinc-800/50   transition-all duration-300 hover:shadow-gray-700 hover:shadow-lg"
    >
      <div className="w-full aspect-square p-4 bg-zinc-800/50 rounded-t-xl">
        {renderImage()}
      </div>

      <div className="px-4 pb-4 flex gap-6 bg-zinc-800/50 rounded-b-xl">
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm rounded-lg p-3">
          <div className="text-center">
            <div className="text-zinc-400 text-sm font-medium">
              {eventDate.weekday}
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold text-2xl">
              {eventDate.day}
            </div>
            <div className="text-zinc-400 text-sm font-medium">
              {eventDate.month}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-2">
          <h2 className=" font-bold text-white text-transparent">
            {event.name}
          </h2>
          <div className="space-y-1.5">
            <p className="text-gray-300 text-sm flex items-center gap-2">
              {event.details[0].venue 
                ? event.details[0].venue.name 
                : event.details.length>0 ?"Multiple venue":"ONLINE"}
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              {event.society.name}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};
