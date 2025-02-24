import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../EventDetails/CardComponents";
import { CheckCircle2, Users, X, UserPlus2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";

export const JoinTeamForm = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [inviteCode, setInviteCode] = useState<string>("");

  const { eventID } = useParams();
  const navigate = useNavigate();

  const handleJoinTeam = () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    toast.success("Team joined successfully!");
    navigate(`/event-details/${eventID}/teams/${inviteCode}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-black/90 backdrop-blur-sm">
              <CardHeader className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50"
                >
                  <X className="w-5 h-5" />
                </motion.button>
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20 blur-lg" />
                    <UserPlus2 className="w-16 h-16 text-purple-400" />
                  </motion.div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                    Join Existing Team
                  </h2>
                  <p className="text-zinc-400 text-center max-w-md">
                    Enter the team invite code to join your teammates
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm text-zinc-400 block">
                      Team Invite Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter team invite code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="w-full p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 text-white focus:border-purple-500 transition-all duration-300 uppercase"
                    />
                    <div className="flex gap-4 items-center text-zinc-500 text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        You'll join as a team member
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <h3 className="text-purple-400 font-semibold mb-2">
                        Team Benefits
                      </h3>
                      <ul className="text-zinc-400 space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                          Connect with your teammates
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                          Access team resources
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                          Participate in team activities
                        </li>
                      </ul>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoinTeam}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                  >
                    Join Team
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
