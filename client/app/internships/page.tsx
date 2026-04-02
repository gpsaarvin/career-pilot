"use client";

import { useEffect, useMemo, useState } from "react";
import InternshipCard from "@/components/InternshipCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Internship } from "@/types";

export default function InternshipsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Internship[]>([]);
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (filters?: { query?: string; company?: string; location?: string }) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      const nextQuery = filters?.query ?? query;
      const nextCompany = filters?.company ?? company;
      const nextLocation = filters?.location ?? location;

      if (nextQuery) params.set("query", nextQuery);
      if (nextCompany) params.set("company", nextCompany);
      if (nextLocation) params.set("location", nextLocation);
      params.set("limit", "200");
      const response = await api.internships.list(params);
      setItems(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load internships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", "200");
        const response = await api.internships.list(params);
        setItems(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load internships");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const onSaveOrApply = async (internship: Internship, status: "saved" | "applied") => {
    if (!token) {
      alert("Please login first.");
      return;
    }

    await api.applications.create(token, {
      internshipId: internship.id,
      internshipTitle: internship.title,
      company: internship.company,
      applyLink: internship.applyLink,
      status,
    });

    alert(status === "saved" ? "Saved to dashboard" : "Marked as applied");
  };

  const headline = useMemo(() => {
    if (company) {
      return `Matching internships for ${company}`;
    }
    if (query) {
      return `Results for \"${query}\"`;
    }
    return "Live internship feed";
  }, [query, company]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <div className="panel">
        <p className="eyebrow">Internship Explorer</p>
        <h1 className="hero-title">{headline}</h1>
        <p className="hero-subtitle">Search by skill, company, or location and save the best matches.</p>
        <p className="mt-2 text-sm text-slate-600">
          Showing {items.length} internships. Click any internship card to open the direct apply page.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <input
            className="input"
            value={query}
            placeholder="Role or skill"
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className="input"
            value={company}
            placeholder="Company"
            onChange={(e) => setCompany(e.target.value)}
          />
          <input
            className="input"
            value={location}
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="btn btn-primary" type="button" onClick={() => void load()}>
            Search
          </button>
        </div>
      </div>

      {loading ? <p className="mt-6">Loading internships...</p> : null}
      {error ? <p className="mt-6 text-red-700">{error}</p> : null}
      {!loading && !error && !items.length ? (
        <p className="mt-6 text-slate-700">
          No real internships found right now. Try broader search terms or check provider API keys.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <InternshipCard
            key={item.id}
            internship={item}
            onSave={(internship) => onSaveOrApply(internship, "saved")}
            onApply={(internship) => onSaveOrApply(internship, "applied")}
          />
        ))}
      </div>
    </section>
  );
}
