import React from "react";
import { signInWithGoogle,signOutUser } from "./../firebaseConfig";
import { useAuthStore } from "./../zustand/UseAuthStore";


export const Navbar: React.FC = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const authData = useAuthStore((state) => state.authData);
  const [showDropdown, setShowDropdown] = React.useState(false);

  

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-zinc-800/50 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button className="lg:hidden hover:bg-zinc-800 p-2 rounded-lg transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <a href="/">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Nexturday
        </h1>
        </a>
        
        <div className="flex gap-4 items-center">
        
          {loggedIn ? (
            <div className="relative">
              <img
              src={authData.photoURL?.toString()}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
              <div className="absolute bg-black right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                onClick={signOutUser}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                Sign Out
                </button>
              </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
              signInWithGoogle();
              window.location.href = "/login";
              }}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
