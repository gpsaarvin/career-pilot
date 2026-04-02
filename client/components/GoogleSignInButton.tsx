"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseAuth, googleProvider, hasFirebaseConfig } from "@/lib/firebase";

type Props = {
  onSuccess: (payload: { credential: string; profile: Record<string, unknown> }) => Promise<void>;
};

export default function GoogleSignInButton({ onSuccess }: Props) {
  const handleSignIn = async () => {
    if (!hasFirebaseConfig()) {
      alert("Missing Firebase config in NEXT_PUBLIC_FIREBASE_* env vars.");
      return;
    }

    const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result)?.idToken;

    if (!credential) {
      throw new Error("Unable to read Google credential");
    }

    await onSuccess({
      credential,
      profile: {
        name: result.user.displayName,
        email: result.user.email,
        picture: result.user.photoURL,
      },
    });
  };

  return (
    <button className="btn btn-primary" onClick={handleSignIn} type="button">
      Continue with Google
    </button>
  );
}
