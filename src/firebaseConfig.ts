import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthStore } from "./zustand/useAuthStore";
import { User } from "./types/types";
import axios from "axios";
const firebaseConfig = {
  apiKey: "AIzaSyAPAj0HjnHJFg11lTyCllqaakd8ha5xRj8",
  authDomain: "nexterdayevents-2d99e.firebaseapp.com",
  projectId: "nexterdayevents-2d99e",
  storageBucket: "nexterdayevents-2d99e.firebasestorage.app",
  messagingSenderId: "114832360976",
  appId: "1:114832360976:web:6b767dfb5740cdd1baac95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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
      photoURL: result.user.photoURL
    };
    console.log("User signed in: ", user);
    useAuthStore.getState().setAuthData({
      token: user.accessToken,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });
    useAuthStore.getState().setLoggedIn(true);
    const response = await axios.get("https://nexterday.iotkiit.in/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });
      console.log('Data fetched: ', response.data); 
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
        photoURL: null
      });
    useAuthStore.getState().setLoggedIn(false);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
