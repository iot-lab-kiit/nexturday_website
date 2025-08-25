import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Copy,
  Link,
  Shield,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useAuthStore } from "../../zustand/UseAuthStore.tsx";
import { Card, CardContent, CardHeader } from "../EventDetails/CardComponents";
import { useState } from "react";
import { Team } from "../../types/types";
import toast from "react-hot-toast";
import { useEventStore } from "../../zustand/useEventStore";

const CurrentTeam = () => {
  const teamName = useEventStore((state) => state.teamName);

  const [currentTeam, setCurrentTeam] = useState<Team | null>(() => ({
    id: crypto.randomUUID(),
    name: teamName || "Team Name",
    members: [
      {
        name: useAuthStore.getState().authData.displayName || "",
        email: useAuthStore.getState().authData.email || "example@kiit.ac.in",
        status: "leader",
      },
    ],
    maxMembers: 4,
    leader: useAuthStore.getState().authData.email || "example@kiit.ac.in",
    leaderName: useAuthStore.getState().authData.displayName || "",
    code: `TEAM${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  }));

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInviteMember = () => {
    if (!validateKIITEmail(newMemberEmail)) {
      toast.error("Please enter a valid KIIT email address");
      return;
    }

    if (currentTeam && currentTeam.members.length >= currentTeam.maxMembers) {
      toast.error(
        `Team size limit reached (${currentTeam.maxMembers} members)`
      );
      return;
    }

    if (currentTeam && newMemberEmail) {
      if (
        currentTeam.members.some((member) => member.email === newMemberEmail)
      ) {
        toast.error("Member already exists in the team");
        return;
      }

      setCurrentTeam({
        ...currentTeam,
        members: [
          ...currentTeam.members,
          {
            name: "",
            email: newMemberEmail,
            status: "pending",
          },
        ],
      });
      setNewMemberEmail("");
      toast.success("Invitation sent successfully!");
    }
  };

  const validateKIITEmail = (email: string) => {
    return email.toLowerCase().endsWith("@kiit.ac.in");
  };

  const handleRemoveMember = (email: string) => {
    if (currentTeam && email !== currentTeam.leader) {
      setCurrentTeam({
        ...currentTeam,
        members: currentTeam.members.filter((member) => member.email !== email),
      });
      toast.success("Member removed successfully");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInviteMember();
    }
  };

  const isTeamFull = currentTeam?.members.length === currentTeam?.maxMembers;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-zinc-900 to-black p-8"
    >
      <Card className="max-w-4xl mx-auto bg-black/50 backdrop-blur-sm border border-zinc-800/50">
        <CardHeader className="p-6 border-b border-zinc-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                {currentTeam?.name}
              </h2>
              <p className="text-zinc-400 mt-2 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Team Members: {currentTeam?.members.length}/
                {currentTeam?.maxMembers}
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const eventId = window.location.pathname.split("/")[2];
                  copyToClipboard(
                    `${window.location.origin}/event-details/${eventId}/teams/team-invite/${currentTeam?.code}`
                  );
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white rounded-lg hover:from-purple-500/30 hover:to-blue-500/30 transition-all border border-purple-500/20"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Link className="w-4 h-4" />
                )}
                Share Invite Link
              </motion.button>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/50 text-white rounded-lg hover:bg-zinc-800/70 transition-all border border-zinc-700/50">
                <span className="font-mono">{currentTeam?.code}</span>
                <button
                  onClick={() => copyToClipboard(currentTeam?.code || "")}
                  className="p-1 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Copy className="w-4 h-4 text-zinc-400 hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder={
                  isTeamFull ? "Team is full" : "Enter member's KIIT email"
                }
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTeamFull}
                className={`flex-1 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${
                  isTeamFull ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              <motion.button
                whileHover={!isTeamFull ? { scale: 1.02 } : {}}
                whileTap={!isTeamFull ? { scale: 0.98 } : {}}
                onClick={handleInviteMember}
                disabled={isTeamFull}
                className={`p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg shadow-purple-500/20 ${
                  isTeamFull ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <UserPlus className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {currentTeam?.members.map((member) => (
                  <motion.div
                    key={member.email}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 bg-zinc-800/30 rounded-xl flex items-center justify-between group hover:bg-zinc-800/50 transition-all border border-zinc-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          member.status === "leader"
                            ? "bg-purple-500/20"
                            : member.status === "accepted"
                            ? "bg-green-500/20"
                            : "bg-yellow-500/20"
                        }`}
                      >
                        {member.status === "leader" ? (
                          <Shield className="w-5 h-5 text-purple-400" />
                        ) : member.status === "accepted" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {member.name}
                        </span>
                        <span className="text-sm text-zinc-400">
                          {member.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 whitespace-nowrap ${member.status === 'leader' ? 'bg-purple-500/20 text-purple-400' :
                                                member.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                            </span> */}

                      {currentTeam.leader ===
                        useAuthStore.getState().authData.email &&
                        member.email !== currentTeam.leader && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveMember(member.email)}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CurrentTeam;
