/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useEventStore } from "../../zustand/useEventStore";
import axios from "axios";
import LoadingSpinner from "../global/LoadingSpinner";
import toast from "react-hot-toast";
import PopularEvents from "./PopularEvents";
import UpcomingEvents from "./UpcomingEvents";
import { useAuthStore } from "../../zustand/UseAuthStore";
import { ArrowRight, LogIn, ChevronLeft, ChevronRight } from "lucide-react";
import Carousel from "./Carousel/page";
import ErrorDisplay from "../global/ErrorDisplay";
import { signOutUser } from "../../firebaseConfig";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const authData = useAuthStore((state) => state.authData);
  const setEventDetails = useEventStore((state) => state.setEventDetails);
  const getEventDetails = useEventStore((state) => state.eventDetails);
  const setHideFooter = useEventStore((state) => state.setHideFooter);
  const [upcomingPage, setUpcomingPage] = useState<number>(1);
  const [maxUpcomingPages, setMaxUpcomingPages] = useState<number>(1);

  async function nextPageUpcomingEvents() {
    setUpcomingPage((upcomingPage) => {
      console.log(upcomingPage);
      const eventDetails = {
        popular: getEventDetails?.popular as any,
        upcoming: null as any,
        recent: getEventDetails?.upcoming as any,
      };
      setEventDetails(eventDetails);
      window.scrollTo({
        top: document.getElementById("upcomingevents")?.offsetTop,
        behavior: "smooth",
      });
      axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/events?page=${
            upcomingPage + 1
          }&field=createdAt&direction=desc`,
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${authData.token}`,
            },
          }
        )
        .then((response) => {
          const upcommingEvents = response.data.data.data;
          const eventDetails = {
            popular: getEventDetails?.popular as any,
            upcoming: upcommingEvents as any,
            recent: getEventDetails?.upcoming as any,
          };
          setEventDetails(eventDetails);
          setMaxUpcomingPages(response.data.data.totalPages);
          
        });
      return upcomingPage + 1;
    });
  }
  async function previousPageUpcomingEvents() {
    setUpcomingPage((upcomingPage) => {
      if (upcomingPage === 1) return upcomingPage;
      console.log(upcomingPage);
      const eventDetails = {
        popular: getEventDetails?.popular as any,
        upcoming: null as any,
        recent: getEventDetails?.upcoming as any,
      };
      setEventDetails(eventDetails);
      window.scrollTo({
        top: document.getElementById("upcomingevents")?.offsetTop,
        behavior: "smooth",
      });
      axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/events?page=${
            upcomingPage - 1
          }&field=createdAt&direction=desc`,
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${authData.token}`,
            },
          }
        )
        .then((response) => {
          const upcommingEvents = response.data.data.data;
          const eventDetails = {
            popular: getEventDetails?.popular as any,
            upcoming: upcommingEvents as any,
            recent: getEventDetails?.upcoming as any,
          };
          setEventDetails(eventDetails);
          setMaxUpcomingPages(response.data.data.totalPages);
          
        });
      return upcomingPage - 1;
    });
  }

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      setError(false);
      setHideFooter(true);

      if (authData.token == null || authData.token === "") {
        setLoading(false);
        setHideFooter(false);
        return;
      }

      try {
        const [upcomingResponse, popularResponse, recentResponse] =
          await Promise.all([
            axios.get(
              `${
                import.meta.env.VITE_SERVER_URL
              }/events?page=1&field=createdAt&direction=desc`,
              {
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${authData.token}`,
                },
              }
            ),
            axios.get(
              `${
                import.meta.env.VITE_SERVER_URL
              }/events?page=1&direction=desc&field=from`,
              {
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${authData.token}`,
                },
              }
            ),
            axios.get(
              `${
                import.meta.env.VITE_SERVER_URL
              }/events?page=1&direction=asc&field=from`,
              {
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${authData.token}`,
                },
              }
            ),
          ]);

        const upcomingEvents = upcomingResponse.data.data.data;
        const popularEvents = popularResponse.data.data.data;
        const recentEvents = recentResponse.data.data.data;

        const eventDetails = {
          popular: popularEvents,
          upcoming: upcomingEvents,
          recent: recentEvents,
        };

        console.log(upcomingResponse);

        console.log(eventDetails);
        setMaxUpcomingPages(upcomingResponse.data.data.totalPages);
        setEventDetails(eventDetails);

        toast.success("Events fetched successfully");
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          signOutUser();
          return;
        }
        setError(true);
        toast.error(`Failed to fetch events. Please try again later`);
      } finally {
        setLoading(false);
        setHideFooter(false);
      }
    };

    fetchAllEvents();
  }, [authData.token, setEventDetails]);

  return (
    <div>
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 pt-20 flex justify-center items-center h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      ) : authData.token === null || authData.token === "" ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[black]">
          <div className="max-w-md w-full px-8 py-12  backdrop-blur-xl border border-zinc-800/50 rounded-2xl text-center">
            <div className="mb-6">
              <LogIn className="w-16 h-16 mx-auto text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Access Required
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mb-8">
              Please sign in with your <b>kiit email</b> to explore amazing
              events and opportunities
            </p>
            <a href="/login">
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-3">
                <ArrowRight className="w-5 h-5" />
                Go to Login
              </button>
            </a>
          </div>
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4 pt-20">
          <ErrorDisplay
            message="Failed to load events. Please try again later."
            showRetry={false}
            onRetry={() => window.location.reload()}
          />
        </div>
      ) : (
        <div
          className="bg-[#03001]"
          style={{
            // background: `
            //   radial-gradient(78.04% 121.39% at 91.04% 12.83%, rgba(40, 3, 53, 0.87) 0%, rgba(41, 41, 41, 0.26) 100%),
            //   radial-gradient(68.46% 198.58% at -18.46% 107.11%, #05537D 0%, rgba(0, 0, 0, 0) 100%)
            // `,
            // background: 'rgba(31, 31, 31, 0.87)',

            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Carousel />
          <PopularEvents />
          <UpcomingEvents />
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              className={`text-white ${upcomingPage == 1 ? "hidden" : ""}`}
              onClick={previousPageUpcomingEvents}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-white">{upcomingPage}</span>
            <button
              className={`text-white ${
                upcomingPage == maxUpcomingPages ? "hidden" : ""
              }`}
              onClick={nextPageUpcomingEvents}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
