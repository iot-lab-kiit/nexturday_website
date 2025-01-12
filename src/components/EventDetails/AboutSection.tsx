import { Card, CardContent, CardHeader } from "./CardComponents";

export const AboutSection: React.FC = () => (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 mb-8">
        <CardHeader>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                About the event
            </h2>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
                After two game-changing events, Innovance is back—bigger, bolder, and more groundbreaking! Our previous Innovance events set the bar high, with none other than Striver (Raj Vikramaditya) headlining Innovance 2.0.
            </p>
            <p className="text-gray-300 leading-relaxed">
                Innovance 3.0 is here to raise it even higher, bringing top-notch insights, hands-on projects, and career-shaping strategies—courtesy of IoT Lab, KIIT Network with like-minded peers, learn from industry experts, gain hands-on experience, and boost your career prospects!
            </p>
        </CardContent>
    </Card>
);
