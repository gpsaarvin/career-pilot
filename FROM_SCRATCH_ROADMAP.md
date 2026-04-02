# CareerPilot From-Scratch Roadmap

This roadmap is a complete blueprint to rebuild this application from zero.

It includes:
- End-to-end implementation phases
- Exact environment keys you need
- Copy-paste env templates
- API and feature checklist
- All runtime AI prompts currently used in the codebase
- A practical prompt pack you can use with Copilot/LLM to generate the full structured website

## 1) Target Architecture

Use this structure (single source of truth):

- `client/` = Next.js frontend
- `server/` = Express API backend

Note: The workspace has a duplicated backend under `client/server/`. For a clean rebuild, use only root `server/`.

## 2) Build Order (Recommended)

### Phase 0: Initialize project
1. Create monorepo folders: `client/`, `server/`.
2. Initialize each with `npm init -y`.
3. Frontend stack: Next.js + Tailwind + Firebase SDK.
4. Backend stack: Express + dotenv + cors + jsonwebtoken + google-auth-library + openai + firebase-admin + multer + pdf-parse.

### Phase 1: Backend foundation
1. Build `server/server.js` with:
- CORS local-origin allowlist
- JSON body parser
- `/uploads` static files
- Health endpoint `/api/health`
- Route mounting for auth, internships, applications, resume, recommendations, AI
2. Add middleware:
- JWT `protect` middleware
3. Add utility modules:
- Mongo connection utility
- Firestore admin utility

### Phase 2: Authentication
1. Implement Google Sign-In verification in backend (`/api/auth/google`).
2. Implement JWT session token generation.
3. Implement `/api/auth/me` and `/api/auth/me` update.
4. Keep email/password endpoints disabled or optional.

### Phase 3: Internship feed
1. Build provider service for:
- RapidAPI JSearch
- Adzuna
2. Add normalization layer:
- Unified internship schema
- Deduplication by apply link
- India and internship relevance filters
3. Add API endpoints:
- `GET /api/internships`
- `GET /api/internships/:id`
- `POST /api/internships/:id/click`
- `GET /api/internships/filters`
- `GET /api/internships/company-search`

### Phase 4: Applications and search history
1. Implement saved applications using Firestore collections.
2. Endpoints:
- `POST /api/apply`
- `GET /api/applications`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`
- `POST /api/applications/search`
- `GET /api/applications/search-history`

### Phase 5: Resume upload and analysis
1. Add PDF upload endpoint with multer (`/api/resume/upload`).
2. Extract resume text with `pdf-parse`.
3. Analyze resume for skills and suggestions (OpenAI/OpenRouter-compatible).
4. Add recommendations endpoint (`/api/recommendations`).

### Phase 6: AI assistant endpoints
1. Build company-specific resume suggestion endpoint:
- `POST /api/ai/resume-suggestions`
- `POST /api/ai-resume-suggestions` (legacy alias path in server)
2. Validate strict JSON output from model.

### Phase 7: Frontend application
1. Build Next.js app pages:
- Home dashboard
- Internships list
- Internship details
- Resume analysis page
- Login/Signup page
2. Build shared components:
- Navbar, Footer, SearchBar, FilterSidebar, InternshipCard, ThemeToggle
3. Build AuthContext and API utility layer.
4. Add Firebase popup login and backend token exchange.

### Phase 8: QA and launch readiness
1. Verify all API flows from UI.
2. Verify rate limiting and provider timeout behavior.
3. Verify missing-key fallbacks for AI and job providers.
4. Validate CORS, JWT, file upload limits, and Firestore credentials.

## 3) Environment Keys (Complete Inventory)

## Server (`server/.env`)

### Required for core app
- `PORT` (default: `5000`)
- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`

### Required for AI features (at least one provider path)
- Option A (OpenRouter preferred in this codebase):
  - `OPENROUTER_API_KEY`
  - `OPENROUTER_BASE_URL` (default fallback exists)
  - `OPENROUTER_MODEL` (default fallback exists)
- Option B (OpenAI-compatible):
  - `OPENAI_API_KEY`
  - `OPENAI_BASE_URL` (optional, defaults to OpenAI or OpenRouter depending on endpoint)
  - `AI_MODEL` (optional fallback model key)

### Required for live job provider integration (configure at least one)
- Provider 1:
  - `RAPIDAPI_KEY`
  - `RAPIDAPI_HOST` (optional, default is `jsearch.p.rapidapi.com`)
- Provider 2:
  - `ADZUNA_APP_ID`
  - `ADZUNA_APP_KEY`
  - `ADZUNA_COUNTRY` (optional, default `in`)
  - `ADZUNA_WHERE` (optional, default `India`)

