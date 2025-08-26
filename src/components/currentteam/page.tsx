import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Pencil,
  Shield,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../EventDetails/CardComponents";
import { useState, useEffect } from "react";
import { Team } from "../../types/types";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../zustand/UseAuthStore.tsx";
import { useEventStore } from "../../zustand/useEventStore";
import toast from "react-hot-toast";

interface ParticipantDetail {
  firstname: string;
  lastname: string;
  branch: string;
  phoneNumber: string;
  studyYear: number;
}

interface Participant {
  id: string;
  universityEmail: string;
  detail: ParticipantDetail;
}

interface APITeamMember {
  participant: Participant;
}

interface APITeamResponse {
  id: string;
  name: string;
  leaderId: string;
  event: {
    maxTeamSize: number;
  };
  leader: Participant;
  members: APITeamMember[];
}

const CurrentTeam = () => {
  const { eventID } = useParams<{ eventID: string }>();
  const navigate = useNavigate();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const { authData } = useAuthStore();
  const { currentEvent } = useEventStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!authData?.token) {
        setLoading(false);
        return;
      }

      try {
        const teamIdResponse = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/events/participants/teamId/${eventID}`,
          { headers: { Authorization: `Bearer ${authData.token}` } }
        );

        const teamDetailsResponse = await axios.get<{ data: APITeamResponse }>(
          `${import.meta.env.VITE_SERVER_URL}/events/participants/team/${
            teamIdResponse.data.data.teamId
          }`,
          { headers: { Authorization: `Bearer ${authData.token}` } }
        );

        const apiTeam = teamDetailsResponse.data.data;

        setCurrentTeam({
          id: apiTeam.id,
          name: apiTeam.name,
          code: apiTeam.id,
          maxMembers: currentEvent?.maxTeamSize || 4,
          leader: apiTeam.leader.universityEmail,
          leaderName: `${apiTeam.leader.detail.firstname} ${apiTeam.leader.detail.lastname}`, // Add this
          members: apiTeam.members
            .filter((member) => member.participant.id !== apiTeam.leaderId)
            .map((member) => ({
              name: `${member.participant.detail.firstname} ${member.participant.detail.lastname}`,
              email: member.participant.universityEmail,
              status: "accepted" as const,
            })),
        });
      } catch (error) {
        console.error("Error fetching team data:", error);
        toast.error("Failed to load team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [eventID, authData?.token, currentEvent?.maxTeamSize]);

  const handleTeamNameChange = async () => {
    if (!newTeamName.trim() || !currentTeam) return;

    setIsUpdatingName(true);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/events/participants/team/updateName/${currentTeam.id}`,
        { teamName: newTeamName },
        { headers: { Authorization: `Bearer ${authData?.token}` } }
      );
      setCurrentTeam({ ...currentTeam, name: newTeamName });
      setIsRenaming(false);
      toast.success("Team name updated successfully");
    } catch {
      toast.error("Failed to update team name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-lg">Failed to load team</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-zinc-900 to-black p-8"
    >
      <Card className="max-w-4xl mx-auto bg-black/50 backdrop-blur-sm border border-zinc-800/50">
        <CardHeader className="p-6 border-b border-zinc-800/50">
          {/* Back to Event Button */}
          <div className="mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/event-details/${eventID}`)}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Event</span>
            </motion.button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                {currentTeam.name}
              </h2>
              <p className="text-zinc-400 mt-2 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                {currentTeam.members.length + 1}/{currentTeam.maxMembers}{" "}
                Members
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsRenaming(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white rounded-lg border border-purple-500/20"
              >
                <Pencil className="w-4 h-4" />
                Rename Team
              </motion.button>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/50 text-white rounded-lg border border-zinc-700/50">
                <span className="font-mono">{currentTeam.code}</span>
                <button
                  onClick={() => copyToClipboard(currentTeam.code)}
                  className="p-1 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Copy className="w-4 h-4 text-zinc-400 hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-medium">
                    {currentTeam.leaderName}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {currentTeam.leader}
                    <span className="ml-2">• Team Leader</span>
                  </div>
                </div>
              </div>
            </div>

            {currentTeam.members.map((member) => (
              <motion.div
                key={member.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-zinc-800/30 rounded-xl flex items-center border border-zinc-700/50"
              >
                <div className="p-2 rounded-full bg-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="ml-4">
                  <div className="text-white font-medium">{member.name}</div>
                  <div className="text-sm text-zinc-400">{member.email}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isRenaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md bg-black/90 backdrop-blur-sm">
              <CardHeader className="text-xl font-semibold">
                Rename Team
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter new team name"
                    className="w-full p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 focus:border-purple-500"
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setIsRenaming(false)}
                      className="px-4 py-2 text-zinc-400 hover:text-white"
                      disabled={isUpdatingName}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleTeamNameChange}
                      disabled={isUpdatingName || !newTeamName.trim()}
                      className="px-4 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg disabled:opacity-50"
                    >
                      {isUpdatingName ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CurrentTeam;
