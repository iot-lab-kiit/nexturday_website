import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorDisplayProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    message = "Something went wrong! Please try again later.",
    onRetry
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="bg-gradient-to-b from-red-950/30 to-black/50 border border-red-500/50 rounded-2xl p-12 flex flex-col items-center max-w-md backdrop-blur-sm shadow-2xl shadow-red-500/10">
                <AlertCircle className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
                <h3 className="text-red-500 text-2xl font-bold mb-4">Oops!</h3>
                <p className="text-red-400/90 text-center mb-8">{message}</p>

                <div className="flex gap-4">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 transition-all duration-300 hover:scale-105"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all duration-300 hover:scale-105"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
