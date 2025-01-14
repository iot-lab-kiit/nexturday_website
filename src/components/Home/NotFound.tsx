import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center px-4">
                <div className="flex justify-center mb-8">
                    <div className="p-4 rounded-full bg-purple-500/10">
                        <AlertCircle className="w-16 h-16 text-purple-400" />
                    </div>
                </div>

                <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
                    404
                </h1>

                <h2 className="text-2xl font-semibold text-white mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved to another URL.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
