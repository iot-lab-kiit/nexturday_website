import React, { useState, useRef, useEffect } from "react";
import { signInWithGoogle, signOutUser } from "../../firebaseConfig";
import { useAuthStore } from "../../zustand/useAuthStore";

export const Navbar: React.FC = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const authData = useAuthStore((state) => state.authData);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        <a href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Nexturday
          </h1>
        </a>

        <div className="relative" ref={dropdownRef}>
          {loggedIn ? (
            <>
              {authData.photoURL ? (
                <img
                  src={authData.photoURL.toString()}
                  onClick={() => setShowDropdown(!showDropdown)}
                  alt="Profile"
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-300 cursor-pointer"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-zinc-800/50 animate-pulse" />
              )}

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg">
                  <div className="py-1">
                    <button
                      onClick={signOutUser}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => window.location.href = "/profile"}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              )}
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
