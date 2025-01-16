import { useEffect, useState } from "react"
import { useEventStore } from "../../zustand/useEventStore"
import axios from "axios"
import LoadingSpinner from "../global/LoadingSpinner"
import toast from "react-hot-toast"
import PopularEvents from "./PopularEvents"
import UpcomingEvents from "./UpcomingEvents"
import { useAuthStore } from "../../zustand/useAuthStore"
import { ArrowRight, LogIn } from "lucide-react"
import Carousel from "./Carousel/page";
import ErrorDisplay from "../global/ErrorDisplay"
import { signOutUser } from "../../firebaseConfig"

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);

    const authData = useAuthStore((state) => state.authData);
    const setEventDetails = useEventStore((state) => state.setEventDetails);
    const setHideFooter = useEventStore((state) => state.setHideFooter);

    useEffect(() => {
        const fetchAllEvents = async () => {
            setLoading(true);
            setError(false);
            setHideFooter(true);

            if (authData.token == null || authData.token === '') {
                setLoading(false);
                setHideFooter(false);
                return;
            }

            try {
                const [upcomingResponse, popularResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_SERVER_URL}/events?page=1&field=createdAt&direction=desc`, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    }),
                    axios.get(`${import.meta.env.VITE_SERVER_URL}/events?page=1&direction=desc&field=participationCount`, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    })
                ]);

                const upcomingEvents = upcomingResponse.data.data.data;
                const popularEvents = popularResponse.data.data.data;

                const eventDetails = {
                    popular: popularEvents,
                    upcoming: upcomingEvents
                }

                console.log(eventDetails);
                setEventDetails(eventDetails);

                toast.success('Events fetched successfully');
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
            ) : (authData.token === null || authData.token === '') ? (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black/95">
                    <div className="max-w-md w-full px-8 py-12 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl text-center">
                        <div className="mb-6">
                            <LogIn className="w-16 h-16 mx-auto text-purple-400 animate-pulse" />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Access Required
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base mb-8">
                            Please sign in to explore amazing events and opportunities
                        </p>
                        <a href="/login">
                            <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-3">
                                <ArrowRight className="w-5 h-5" />
                                Go to Login
                            </button>
                        </a>
                    </div>
                </div>
            ) : (error) ? (
                <div className="max-w-7xl mx-auto px-4 pt-20">
                    <ErrorDisplay
                        message="Failed to load events. Please try again later."
                        showRetry={false}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            ) : (
                <div>
                    <Carousel />
                    <PopularEvents />
                    <UpcomingEvents />
                </div>
            )}
        </div >
    )
}

export default Dashboard
