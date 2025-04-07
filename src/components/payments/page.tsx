import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../zustand/UseAuthStore";
import toast from "react-hot-toast";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const Payments: React.FC = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();

  const authData = useAuthStore((state) => state.authData);

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [uid, setUid] = useState<string>("");
  const [maxTeamSize, setMaxTeamSize] = useState<number>(1);

  useEffect(() => {
    if (!eventID) return;
    axios
      .get(`${SERVER_URL}/events/${eventID}`)
      .then((res) => {
        const data = res.data.data;
        const imageUrl = data.images?.[0]?.url || null;
        setQrUrl(imageUrl);
        setMaxTeamSize(data.maxTeamSize);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch event QR.");
      });
  }, [eventID]);

  const handleSubmit = async () => {
    if (!uid.trim()) {
      toast.error("Please enter a transaction UID.");
      return;
    }

    try {
      await axios.post(
        `${SERVER_URL}/payments/${eventID}`,
        { uid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      toast.success("Transaction UID submitted.");
      if (maxTeamSize > 1) navigate("/teams");
      else navigate("/events");
    } catch (err) {
      console.error("UID submission failed", err);
      toast.error("Failed to submit transaction UID.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/95 text-white px-4">
      <h1 className="text-2xl font-bold mb-6">Scan QR to Pay</h1>
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
    </div>
  );
};
