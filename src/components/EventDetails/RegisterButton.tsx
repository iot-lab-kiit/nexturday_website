import { useParams } from "react-router-dom";
import { useEventStore } from "../../zustand/useEventStore";
import { CheckCircle2 } from "lucide-react";

export const RegisterButton: React.FC = () => {
  const { eventID } = useParams();
  const currentEvent = useEventStore((state) => state.currentEvent);

  if (currentEvent?.joined == true) {
    return (
      <div className="bg-black/95 backdrop-blur-md border border-zinc-800/50 rounded-lg">
        <div className="px-4 py-4 flex flex-wrap lg:flex-nowrap items-center gap-4">
          <div className="text-left flex-1">
            <div className="flex flex-row items-center gap-3">
              <div className="p-2 rounded-full bg-green-400/10">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Registration Status</p>
                <p className="font-medium text-green-400">
                  Successfully Registered
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/95 backdrop-blur-md border border-zinc-800/50 rounded-lg">
      <div className="px-4 py-4 flex flex-wrap lg:flex-nowrap items-center gap-4">
        <div className="text-left flex-1">
          <div className="flex flex-row items-center gap-2">
            {currentEvent?.price && (
              <p className="text-sm text-gray-400">Starts from ₹</p>
            )}
            <p className="text-2xl font-bold">
              {currentEvent?.price || "It's Free!"}
            </p>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end flex-1">
          <a href={`/event-details/${eventID}/register`}>
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Register
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
