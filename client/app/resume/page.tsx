"use client";

import { FormEvent, useMemo, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function ResumePage() {
  const { token } = useAuth();
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [file, setFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<
    Array<{ category: string; priority: string; title: string; suggestion: string }>
  >([]);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => Boolean(file && token), [file, token]);
  const filteredSuggestions = useMemo(() => {
    const order = { high: 0, medium: 1, low: 2 } as const;
    return suggestions
      .filter((item) => priorityFilter === "all" || item.priority === priorityFilter)
      .sort((a, b) => order[a.priority as keyof typeof order] - order[b.priority as keyof typeof order]);
  }, [priorityFilter, suggestions]);

  const priorityClass: Record<string, string> = {
    high: "bg-[#fee2e2] text-[#9f1239]",
    medium: "bg-[#ffedd5] text-[#9a3412]",
    low: "bg-[#dcfce7] text-[#166534]",
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file || !token) {
      return;
    }

    try {
      setError("");
      const formData = new FormData();
      formData.append("resume", file);
      const result = await api.resume.upload(token, formData);
      setPriorityFilter("all");
      setAtsScore(typeof result.atsScore === "number" ? result.atsScore : null);
      setSummary(result.summary || "");
      setStrengths(result.strengths || []);
      setMissingKeywords(result.missingKeywords || []);
      setSkills(result.skills || []);
      setSuggestions(result.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <RequireAuth>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="panel">
          <p className="eyebrow">Resume Lab</p>
          <h1 className="hero-title">Upload your resume and get targeted improvement suggestions</h1>
          <p className="hero-subtitle">
            CareerPilot extracts skills, highlights ATS opportunities, and suggests practical changes.
          </p>

          <form className="mt-6 flex flex-col gap-3 md:flex-row" onSubmit={onSubmit}>
            <label
              htmlFor="resume-upload"
              className="w-full cursor-pointer rounded-2xl border border-[#e6cdb0] bg-white p-4 transition hover:border-[#cb5f38] hover:bg-[#fffaf2]"
            >
              <input
                id="resume-upload"
                className="sr-only"
                type="file"
                accept="application/pdf"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Click here to choose your resume (PDF)</p>
                  <p className="text-xs text-slate-600">Max size 5MB. ATS score and suggestions will be generated after upload.</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-[#efd6b5] bg-[#fff6e9] px-3 py-1 text-xs font-semibold text-[#8a3f22]">
                  {file ? "Change file" : "Choose file"}
                </span>
              </div>
              <p className="mt-3 truncate text-sm text-slate-700">
                {file ? `Selected: ${file.name}` : "No file selected yet"}
              </p>
            </label>
            <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
              Analyze resume
            </button>
          </form>

          {error ? <p className="mt-3 text-red-700">{error}</p> : null}
        </div>

        <div className="mt-8 panel">
          <h2 className="text-xl font-semibold">ATS Match Score</h2>
          {atsScore !== null ? (
            <>
              <p className="mt-2 text-4xl font-bold text-[#8a3f22]">{atsScore}%</p>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#f3e3ce]">
                <div
                  className="h-full rounded-full bg-[#bb5c37] transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, atsScore))}%` }}
                />
              </div>
              {summary ? <p className="mt-3 text-sm text-slate-700">{summary}</p> : null}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Strengths</p>
                  {strengths.length ? (
                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                      {strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">No strengths generated yet.</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Missing Keywords</p>
                  {missingKeywords.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {missingKeywords.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#efd6b5] bg-white px-3 py-1 text-xs text-[#8a3f22]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">No missing keywords generated yet.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-600">Upload a resume to calculate ATS percentage.</p>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <h2 className="text-xl font-semibold">Detected Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.length ? (
                skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-[#ffe8cd] px-3 py-1 text-sm text-[#8a3f22]">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-600">Upload a resume to see extracted skills.</p>
              )}
            </div>
          </div>

          <div className="panel">
            <h2 className="text-xl font-semibold">Improvement Suggestions</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["all", "high", "medium", "low"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPriorityFilter(value)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                    priorityFilter === value
                      ? "border-[#bb5c37] bg-[#bb5c37] text-white"
                      : "border-[#efd6b5] bg-white text-[#8a3f22]"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-3">
              {filteredSuggestions.length ? (
                filteredSuggestions.map((item, index) => (
                  <article key={`${item.title}-${index}`} className="rounded-2xl border border-[#efd6b5] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#bb5c37]">{item.category}</p>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                          priorityClass[item.priority] || "bg-[#ffedd5] text-[#9a3412]"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-700">{item.suggestion}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  {suggestions.length
                    ? "No suggestions for the selected priority."
                    : "Suggestions will appear after analysis."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </RequireAuth>
  );
}
