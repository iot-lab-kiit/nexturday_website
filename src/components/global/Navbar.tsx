import React, { useState } from "react";
import { signInWithGoogle, signOutUser } from "../../firebaseConfig";
import { useAuthStore } from "../../zustand/useAuthStore";

export const Navbar: React.FC = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const authData = useAuthStore((state) => state.authData);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 z-50 h-16">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
        <button className="lg:hidden hover:bg-zinc-800/50 p-2.5 rounded-xl transition-all duration-300">
          <svg
            className="w-5 h-5"
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

        <a href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Nexturday
          </h1>
        </a>

        <div className="flex gap-5 items-center">
          {loggedIn ? (
            <>
              {authData.photoURL ? (
                <img
                  src={authData.photoURL.toString()}
                  onClick={() => setShowDropdown(!showDropdown)}
                  alt="Profile"
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-300"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-zinc-800/50 animate-pulse" />
              )}
              <button
                onClick={signOutUser}
                className="px-4 py-2 hover:bg-zinc-800/50 rounded-xl transition-all duration-300 text-sm font-medium text-zinc-300 hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                signInWithGoogle();
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 rounded-xl transition-all duration-300 text-sm font-medium text-zinc-300 hover:text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
