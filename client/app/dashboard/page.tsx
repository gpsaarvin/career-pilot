"use client";

import { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Application } from "@/types";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Application[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    api.applications
      .list(token)
      .then((response) => setItems(response.items))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load dashboard"));
  }, [token]);

  const saved = useMemo(() => items.filter((item) => item.status === "saved"), [items]);
  const applied = useMemo(() => items.filter((item) => item.status === "applied"), [items]);

  const setStatus = async (id: string, status: "saved" | "applied") => {
    if (!token) {
      return;
    }

    const updated = await api.applications.patch(token, id, { status });
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  return (
    <RequireAuth>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="panel">
          <p className="eyebrow">Dashboard</p>
          <h1 className="hero-title">Hi {user?.name?.split(" ")[0] || "there"}, track your progress</h1>
          <p className="hero-subtitle">
            Saved internships help you shortlist opportunities. Applied internships keep your active
            pipeline visible.
          </p>
        </div>

        {error ? <p className="mt-4 text-red-700">{error}</p> : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <h2 className="text-xl font-semibold">Saved Internships ({saved.length})</h2>
            <div className="mt-4 space-y-3">
              {saved.length ? (
                saved.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-[#efd6b5] bg-white p-4">
                    <p className="text-sm text-slate-500">{item.company}</p>
                    <h3 className="text-lg font-semibold text-slate-900">{item.internshipTitle}</h3>
                    <div className="mt-3 flex gap-2">
                      <button className="btn btn-primary" onClick={() => setStatus(item.id, "applied")}>Mark applied</button>
                      <a className="btn btn-secondary" href={item.applyLink} target="_blank" rel="noreferrer">Open link</a>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-600">No saved internships yet.</p>
              )}
            </div>
          </div>

          <div className="panel">
            <h2 className="text-xl font-semibold">Applied Internships ({applied.length})</h2>
            <div className="mt-4 space-y-3">
              {applied.length ? (
                applied.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-[#efd6b5] bg-white p-4">
                    <p className="text-sm text-slate-500">{item.company}</p>
                    <h3 className="text-lg font-semibold text-slate-900">{item.internshipTitle}</h3>
                    <div className="mt-3 flex gap-2">
                      <button className="btn btn-ghost" onClick={() => setStatus(item.id, "saved")}>Move to saved</button>
                      <a className="btn btn-secondary" href={item.applyLink} target="_blank" rel="noreferrer">Open link</a>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-600">No applied internships yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </RequireAuth>
  );
}
