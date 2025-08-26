import { useState, useEffect } from "react";
import { Users, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
// import { CreateTeamForm } from './CreateTeamForm';
import { JoinTeamForm } from "./JoinTeamForm";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CurrentTeam from "./CurrentTeam";
import { useAuthStore } from "../../zustand/UseAuthStore.tsx";
import { useEventStore } from "../../zustand/useEventStore.tsx";
import axios from "axios";
import toast from "react-hot-toast";

const Teams = () => {
  // const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showJoinTeamForm, setShowJoinTeamForm] = useState<boolean>(false);
  const [isCheckingTeam, setIsCheckingTeam] = useState<boolean>(true);
  const currentTeam = null;
  const navigate = useNavigate();
  const { eventID } = useParams<{ eventID: string }>();
  const [searchParams] = useSearchParams();
  const authData = useAuthStore((state) => state.authData);
  const currentEvent = useEventStore((state) => state.currentEvent);
  const teamId = authData?.teamId;

  // Check URL parameters to auto-open join team form
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "join") {
      setShowJoinTeamForm(true);
    }
  }, [searchParams]);

  // Check if user already has a team for this event
  useEffect(() => {
    const checkExistingTeam = async () => {
      if (!authData?.token || !eventID) {
        setIsCheckingTeam(false);
        return;
      }

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/events/participants/teamId/${eventID}`,
          {
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          }
        );

        // If we get a team ID, check payment status for paid events
        if (response.data?.data?.teamId) {
          const foundTeamId = response.data.data.teamId;

          // For paid events, check payment status before allowing team dashboard access
          if (currentEvent?.paid) {
            try {
              const paymentResponse = await axios.get(
                `${
                  import.meta.env.VITE_SERVER_URL
                }/events/participants/team/paymentStatus/${foundTeamId}`,
                {
                  headers: {
                    Authorization: `Bearer ${authData.token}`,
                  },
                }
              );

              const paymentStatus = paymentResponse.data?.data?.payment_status;

              if (
                paymentStatus === "APPROVED" ||
                paymentStatus === "VERIFIED"
              ) {
                // Payment approved, allow team dashboard access
                navigate(`/event-details/${eventID}/teamsDashboard`);
                return;
              } else {
                // Check if user came here to join a team (from payment page)
                const action = searchParams.get("action");
                if (action === "join") {
                  // Allow user to stay on teams page to join other teams
                  setIsCheckingTeam(false);
                  return;
                }

                // Payment not approved, redirect to payment page
                toast("Please complete payment to access team dashboard", {
                  icon: "💳",
                });
                navigate(`/event-details/${eventID}/payments`);
                return;
              }
            } catch (paymentError) {
              console.error("Error checking payment status:", paymentError);
              // If payment check fails, still redirect to payment page for paid events
              navigate(`/event-details/${eventID}/payments`);
              return;
            }
          } else {
            // Free event, allow direct access to team dashboard
            navigate(`/event-details/${eventID}/teamsDashboard`);
            return;
          }
        }
      } catch (error) {
        // If error is 404 or team not found, it means user has no team yet
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 404 ||
            error.response?.data?.message?.includes("not found"))
        ) {
          // User has no team, continue to show team creation/join options
        } else {
          console.error("Error checking team status:", error);
          toast.error("Failed to check team status");
        }
      } finally {
        setIsCheckingTeam(false);
      }
    };

    checkExistingTeam();
  }, [eventID, authData?.token, navigate, currentEvent?.paid, searchParams]);

  // Show loading while checking team status
  if (isCheckingTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
        <div className="text-white text-lg">Checking team status...</div>
      </div>
    );
  }

  // If user has teamId in auth store, show current team
  if (teamId) {
    return <CurrentTeam />;
  }

  if (!currentTeam) {
    return (
      <>
        {/* <CreateTeamForm
                    isOpen={showCreateForm}
                    onClose={() => setShowCreateForm(false)}
                /> */}
        <JoinTeamForm
          isOpen={showJoinTeamForm}
          onClose={() => setShowJoinTeamForm(false)}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gradient-to-br from-zinc-900 to-black"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="flex flex-col items-center gap-4 text-center py-8"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20 blur-xl animate-pulse" />
                <Users className="size-24 text-purple-500 relative" />
              </motion.div>

              <div className="space-y-6">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                  Team Up for Success!
                </h1>
                <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
                  Join forces with fellow innovators to create something
                  extraordinary. Build your dream team and get ready to showcase
                  your talents.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-8 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl border border-purple-500/20"
                >
                  <UserPlus className="size-8 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Create Team
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    Lead your own team and invite members to join your
                    innovation journey
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      navigate(`/event-details/${eventID}/register`)
                    }
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20"
                  >
                    Create New Team
                  </motion.button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-8 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl border border-blue-500/20"
                >
                  <Users className="size-8 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Join Team
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    Enter a team code or use an invite link to join an existing
                    team
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-4 bg-zinc-800 text-white rounded-xl font-semibold shadow-lg shadow-zinc-800/20"
                    onClick={() => setShowJoinTeamForm(true)}
                  >
                    Join Existing Team
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </>
    );
  }
};

export default Teams;
