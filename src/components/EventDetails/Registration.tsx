import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useEventStore } from "../../zustand/useEventStore";
import { useAuthStore } from "../../zustand/UseAuthStore.tsx";

export const Registration: React.FC = () => {
  const { eventID } = useParams<{ eventID: string }>();
  const navigate = useNavigate();

  const currentEvent = useEventStore((state) => state.currentEvent);
  const markEventAsJoined = useEventStore((state) => state.markEventAsJoined);
  const authData = useAuthStore((state) => state.authData);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const isSolo = currentEvent?.maxTeamSize === 1;
  const hasPayment = currentEvent?.paid;

  const isDeadlineExceeded = () => {
    if (!currentEvent?.deadline) return false;
    const deadlineDate = new Date(currentEvent.deadline);
    const now = new Date();
    return deadlineDate < now;
  };

  useEffect(() => {
    const checkTeamStatus = async () => {
      if (!eventID || !authData?.token) return;

      try {
        const res = await axios.get(
          `${SERVER_URL}/events/participants/teamId/${eventID}`,
          {
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          }
        );

        if (res.data?.data?.teamId) {
          const foundTeamId = res.data.data.teamId;
          setTeamId(foundTeamId);

          // For paid events, check payment status
          if (hasPayment) {
            try {
              const paymentRes = await axios.get(
                `${SERVER_URL}/events/participants/team/paymentStatus/${foundTeamId}`,
                {
                  headers: {
                    Authorization: `Bearer ${authData.token}`,
                  },
                }
              );

              if (paymentRes.data?.data?.payment_status) {
                setPaymentStatus(paymentRes.data.data.payment_status);
              }
            } catch (paymentError) {
              console.error("Error checking payment status:", paymentError);
              // If payment status check fails, assume payment needed
              setPaymentStatus("PENDING");
            }
          }
        } else {
          setTeamId(null);
          setPaymentStatus(null);
        }
      } catch (err) {
        console.error("Error checking team status:", err);
        setTeamId(null);
        setPaymentStatus(null);
      }
    };

    if (!isSolo && !hasPayment) {
      checkTeamStatus();
    } else if (!isSolo && hasPayment) {
      // For paid team events, always check both team and payment status
      checkTeamStatus();
    }
  }, [eventID, authData, isSolo, hasPayment, SERVER_URL]);

  const handleRegister = async () => {
    if (!eventID || !authData?.token) {
      setError("Cannot register: Missing event ID or authentication.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${SERVER_URL}/events/participants/team/create/${eventID}`,
        {
          teamName: "",
          invitedMembers: [],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        markEventAsJoined(eventID);

        // For solo paid events, redirect to payment page after registration
        if (isSolo && hasPayment) {
          navigate(`/event-details/${eventID}/payments`);
          return;
        }
      } else {
        setError(`Registration failed: Status ${response.status}`);
      }
    } catch (err: unknown) {
      console.error("Registration API error:", err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
        ? err.message
        : "An error occurred during registration.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageTeamClick = () => {
    if (teamId) {
      navigate(`/event-details/${eventID}/teamsDashboard`);
    } else {
      navigate(`/event-details/${eventID}/teams`);
    }
  };

  if (currentEvent?.joined === true) {
    // Function to get the appropriate status message and styling
    const getRegistrationStatus = () => {
      if (isSolo) {
        if (
          hasPayment &&
          (paymentStatus === "APPROVED" || paymentStatus === "VERIFIED")
        ) {
          return {
            message: "Payment Verified - Registered Successfully!",
            color: "text-green-400",
            bgColor: "bg-green-400/10",
            icon: CheckCircle2,
            iconColor: "text-green-400",
          };
        } else if (hasPayment && paymentStatus === "UNDER_VERIFICATION") {
          return {
            message: "Payment Under Verification",
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
            icon: Clock,
            iconColor: "text-yellow-400",
          };
        } else if (hasPayment) {
          return {
            message: "Proceed to Payment",
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
            icon: Clock,
            iconColor: "text-yellow-400",
          };
        } else {
          return {
            message: "Registered Successfully!",
            color: "text-green-400",
            bgColor: "bg-green-400/10",
            icon: CheckCircle2,
            iconColor: "text-green-400",
          };
        }
      } else {
        // Team event
        if (hasPayment && paymentStatus) {
          switch (paymentStatus) {
            case "APPROVED":
            case "VERIFIED":
              return {
                message: "Payment Approved - Registered Successfully!",
                color: "text-green-400",
                bgColor: "bg-green-400/10",
                icon: CheckCircle2,
                iconColor: "text-green-400",
              };
            case "UNDER_VERIFICATION":
              return {
                message: "Payment Under Verification",
                color: "text-yellow-400",
                bgColor: "bg-yellow-400/10",
                icon: Clock,
                iconColor: "text-yellow-400",
              };
            default:
              return {
                message: "Payment not yet done",
                color: "text-red-400",
                bgColor: "bg-red-400/10",
                icon: AlertCircle,
                iconColor: "text-red-400",
              };
          }
        } else if (hasPayment) {
          // Paid event but no payment status yet
          return {
            message: "Payment not yet done",
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
            icon: Clock,
            iconColor: "text-yellow-400",
          };
        } else {
          // Free team event
          return {
            message: "Registered Successfully!",
            color: "text-green-400",
            bgColor: "bg-green-400/10",
            icon: CheckCircle2,
            iconColor: "text-green-400",
          };
        }
      }
    };

    const status = getRegistrationStatus();
    const StatusIcon = status.icon;

    return (
      <div className="bg-black/95 backdrop-blur-md border border-zinc-800/50 rounded-lg">
        <div className="px-4 py-4 flex flex-wrap lg:flex-nowrap items-center gap-4">
          <div className="text-left flex-1">
            <div className="flex flex-row items-center gap-3">
              <div className={`p-2 rounded-full ${status.bgColor}`}>
                <StatusIcon className={`w-5 h-5 ${status.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Registration Status</p>
                <p className={`font-medium ${status.color}`}>
                  {status.message}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end flex-1 gap-3">
            {!isSolo &&
              (!hasPayment ||
                paymentStatus === "APPROVED" ||
                paymentStatus === "VERIFIED") && (
                <button
                  onClick={handleManageTeamClick}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Team Dashboard
                </button>
              )}
            {hasPayment &&
              isSolo &&
              paymentStatus !== "APPROVED" &&
              paymentStatus !== "VERIFIED" && (
                <a href={`/event-details/${eventID}/payments`}>
                  <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                    {paymentStatus === "UNDER_VERIFICATION"
                      ? "Check Payment Status"
                      : "Proceed to Payment"}
                  </button>
                </a>
              )}
            {hasPayment &&
              !isSolo &&
              paymentStatus !== "APPROVED" &&
              paymentStatus !== "VERIFIED" && (
                <a href={`/event-details/${eventID}/payments`}>
                  <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                    {paymentStatus === "UNDER_VERIFICATION"
                      ? "Check Payment Status"
                      : "Proceed to Payment"}
                  </button>
                </a>
              )}
          </div>
        </div>
      </div>
    );
  }

  if (isDeadlineExceeded()) {
    return (
      <div className="bg-black/95 backdrop-blur-md border border-zinc-800/50 rounded-lg">
        <div className="px-4 py-4 flex flex-wrap lg:flex-nowrap items-center gap-4">
          <div className="text-left flex-1">
            <div className="flex flex-row items-center gap-3">
              <div className="p-2 rounded-full bg-red-400/10">
                <Clock className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Registration Status</p>
                <p className="font-medium text-red-400">
                  Registrations have closed!
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
            {hasPayment ? (
              <p className="text-xl md:text-2xl text-gray-400">
                {isSolo
                  ? `Fee: ₹${currentEvent?.price}`
                  : `Team Fee Starts From: ₹${currentEvent?.price}`}
              </p>
            ) : (
              <p className="text-xl md:text-2xl font-semibold text-green-400">
                {currentEvent?.price === 0 || !currentEvent?.price
                  ? "Free Registration"
                  : `₹${currentEvent.price}`}{" "}
                {isSolo ? "" : "(Team)"}
              </p>
            )}
          </div>
          {error && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <AlertCircle size={14} /> {error}
            </p>
          )}
          {!isSolo && (
            <p className="text-xs text-gray-500 mt-1">
              {hasPayment && !currentEvent?.joined
                ? "Register first to create or join a team."
                : "Create or join a team to register."}
            </p>
          )}
        </div>

        <div className="flex justify-center lg:justify-end flex-1">
          {isSolo ? (
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className={`bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading
                ? "Registering..."
                : hasPayment
                ? "Proceed to Payment"
                : "Register Now"}
            </button>
          ) : (
            <button
              onClick={handleManageTeamClick}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              {hasPayment && !currentEvent?.joined
                ? "Register Now"
                : "Manage Teams"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
