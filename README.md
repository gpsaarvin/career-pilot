# CareerPilot (Client + Server)

CareerPilot is a full-stack internship recommendation application with:

- Next.js frontend in `client/`
- Express backend in `server/`
- Google OAuth-only login
- Internship feed, saved/applied dashboard, and resume analysis

## Project Structure

- `client/` Next.js App Router UI
- `server/` Express API and integrations

## Local Setup

1. Backend setup

```bash
npm install --prefix server
copy .env.example .env
```

2. Frontend setup

```bash
cd client
npm install
copy .env.local.example .env.local
```

3. Start backend

```bash
cd server
npm run dev
```

4. Start frontend

```bash
cd client
npm run dev
```

## Local URLs

- Frontend: http://localhost:3000
- Backend health: http://localhost:5000/api/health

## API Coverage

Implemented routes include auth, internships, applications, resume upload/analyze, recommendations, AI resume suggestions, and health check.
