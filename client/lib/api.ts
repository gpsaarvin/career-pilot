import type { Application, Internship, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type HttpOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  formData?: FormData;
};

async function request<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const headers: HeadersInit = {};

  if (!options.formData) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.formData || (options.body ? JSON.stringify(options.body) : undefined),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(payload.message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  auth: {
    google: (payload: { credential: string; profile: Record<string, unknown> }) =>
      request<{ token: string; user: User }>("/auth/google", {
        method: "POST",
        body: payload,
      }),
    me: (token: string) => request<User>("/auth/me", { token }),
  },
  internships: {
    list: (params: URLSearchParams) =>
      request<{ items: Internship[]; count: number }>(`/internships?${params.toString()}`),
    one: (id: string) => request<Internship>(`/internships/${id}`),
    filters: () =>
      request<{ locations: string[]; companies: string[]; types: string[] }>("/internships/filters"),
    companySearch: (company: string) =>
      request<{ items: Internship[]; count: number }>(
        `/internships/company-search?company=${encodeURIComponent(company)}`
      ),
  },
  applications: {
    create: (token: string, body: Partial<Application>) =>
      request<Application>("/apply", { method: "POST", token, body }),
    list: (token: string) => request<{ items: Application[]; count: number }>("/applications", { token }),
    patch: (token: string, id: string, body: Partial<Application>) =>
      request<Application>(`/applications/${id}`, { method: "PATCH", token, body }),
    remove: (token: string, id: string) =>
      request<void>(`/applications/${id}`, { method: "DELETE", token }),
    saveSearch: (token: string, query: string) =>
      request<{ query: string }>("/applications/search", {
        method: "POST",
        token,
        body: { query },
      }),
    searchHistory: (token: string) =>
      request<{ items: { id: string; query: string; createdAt: string }[] }>(
        "/applications/search-history",
        { token }
      ),
  },
  resume: {
    upload: (token: string, formData: FormData) =>
      request<{
        fileName: string;
        textPreview: string;
        atsScore: number;
        summary: string;
        strengths: string[];
        missingKeywords: string[];
        skills: string[];
        suggestions: Array<{ category: string; priority: string; title: string; suggestion: string }>;
      }>("/resume/upload", {
        method: "POST",
        token,
        formData,
      }),
    recommendations: (token: string, skills: string[]) =>
      request<{ items: Internship[] }>(
        `/recommendations?skills=${encodeURIComponent(skills.join(","))}`,
        { token }
      ),
  },
  ai: {
    resumeSuggestions: (
      token: string,
      body: { company: string; role: string; description: string }
    ) =>
      request<{
        summary: string;
        requiredSkills: string[];
        atsKeywords: string[];
        suggestedProjects: string[];
      }>("/ai/resume-suggestions", {
        method: "POST",
        token,
        body,
      }),
  },
};
