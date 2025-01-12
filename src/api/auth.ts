import { auth, provider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const signup = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Error signing up:", error.message);
    } else {
      console.error("Unknown error during signup:", error);
    }
  }
};

export const signin = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in:", userCredential.user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Error signing in:", error.message);
    } else {
      console.error("Unknown error during signin:", error);
    }
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User Info:", user);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    console.log("Access Token:", token);

    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    const firebaseError = error as FirebaseError;
    console.error("Google Sign-In Error:", firebaseError.message);
    console.error("Error Code:", firebaseError.code);
    console.error("Error Email:", firebaseError.customData?.email);
    return null;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
