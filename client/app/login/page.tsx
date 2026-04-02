"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6">
      <div className="panel">
        <p className="eyebrow">Google OAuth only</p>
        <h1 className="hero-title">Sign in to unlock your internship command center</h1>
        <p className="hero-subtitle">
          Continue with Google to access saved internships, applied tracking, AI resume insights,
          and company-specific strategy recommendations.
        </p>
      </div>

      <div className="panel">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-600">No passwords, no email signup, only secure Google login.</p>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-6">
          <GoogleSignInButton
            onSuccess={async (payload) => {
              try {
                setError("");
                await loginWithGoogle(payload);
                router.push("/dashboard");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Login failed");
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}
