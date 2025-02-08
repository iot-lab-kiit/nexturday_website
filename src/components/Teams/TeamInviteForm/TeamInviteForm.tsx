import { Card, CardHeader, CardContent } from '../../EventDetails/CardComponents';
import { Users, Shield, CheckCircle2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const teamData = {
    name: "Tech Titans",
    eventName: "Hackathon 2024",
    code: "TT123",
    members: [
        { email: "leader@kiit.ac.in", name: "John Doe", status: 'leader' },
        { email: "member1@kiit.ac.in", name: "Jane Smith", status: 'accepted' },
        { email: "member2@kiit.ac.in", name: "Mike Johnson", status: 'accepted' }
    ],
    maxMembers: 4
};

export const TeamInviteForm = () => {
    const navigate = useNavigate();

    const handleAcceptInvite = () => {
        toast.success("Team invitation accepted successfully!");
        navigate(`/event-details/${window.location.pathname.split('/')[2]}/teams`);
    };


    const handleDeclineInvite = () => {
        toast.success("Team invitation declined");
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                <Card className="bg-black/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Users className="w-12 h-12 text-purple-500" />
                            </motion.div>
                        </div>
                        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-2">
                            Team Invitation
                        </h2>
                        <p className="text-center text-zinc-400">
                            You've been invited to join team <span className="text-xl font-bold text-center text-white mt-2">{teamData.name}</span>
                        </p>
                        <p className="text-center text-purple-400 mt-1">
                            for {teamData.eventName}
                        </p>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-6">
                            <div className="bg-zinc-800/30 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-zinc-400 mb-3">Current Team Members</h4>
                                <div className="space-y-3">
                                    {teamData.members.map((member, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {member.status === 'leader' && (
                                                    <Shield className="w-4 h-4 text-purple-400" />
                                                )}
                                                <div>
                                                    <p className="text-white">{member.name}</p>
                                                    <p className="text-sm text-zinc-400">{member.email}</p>
                                                </div>
                                            </div>
                                            {member.status === 'leader' && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                                                    Team Leader
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-zinc-400 mt-3">
                                    {teamData.members.length}/{teamData.maxMembers} members
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAcceptInvite}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Accept Invitation
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDeclineInvite}
                                    className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-semibold shadow-lg flex items-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Decline
                                </motion.button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default TeamInviteForm;