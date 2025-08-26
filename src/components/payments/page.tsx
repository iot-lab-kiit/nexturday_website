import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../zustand/UseAuthStore";
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const Payments: React.FC = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();

  const authData = useAuthStore((state) => state.authData);

  const [teamId, setTeamId] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [uid, setUid] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(true);

  useEffect(() => {
    if (!eventID) return;
    axios
      .get(`${SERVER_URL}/events/${eventID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        const imageUrl = data.images?.[0]?.url || null;
        setQrUrl(imageUrl);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch event QR.");
      });
  }, [eventID, authData?.token]);

  useEffect(() => {
    const checkExistingTeam = async () => {
      if (!authData?.token || !eventID) {
        return;
      }

      try {
        const response = await axios.get(
          // teamid is fetched
          `${
            import.meta.env.VITE_SERVER_URL
          }/events/participants/teamId/${eventID}`,
          {
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          }
        );
        if (response.data?.data?.teamId) {
          console.log("Existing teamId found:", response.data);
          const foundTeamId = response.data.data.teamId;
          setTeamId(foundTeamId);

          // Check payment status after getting teamId
          try {
            const response1 = await axios.get(
              //payment status is fetched
              `${
                import.meta.env.VITE_SERVER_URL
              }/events/participants/team/paymentStatus/${foundTeamId}`,
              {
                headers: {
                  Authorization: `Bearer ${authData.token}`,
                },
              }
            );
            console.log("Payment status response:", response1.data);
            if (response1.data?.data?.payment_status) {
              const status = response1.data.data.payment_status;
              setPaymentStatus(status);

              // If payment is approved, redirect to team dashboard
              if (status === "APPROVED" || status === "VERIFIED") {
                toast.success("Payment verified successfully!");
                navigate(`/event-details/${eventID}/teamsDashboard`);
                return;
              }
            }
          } catch (paymentError) {
            console.error("Error checking payment status:", paymentError);
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
      }
    };

    checkExistingTeam();
  }, [eventID, authData?.token, navigate]);

  const checkPaymentStatus = async () => {
    if (!teamId || !authData?.token) {
      toast.error("No team ID found for payment status check.");
      return;
    }

    setIsCheckingStatus(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/events/participants/team/paymentStatus/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      if (response.data?.data?.payment_status) {
        const status = response.data.data.payment_status;
        setPaymentStatus(status);

        if (status === "APPROVED" || status === "VERIFIED") {
          toast.success("Payment verified successfully!");
          navigate(`/event-details/${eventID}/teamsDashboard`);
        } else if (status === "UNDER_VERIFICATION") {
          toast("Payment is under verification. Please wait.", {
            icon: "⏳",
          });
        } else {
          toast.error("Payment not yet done. Please complete your payment.");
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error("Failed to check payment status");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleSubmit = async () => {
    if (!uid.trim()) {
      toast.error("Please enter a transaction UID.");
      return;
    }

    try {
      // Use team-specific payment endpoint if this event uses teams
      if (!teamId) {
        toast.error("No team ID found for payment.");
        return;
      }
      await axios.post(
        `${SERVER_URL}/events/participants/team/updatePayment/${teamId}`,
        { uid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );
      toast.success("Transaction UID submitted for team.");
      setUid(""); // Clear the input
      setShowQR(false); // Hide QR after submission

      // Check payment status after submission
      setTimeout(() => {
        checkPaymentStatus();
      }, 1000);
    } catch (err) {
      console.error("UID submission failed", err);
      toast.error("Failed to submit transaction UID.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/95 text-white px-4">
      <h1 className="text-2xl font-bold mb-6">Event Payment</h1>

      {/* Payment Status Display */}
      {paymentStatus && (
        <div className="mb-6 p-4 rounded-lg border max-w-sm w-full">
          {paymentStatus === "APPROVED" || paymentStatus === "VERIFIED" ? (
            <div className="flex items-center gap-3 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <p className="font-semibold">Payment Approved</p>
                <p className="text-sm text-gray-400">
                  Redirecting to team dashboard...
                </p>
              </div>
            </div>
          ) : paymentStatus === "UNDER_VERIFICATION" ? (
            <div className="flex items-center gap-3 text-yellow-400">
              <Clock className="w-5 h-5" />
              <div>
                <p className="font-semibold">Payment Under Verification</p>
                <p className="text-sm text-gray-400">
                  Please wait while we verify your payment
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Payment not yet done</p>
                <p className="text-sm text-gray-400">
                  Please complete your payment
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show QR and payment form when no approved payment or user wants to pay again */}
      {(showQR ||
        !paymentStatus ||
        (paymentStatus !== "APPROVED" && paymentStatus !== "VERIFIED")) && (
        <>
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="Payment QR Code"
              className="w-64 h-64 object-contain border border-gray-700 rounded-lg"
            />
          ) : (
            <p>Loading QR code...</p>
          )}

          <div className="mt-8 w-full max-w-sm">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Enter Transaction UID
            </label>
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Enter your transaction ID"
              className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Submit
            </button>
          </div>
        </>
      )}

      {/* Payment Status Actions */}
      {paymentStatus &&
        paymentStatus !== "APPROVED" &&
        paymentStatus !== "VERIFIED" && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={checkPaymentStatus}
              disabled={isCheckingStatus}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isCheckingStatus ? "animate-spin" : ""}`}
              />
              {isCheckingStatus ? "Checking..." : "Check Status"}
            </button>
          </div>
        )}

      {/* Back to Event Button */}
      <button
        onClick={() => navigate(`/event-details/${eventID}`)}
        className="mt-6 text-gray-400 hover:text-white transition-colors underline"
      >
        ← Back to Event Details
      </button>
    </div>
  );
};