### Required for Firestore-backed saved internships/history
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Optional tuning keys
- `JWT_EXPIRE` (default: `7d`)
- `DEFAULT_FEED_TARGET` (default: `60`)
- `DEFAULT_FEED_CACHE_TTL_MS` (default: `300000`)
- `COMPANY_SEARCH_CACHE_TTL_MS` (default: `300000`)
- `JOB_CACHE_TTL_MS` (default: `300000`)
- `JOB_PROVIDER_TIMEOUT_MS` (default: `12000`)
- `JOB_PROVIDER_RATE_WINDOW_MS` (default: `60000`)
- `RAPIDAPI_RATE_LIMIT_PER_WINDOW` (default: `20`)
- `ADZUNA_RATE_LIMIT_PER_WINDOW` (default: `20`)
- `FIRESTORE_SAVED_COLLECTION` (default: `savedInternships`)
- `FIRESTORE_SEARCH_COLLECTION` (default: `searchHistory`)
- `SEARCH_HISTORY_LIMIT` (default: `20`)

## Client (`client/.env.local`)

### Required
- `NEXT_PUBLIC_API_URL` (example: `http://localhost:5000/api`)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Optional
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## 4) Copy-Paste Env Templates

### `server/.env`

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/careersync

JWT_SECRET=replace_with_strong_random_secret
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=replace_with_google_oauth_web_client_id

# AI provider configuration
OPENROUTER_API_KEY=replace_with_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat

# Optional OpenAI-compatible fallback
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-3.5-turbo

# Live internship providers (set at least one provider)
RAPIDAPI_KEY=replace_with_rapidapi_key
RAPIDAPI_HOST=jsearch.p.rapidapi.com

ADZUNA_APP_ID=
ADZUNA_APP_KEY=
ADZUNA_COUNTRY=in
ADZUNA_WHERE=India

# Firestore service account credentials
FIREBASE_PROJECT_ID=replace_with_project_id
FIREBASE_CLIENT_EMAIL=replace_with_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIRESTORE_SAVED_COLLECTION=savedInternships
FIRESTORE_SEARCH_COLLECTION=searchHistory
SEARCH_HISTORY_LIMIT=20

# Optional runtime tuning
DEFAULT_FEED_TARGET=60
DEFAULT_FEED_CACHE_TTL_MS=300000
COMPANY_SEARCH_CACHE_TTL_MS=300000
JOB_CACHE_TTL_MS=300000
JOB_PROVIDER_TIMEOUT_MS=12000
JOB_PROVIDER_RATE_WINDOW_MS=60000
RAPIDAPI_RATE_LIMIT_PER_WINDOW=20
ADZUNA_RATE_LIMIT_PER_WINDOW=20
```

### `client/.env.local`

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA4_RmgzG1UGOHLiBTPQqQHVd4E_Aehr8w
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=careerpilot-ai-aaee7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=careerpilot-ai-aaee7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=careerpilot-ai-aaee7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=640722612813
NEXT_PUBLIC_FIREBASE_APP_ID=1:640722612813:web:8c05a2f31a5407074de204
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VRMJCJFF24
```

## 5) Runtime AI Prompts Used by This App

These are the prompts currently driving AI features in backend controllers.

### A) Company-specific resume strategy (`aiController.js`)

System prompt:
```text
You are a resume strategist. Output only valid JSON with keys: summary, requiredSkills, atsKeywords, suggestedProjects. summary must be 3-4 lines. requiredSkills, atsKeywords, suggestedProjects must each be arrays of concise strings.
```

User prompt template:
```text
Company: {company}
Role: {role}
Job Description: {description}

Generate practical company-specific resume tips and ATS guidance.
```

### B) Company alias expansion (`internshipController.js`)

System prompt:
```text
Return only JSON array of likely alias names for a company used in job listings. Keep concise lowercase terms. Example: ["google","google india","alphabet"].
```

User prompt template:
```text
Company: {company}
```

### C) AI refinement of company match results (`internshipController.js`)

System prompt:
```text
Return only JSON object: {"selectedIds": ["..."]}. Select internships genuinely related to the requested company name or its subsidiaries/official teams.
```

User prompt template:
```text
Target company: {company}
Aliases: {aliases_csv}
Candidates: {json_candidate_array}
```

### D) Resume skill extraction (`resumeController.js`)

System prompt:
```text
You are a resume analyzer. Extract technical skills, programming languages, frameworks, and tools from the resume text. Return ONLY a JSON array of skill strings, nothing else. Example: ["Python", "React", "SQL", "Machine Learning"]
```

User prompt template:
```text
Extract skills from this resume:

{resume_text_first_3000_chars}
```

### E) Resume improvement suggestions (`resumeController.js`)

System prompt:
```text
You are an expert career counselor and resume reviewer. Analyze the given resume and provide actionable improvement suggestions. Return a JSON array of suggestion objects with this exact format:
[{"category": "Content", "priority": "high", "title": "short title", "suggestion": "detailed actionable suggestion"},
 {"category": "Formatting", "priority": "medium", "title": "short title", "suggestion": "detailed suggestion"},
 {"category": "Skills", "priority": "high", "title": "short title", "suggestion": "detailed suggestion"}]

Categories can be: Content, Formatting, Skills, Experience, Education, Projects, Keywords, Impact, ATS Optimization.
Priority can be: high, medium, low.
Provide 6-10 specific, actionable suggestions. Focus on real improvements, not generic advice. Return ONLY the JSON array.
```

