import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useAuthStore } from "./zustand/UseAuthStore";
import { User } from "./types/types";
import axios from "axios";
import toast from "react-hot-toast";

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Result: ", result);
    const user: User = {
      accessToken: await result.user.getIdToken(),
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    };

    console.log("User signed in: ", user);
    if (!user.email?.endsWith("@kiit.ac.in")) {
      toast.error("Please use a KIIT email address.");
      await signOutUser(); 
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
      return;
    }

    useAuthStore.getState().setAuthData({
      token: user.accessToken,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
    useAuthStore.getState().setLoggedIn(true);
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/auth/verify`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );

    console.log("Data fetched: ", response.data);
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
    useAuthStore.getState().setAuthData({
      token: null,
      displayName: null,
      email: null,
      photoURL: null,
    });
    useAuthStore.getState().setLoggedIn(false);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
