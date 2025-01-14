import { useEffect, useState } from "react"
import { useEventStore } from "../../zustand/useEventStore"
import axios from "axios"
import LoadingSpinner from "../global/LoadingSpinner"
import toast from "react-hot-toast"
import PopularEvents from "./PopularEvents"
import UpcomingEvents from "./UpcomingEvents"
import { useAuthStore } from "../../zustand/useAuthStore"

const Dashboard = () => {
    const [loading, setLoading] = useState(true)

    const authData = useAuthStore((state) => state.authData)
    const setEventDetails = useEventStore((state) => state.setEventDetails)

    useEffect(() => {
        const fetchAllEvents = async () => {
            setLoading(true);

            try {
                const upcomingUrl = 'https://nexterday.iotkiit.in/api/events?page=1&field=createdAt&direction=desc';
                const popularUrl = 'https://nexterday.iotkiit.in/api/events?page=1&direction=desc&field=participationCount';

                const [upcomingResponse, popularResponse] = await Promise.all([
                    axios.get(upcomingUrl, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    }),
                    axios.get(popularUrl, {
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
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        fetchAllEvents();
    }, [authData.token, setEventDetails]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div>
            <PopularEvents />
            <UpcomingEvents />
        </div>
    )
}

export default Dashboard