User prompt template:
```text
Analyze this resume and suggest improvements:

{resume_text_first_3000_chars}
```

## 6) Prompt Pack to Generate the Website from Scratch

Use these prompts one by one with Copilot/LLM. Each prompt asks for production-ready, file-by-file output.

### Prompt 1: Bootstrap monorepo
```text
Create a fullstack monorepo with two folders: client (Next.js App Router + Tailwind) and server (Node.js + Express). Include package.json scripts for dev/build/start and install all required dependencies for Google auth, JWT, OpenAI-compatible API, Firebase admin, PDF parsing, file uploads, and internship providers.
```

### Prompt 2: Backend entrypoint and middleware
```text
Generate server/server.js with dotenv loading, CORS allowing localhost and 127.0.0.1 any port, JSON and URL-encoded parsers, static uploads folder, health route /api/health, centralized error handler, and mounted routes: auth, internships, company-search, apply/applications, resume, recommendations, ai. Include startup function and DB init hooks.
```

### Prompt 3: Auth flow
```text
Implement Google Sign-In backend auth in Express using google-auth-library and JWT. Build POST /api/auth/google, GET /api/auth/me, PUT /api/auth/me, plus protect middleware that reads Bearer token and attaches req.user. Disable classic signup/login with 410 responses.
```

### Prompt 4: Internship provider service
```text
Build a provider layer that fetches internship jobs from RapidAPI JSearch and Adzuna, normalizes each job into one schema, deduplicates by apply link, supports timeouts and retry, supports provider-level rate limiting, and filters to India internship-related roles.
```

### Prompt 5: Internship controller and routes
```text
Create internship controller/routes supporting: list with filters and pagination, default rich feed caching, company-specific search, alias expansion with LLM, AI refinement of matches, get by id, click tracking, and dynamic filter options.
```

### Prompt 6: Applications and history
```text
Create application controller/routes with Firestore-backed save/apply tracking: POST /api/apply, GET /api/applications, PATCH /api/applications/:id, DELETE /api/applications/:id, POST /api/applications/search, GET /api/applications/search-history. Enforce auth and user ownership checks.
```

### Prompt 7: Resume upload and analysis
```text
Create resume upload/analyze features: multer PDF upload (max 5MB), text extraction with pdf-parse, skill extraction via LLM JSON output, fallback keyword extraction when AI key missing, and internship match scoring endpoint.
```

### Prompt 8: AI resume strategy endpoint
```text
Create aiController with POST /api/ai/resume-suggestions that accepts company, role, and description, calls OpenAI-compatible chat completion, enforces strict JSON response parsing, and returns summary, requiredSkills, atsKeywords, and suggestedProjects.
```

### Prompt 9: Frontend API client and auth context
```text
Generate client-side API utility with centralized fetch wrapper, auth header auto injection from localStorage token, endpoint groups for auth/internships/applications/resume/recommendations/ai, and an AuthContext with loginWithGoogle, me-refresh, token persistence, and logout.
```

### Prompt 10: GoogleSignInButton with Firebase
```text
Create a reusable GoogleSignInButton React component using Firebase popup auth. Validate all NEXT_PUBLIC_FIREBASE_* keys before sign-in, get ID token credential, and pass structured payload { credential, profile } to parent callback.
```

### Prompt 11: Structured pages and components
```text
Create Next.js app pages and components for: Home dashboard, Internship listing with sidebar filters and search, Internship details page, Resume upload/analysis page, Login page, Signup page, Navbar, Footer, InternshipCard, ThemeToggle. Ensure responsive desktop/mobile behavior and clean loading/error states.
```

### Prompt 12: Final hardening pass
```text
Perform a production hardening pass: validate env keys on startup, improve API error messages, secure CORS and JWT behavior, add request validation for AI inputs, add fallback behavior for missing external providers, and provide final run instructions for local development.
```

## 7) API Contract Checklist

- `POST /api/auth/google`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `GET /api/internships`
- `GET /api/internships/:id`
- `POST /api/internships/:id/click`
- `GET /api/internships/filters`
- `GET /api/internships/company-search`
- `POST /api/apply`
- `GET /api/applications`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`
- `POST /api/applications/search`
- `GET /api/applications/search-history`
- `POST /api/resume/upload`
- `POST /api/resume/analyze`
- `GET /api/recommendations`
- `POST /api/ai/resume-suggestions`
- `POST /api/ai-resume-suggestions`
- `GET /api/health`

## 8) Local Run Sequence

1. Backend:
- `cd server`
- `npm install`
- create `.env`
- `npm run dev`

2. Frontend:
- `cd client`
- `npm install`
- create `.env.local`
- `npm run dev`

3. Open:
- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:5000/api/health`

## 9) Definition of Done

- Google login works end-to-end and returns backend JWT.
- Internship list loads with provider or cached fallback.
- Company search returns refined results.
- Resume upload + analyze returns skills and suggestions.
- Saved applications and search history persist in Firestore.
- All pages are responsive and error states are handled.
- No required env key is missing in local setup.
