import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every(Boolean);
}

function getFirebaseApp() {
  if (!hasFirebaseConfig()) {
    return null;
  }

  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Missing Firebase config in NEXT_PUBLIC_FIREBASE_* env vars.");
  }

  return getAuth(app);
}

export const googleProvider = new GoogleAuthProvider();
