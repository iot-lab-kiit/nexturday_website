import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../EventDetails/CardComponents";
import { CheckCircle2, Shield, UserPlus, Users, X } from "lucide-react";

export const CreateTeamModal = ({ isOpen, onClose, onSubmit }: {
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: () => void
}) => {
    const [teamName, setTeamName] = useState('');

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
                                        <UserPlus className="w-16 h-16 text-purple-400" />
                                    </motion.div>
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                                        Create Your Dream Team
                                    </h2>
                                    <p className="text-zinc-400 text-center max-w-md">
                                        Start your journey by giving your team a unique identity
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-sm text-zinc-400 block">Team Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter an awesome team name"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="w-full p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 text-white focus:border-purple-500 transition-all duration-300"
                                        />
                                        <div className="flex gap-4 items-center text-zinc-500 text-sm">
                                            <span className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Max 4 members
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                You'll be team leader
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                            <h3 className="text-purple-400 font-semibold mb-2">Team Benefits</h3>
                                            <ul className="text-zinc-400 space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                                    Collaborate with talented peers
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                                    Share resources and knowledge
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                                    Enhanced problem-solving capabilities
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onSubmit}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                                    >
                                        Launch Team
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