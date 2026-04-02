<p align="center">
	<img src="https://capsule-render.vercel.app/api?type=waving&height=220&text=CareerPilot&fontAlign=50&fontAlignY=38&color=0:ff9a44,50:ff6a88,100:ff99ac&fontColor=1a1a1a" alt="CareerPilot banner" />
</p>

<p align="center">
	<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&size=24&duration=2200&pause=900&center=true&vCenter=true&width=900&lines=Full-stack+Internship+Discovery+Platform;Google+OAuth+Login+%2B+Application+Tracking;Resume+ATS+Analysis+with+OpenRouter+AI" alt="Typing animation" />
</p>

<p align="center">
	<a href="https://github.com/gpsaarvin/career-pilot">
		<img src="https://img.shields.io/badge/Repo-CareerPilot-111827?style=for-the-badge&logo=github" alt="Repo" />
	</a>
	<img src="https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js" alt="Next.js" />
	<img src="https://img.shields.io/badge/Backend-Express-1f2937?style=for-the-badge&logo=express" alt="Express" />
	<img src="https://img.shields.io/badge/Auth-Google%20OAuth-4285F4?style=for-the-badge&logo=google" alt="Google OAuth" />
	<img src="https://img.shields.io/badge/AI-OpenRouter-7c3aed?style=for-the-badge" alt="OpenRouter" />
</p>

---

## Overview

CareerPilot is a full-stack internship platform built for students and early professionals.

It helps users:
- discover internship opportunities,
- open direct company apply pages,
- track saved and applied roles,
- upload resumes and get ATS-focused AI feedback.

---

## Feature Highlights

### Internship Explorer
- 50+ internship entries in feed (real provider first, resilient fallback when provider quota is exhausted).
- Company logo rendering with graceful fallback avatar.
- Clickable company/link behavior that opens direct apply pages.

### Authentication
- Google OAuth login flow (Firebase client + backend token validation strategy).
- Persistent session with hydration-safe UI state handling.

### Dashboard
- Save internships.
- Mark internships as applied.
- Track application state in one place.

### Resume Lab
- PDF resume upload.
- ATS score percentage.
- Actionable suggestions grouped by priority.
- Strengths and missing keyword insights.

---

## Animated Visual Identity

This README intentionally includes animated hero elements for better GitHub presentation:
- wave banner animation,
- typing headline animation,
- live-looking stack badges.

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Firebase (Google Sign-In client)

### Backend
- Node.js + Express
- OpenAI SDK (used for OpenRouter-compatible calls)
- Multer + pdf-parse
- JWT + google-auth-library

### AI
- OpenRouter models for:
	- ATS resume analysis
	- internship/company matching support

---

## Project Structure

```text
careerpilot-app/
	client/   # Next.js UI
	server/   # Express API
	app/      # Root-level Next assets/config scaffold
```

---

## Quick Start (Local)

### 1) Install dependencies

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 2) Configure environment files

Create root env for server runtime:

```bash
copy .env.example .env
```

Create client env:

```bash
copy client\.env.local.example client\.env.local
```

### 3) Run backend

```bash
npm run dev:server
```

### 4) Run frontend

```bash
npm run dev:client
```

---

## Local URLs

- Frontend: http://localhost:3000
- Backend health: http://localhost:5000/api/health

---

## Environment Notes

### Server env (root `.env`)

Important keys:
- `RAPIDAPI_KEY`, `RAPIDAPI_HOST`
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`
- `ATS_RESUME_MODEL`, `INTERNSHIP_AI_MODEL`
- `JWT_SECRET`, `GOOGLE_CLIENT_ID`

### Client env (`client/.env.local`)

Important keys:
- `NEXT_PUBLIC_API_URL`
- Firebase `NEXT_PUBLIC_FIREBASE_*`

---

## API Surface (Summary)

```text
GET    /api/health
POST   /api/auth/google
GET    /api/auth/me
GET    /api/internships
GET    /api/internships/:id
GET    /api/internships/filters
POST   /api/resume/upload
POST   /api/resume/analyze
GET    /api/recommendations
POST   /api/ai/resume-suggestions
```

---

## Deployment (Vercel + Backend)

### Frontend (Vercel)
1. Import this GitHub repo in Vercel.
2. Set project root to `client`.
3. Add `NEXT_PUBLIC_API_URL` to your deployed backend URL.
4. Add all Firebase `NEXT_PUBLIC_FIREBASE_*` vars.

### Backend
Deploy `server/` on Render/Railway/Fly/your VM, then point Vercel frontend to it.

---

## Troubleshooting

- If internships show empty: verify provider key quota and server `.env` loading.
- If resume upload says `Failed to fetch`: backend may be down or `NEXT_PUBLIC_API_URL` may be wrong.
- If login UI flickers: restart frontend after env changes.

---

## Roadmap Ideas

- Add pagination/infinite scroll for internships.
- Add bookmark folders and notes.
- Add role-based ATS keyword matching per company.
- Add email alerts for new internships.

---

<p align="center">
	<img src="https://capsule-render.vercel.app/api?type=waving&height=130&section=footer&color=0:ff9a44,50:ff6a88,100:ff99ac" alt="Footer wave" />
</p>
