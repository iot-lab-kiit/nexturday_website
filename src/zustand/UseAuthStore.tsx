import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthData } from "../types/types";

interface AuthStoreInterface {
  authData: AuthData;
  setAuthData: (data: AuthData) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const useAuthStore = create<AuthStoreInterface>()(
  persist(
    (set) => ({
      authData: {
        token: null,
        displayName: null,
        email: null,
        photoURL: null
      },
      setAuthData: (data) => set({ authData: data }),
      loggedIn: false,
      setLoggedIn: (loggedIn) => set({ loggedIn }),
    }),
    {
      name: "auth-storage",
      storage: typeof window !== "undefined"
        ? {
            getItem: (name) => {
              const str = localStorage.getItem(name);
              return str ? JSON.parse(str) : null;
            },
            setItem: (name, value) => {
              localStorage.setItem(name, JSON.stringify(value));
            },
            removeItem: (name) => localStorage.removeItem(name),
          }
        : undefined,
    }
  )
);