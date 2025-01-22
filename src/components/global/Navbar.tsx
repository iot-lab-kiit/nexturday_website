import React, { useState, useRef, useEffect } from "react";
import { signInWithGoogle, signOutUser } from "../../firebaseConfig";
import { useAuthStore } from "../../zustand/UseAuthStore";
import { useEventStore } from "../../zustand/useEventStore";

export const Navbar: React.FC = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const authData = useAuthStore((state) => state.authData);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentEvent = useEventStore((state) => state.currentEvent);
  const [favourite, setIsFavourite] = useState<boolean>(false);

  useEffect(() => {
    async function fetchEventfavourite() {
      try {
        const response = await fetch(
          `https://nexterday.iotkiit.in/api/events/${currentEvent?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setIsFavourite(data.data.isFavorite);
      } catch (error) {
        console.error("Error fetching event favorite status:", error);
      }
    }

    if (currentEvent?.id && authData.token) {
      fetchEventfavourite();
    }
  }, [currentEvent, authData.token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFavoriteClick = async () => {
    setIsFavourite((state) => {
      if (state) {
        try {
          fetch(
            `https://nexterday.iotkiit.in/api/events/participants/favorite/${currentEvent?.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authData.token}`,
              },
            }
          ).then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            response.json().then((response) => {
              console.log("Unfavorite event response:", response);
            });
          });
        } catch (error) {
          console.error("Error unfavoriting event:", error);
        }
        return !state;
      }
      try {
        fetch(
          `https://nexterday.iotkiit.in/api/events/participants/favorite/${currentEvent?.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData.token}`,
            },
          }
        ).then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          response.json().then((response) => {
            console.log("Favorite event response:", response);
          });
        });
      } catch (error) {
        console.error("Error favoriting event:", error);
      }
      return !state;
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 z-50 h-16 mb-6">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        <a href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl text-white font-bold text-transparent">
            Nexterday
          </h1>
        </a>

        <div className="relative flex gap-2" ref={dropdownRef}>
          <button
            className={`p-2 rounded-full hover:bg-zinc-800/50 transition-all duration-300 
              ${window.location.href.includes("event-details") ? "" : "hidden"}`}
            onClick={handleFavoriteClick}
          >
            <svg
              className={`w-6 h-6 transition-all duration-200 ${favourite ? "fill-red-500 stroke-red-500" : "stroke-zinc-300"}`}
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          {loggedIn ? (
            <>
              <div
                className="w-9 h-9 rounded-full cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {authData.photoURL ? (
                  <>
                    <img
                      src={authData.photoURL.toString()}
                      onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const placeholder = e.currentTarget.parentElement?.querySelector(".placeholder");
                        if (placeholder) placeholder.classList.remove("hidden");
                      }}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-300 opacity-0"
                    />
                    <div className="placeholder hidden w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-purple-700 to-purple-900 animate-pulse"></div>
                  </>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-purple-700 to-purple-900 animate-pulse"></div>
                )}
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg">
                  <div className="py-1">
                    <button
                      onClick={() => (window.location.href = "/profile")}
                      className="w-full rounded-2xl px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                    >
                      Profile
                    </button>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={signOutUser}
                      className="w-full rounded-2xl px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            window.location.pathname !== "/login" && (
              <button
                onClick={() => {
                  signInWithGoogle();
                  window.location.href = "/login";
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 rounded-xl transition-all duration-300 text-sm font-medium text-zinc-300 hover:text-white"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
