<h1 align="center">
  <img src="public/logo.svg" alt="ElectionGuide AI" width="56" /><br />
  ElectionGuide AI
</h1>

<p align="center">
  <strong>India's first AI-powered election guide — built for 94.5 crore voters.</strong><br />
  Instant, multilingual answers on voting, registration, candidates, and election law, powered by Gemini AI + RAG.
</p>

<p align="center">
  <a href="https://electionguide-ai-682699924845.asia-south1.run.app"><img src="https://img.shields.io/badge/Live%20Demo-Cloud%20Run-4285F4?style=flat-square&logo=google-cloud&logoColor=white" alt="Live Demo" /></a>
  <a href="https://github.com/BeerRebek/electionguide-ai/actions"><img src="https://img.shields.io/github/actions/workflow/status/BeerRebek/electionguide-ai/deploy.yml?branch=main&style=flat-square&label=CI%2FCD" alt="CI/CD Status" /></a>
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20pgvector-3ECF8E?style=flat-square&logo=supabase" />
  <img src="https://img.shields.io/badge/Gemini-1.5%20Flash%20%2F%20Pro-4285F4?style=flat-square&logo=google" />
  <img src="https://img.shields.io/badge/Tests-180%20passing-22c55e?style=flat-square&logo=jest" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [AI & RAG Pipeline](#ai--rag-pipeline)
- [Internationalization](#internationalization)
- [API Routes](#api-routes)
- [Testing](#testing)
- [CI/CD & Deployment](#cicd--deployment)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ElectionGuide AI is a full-stack civic-tech platform that empowers Indian voters with accurate, instant, and multilingual election information. It combines a **Retrieval-Augmented Generation (RAG)** pipeline on top of Google Gemini with official Election Commission of India (ECI) data to answer complex election queries, guide users through registration, explain EVM processes, and surface real-time candidate and constituency data.

**Key goals:**
- Make election information accessible in 15 Indian languages
- Reduce voter confusion around registration, booth location, and EVM processes
- Provide a transparent, AI-powered Q&A grounded in official ECI content
- Give admins a full control panel for elections, candidates, and notifications

---

## Live Demo

🌐 **Production:** [https://electionguide-ai-682699924845.asia-south1.run.app](https://electionguide-ai-682699924845.asia-south1.run.app)

| Route | Description |
|---|---|
| `/` | Marketing landing page |
| `/chat` | AI chat interface (RAG-powered) |
| `/dashboard` | Personalized voter dashboard |
| `/knowledge-base` | Official voter guides & FAQs |
| `/guides` | Step-by-step procedural guides |
| `/candidates` | Candidate profiles & comparisons |
| `/booth-finder` | Interactive map to find polling station |
| `/quiz` | Civic literacy quiz with leaderboard |
| `/timeline` | Election phase timeline |
| `/registration` | Voter registration status checker |
| `/news` | Latest election news |
| `/notifications` | Real-time notification centre |
| `/onboarding` | New-user guided onboarding wizard |
| `/admin` | Admin control panel (RBAC-protected) |
| `/leaderboard` | Quiz leaderboard |

---

## Features

### 🤖 AI Chat & RAG Pipeline
- **Gemini 1.5 Flash / Pro** with streaming responses via Server-Sent Events
- **Hybrid semantic search** — pgvector cosine similarity + Postgres full-text search with RRF (Reciprocal Rank Fusion)
- **Document chunking** with token-aware splitting for accurate context retrieval
- **RAG citations panel** — sources displayed alongside every AI response
- **Conversation persistence** — chat sessions stored in Supabase with full history
- **Cost tracking** — per-query token usage logged to `ai_usage_logs`
- **Multilingual AI translation** — responses translatable on-demand via Gemini

### 🗳️ Voter Tools
- **Registration Status Checker** — verify electoral roll with voter ID
- **Polling Booth Finder** — interactive Leaflet map with geo-coded booths
- **EVM & VVPAT Guide** — illustrated, phase-by-phase walkthrough
- **Election Timeline** — visual phase tracker (announcement → results)
- **Candidate Profiles** — assets, criminal records, party affiliation, photos
- **Grievance Filing** — cVIGIL-inspired complaint flow

### 📚 Knowledge Base & Guides
- 7 official step-by-step guides sourced from ECI:
  - Voter Registration (Form 6)
  - Voting Day procedures
  - EVM & VVPAT understanding
  - Contesting elections (Form 2B)
  - Filing grievances
  - NRI voting
  - PwD / Senior voter rights
- Search + category filter across all guides
- FAQ accordion with 5+ most-asked questions
- Learning paths (First-time voter, Aspiring candidate, PwD/Senior)

### 🧠 Civic Quiz & Gamification
- Multiple-choice quiz on election law and procedures
- Real-time score tracking with Zustand + Supabase persistence
- **Leaderboard** with rank, score, and completion time
- Confetti animation on completion

### 🔔 Notifications (Real-time)
- Supabase Realtime subscriptions for live notification delivery
- Notification types: `election` | `quiz` | `alert` | `guide` | `booth` | `milestone`
- Read/unread state, badge counts on bell icon
- Admin-triggered broadcasts via `/api/admin/notifications`
- CRON-based scheduled notification delivery (`/api/cron/notifications`)

### 👤 Onboarding Wizard
- Multi-step onboarding flow with Zustand-persisted state
- Collects: constituency, language preference, notification opt-in
- Confetti completion animation
- Skippable steps with progress indicator

### 🛡️ Admin Panel (RBAC)
- Role-based access: `super_admin` > `admin` > `moderator`
- Manage elections, candidates, constituencies, EVM stages
- Broadcast notifications to all users
- View AI usage logs and cost analytics
- Upload candidate photos to Supabase Storage

### ♿ Accessibility
- Skip-to-content link
- Language switcher (15 Indian languages)
- Screen-reader ARIA labels throughout
- High-contrast mode support
- Keyboard navigation on all interactive elements
- `@axe-core/playwright` for automated accessibility audits

### 🌐 Internationalization (i18n)
- `next-intl` with 15 locale files:
  - English, Hindi, Bengali, Tamil, Telugu, Gujarati, Marathi, Punjabi, Odia, Malayalam, Kannada, Assamese, Nepali, Urdu, Sanskrit
- Middleware-driven locale detection and routing
- RTL-ready (Urdu)

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2 | App Router, SSR, API routes |
| **React** | 19 | UI framework |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Framer Motion** | 12 | Animations & transitions |
| **Radix UI** | Various | Accessible headless components |
| **Lucide React** | Latest | Icon set |
| **Material Symbols** | (CDN) | Google icon system |
| **Recharts** | 3 | Analytics charts |
| **React Leaflet** | 5 | Interactive booth finder map |
| **React Hook Form** | 7 | Form state management |
| **Zod** | 4 | Schema validation |
| **next-intl** | 4 | Internationalization |
| **next-themes** | 0.4 | Dark/light theme |
| **canvas-confetti** | 1.9 | Celebration animations |

### State Management
| Technology | Purpose |
|---|---|
| **Zustand** | Client-side global state (chat, onboarding) |
| **React Server Components** | Server-side data fetching |

### Backend & Database
| Technology | Version | Purpose |
|---|---|---|
| **Supabase** | Latest | PostgreSQL database + Auth + Realtime + Storage |
| **pgvector** | 0.7 | Vector similarity search for RAG |
| **Supabase SSR** | 0.10 | Server-side Supabase client for Next.js |
| **Row Level Security** | — | Per-user data isolation |

### AI / ML
| Technology | Purpose |
|---|---|
| **Google Gemini 1.5 Flash** | Primary chat responses (streaming) |
| **Google Gemini 1.5 Pro** | Complex reasoning queries |
| **Google Gemini Embeddings** | `text-embedding-004` for document embeddings |
| **pgvector** | Vector store for RAG retrieval |
| **Hybrid Search (RRF)** | Combines semantic + keyword search |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Google Cloud Run** | Serverless container hosting (asia-south1) |
| **Google Cloud Build** | Container image builds |
| **GitHub Actions** | CI/CD pipeline (lint → test → build → deploy) |
| **Supabase Migrations** | Database versioning (10 migration files) |

### Testing
| Technology | Purpose |
|---|---|
| **Jest** | Unit & integration test runner |
| **ts-jest** | TypeScript support for Jest |
| **Testing Library** | React component testing |
| **jest-environment-jsdom** | Browser environment simulation |
| **Playwright** | E2E browser testing |
| **@axe-core/playwright** | Automated accessibility auditing |
| **jest-fetch-mock** | HTTP fetch mocking |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                          │
│  Next.js App Router · React 19 · Zustand · Framer Motion        │
└─────────────────┬────────────────────────────────┬──────────────┘
                  │ SSR / RSC                       │ Client fetch
┌─────────────────▼────────────────────────────────▼──────────────┐
│                    Next.js API Routes (Edge/Node)                 │
│  /api/chat  /api/notifications  /api/admin  /api/cron            │
│  /api/constituencies  /api/elections  /api/geocode               │
└────────┬────────────────────────────────────────────────────────┘
         │
   ┌─────▼──────────────────────────────────────────────────────┐
   │                     AI / RAG Layer                          │
   │  Gemini 1.5 Flash/Pro  ←→  text-embedding-004              │
   │  Hybrid Search (pgvector cosine + pg full-text + RRF)      │
   │  Chunking · Retrieval · Citation · Cost Tracking           │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────────────┐
   │                       Supabase                              │
   │  PostgreSQL + pgvector + RLS + Realtime + Storage + Auth   │
   │  10 migration files · RBAC roles · Anonymous uploads       │
   └────────────────────────────────────────────────────────────┘
```

### RAG Flow
```
User Query
    │
    ▼
Generate Embedding (text-embedding-004)
    │
    ▼
Hybrid Search:
  ├─ pgvector cosine similarity  (semantic)
  └─ Postgres tsvector FTS       (keyword)
    │
    ▼
RRF Score Fusion → Top-K chunks
    │
    ▼
Build Prompt with retrieved context
    │
    ▼
Gemini 1.5 Flash (streaming SSE)
    │
    ▼
Response + Citations → Client
```

---

## Project Structure

```
electionguide-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (sign-in, sign-up)
│   ├── admin/                    # Admin panel pages
│   ├── api/                      # API route handlers
│   │   ├── chat/                 # AI chat streaming endpoint
│   │   ├── notifications/        # Notification CRUD
│   │   ├── admin/                # Admin APIs
│   │   ├── cron/                 # Scheduled job endpoints
│   │   ├── constituencies/       # Constituency data
│   │   ├── elections/            # Election data
│   │   ├── evm-stages/           # EVM process API
│   │   ├── geocode/              # Geo-coding for booth finder
│   │   ├── health/               # Health check
│   │   └── verify-registration/  # Voter roll verification
│   ├── booth-finder/             # Interactive map
│   ├── candidates/               # Candidate listing & profiles
│   ├── chat/                     # AI chat interface
│   ├── dashboard/                # Voter dashboard
│   ├── guides/                   # Step-by-step voter guides
│   │   ├── voter-registration/
│   │   ├── voting-day/
│   │   ├── evm-vvpat/
│   │   ├── become-candidate/
│   │   ├── file-complaint/
│   │   ├── nri-voting/
│   │   └── pwd-voting/
│   ├── knowledge-base/           # Knowledge Base hub page
│   ├── leaderboard/              # Quiz leaderboard
│   ├── news/                     # Election news feed
│   ├── notifications/            # Notification centre
│   ├── onboarding/               # New-user wizard
│   ├── quiz/                     # Civic quiz
│   ├── registration/             # Registration status
│   ├── settings/                 # User settings
│   └── timeline/                 # Election timeline
│
├── components/
│   ├── accessibility/            # SkipToContent, LanguageSwitcher
│   ├── admin/                    # Admin-specific UI components
│   ├── features/                 # Feature-level components
│   │   ├── chat/                 # ChatInput, MessageBubble, Citations
│   │   ├── dashboard/            # DashboardSidebar, StatsBar, FeatureGrid
│   │   ├── candidates/           # CandidateCard, CandidateProfile
│   │   └── wizards/              # WizardCompletion, OnboardingSteps
│   ├── layout/                   # PageWrapper, SidebarLayout
│   ├── quiz/                     # QuizCard, ProgressBar, Results
│   ├── shared/                   # Navbar, Footer, NotificationBell
│   └── ui/                       # Reusable base components (Button, Card, etc.)
│
├── lib/
│   ├── ai/
│   │   ├── chunking.ts           # Token-aware document chunking
│   │   ├── embeddings.ts         # Gemini embedding generation
│   │   ├── gemini.ts             # Chat completion + streaming
│   │   ├── retrieval.ts          # Hybrid search + RRF
│   │   └── translate.ts          # On-demand translation
│   ├── admin/                    # Admin utility functions
│   ├── data/                     # Static data helpers
│   ├── external/                 # External API integrations
│   ├── hooks/                    # Shared React hooks
│   ├── notifications/            # Notification delivery logic
│   ├── stores/
│   │   ├── chat-store.ts         # Zustand chat state
│   │   └── onboarding-store.ts   # Zustand onboarding state
│   ├── supabase/                 # Supabase client (browser + server)
│   └── utils/                    # Shared utility functions
│
├── messages/                     # i18n locale files (15 languages)
│   ├── en.json, hi.json, bn.json, ta.json, te.json
│   ├── gu.json, mr.json, pa.json, or.json, ml.json
│   ├── kn.json, as.json, ne.json, ur.json, sa.json
│
├── supabase/
│   └── migrations/               # 10 versioned SQL migration files
│       ├── 001_initial_schema.sql
│       ├── 002_seed_constituencies.sql
│       ├── 003_pgvector_rag.sql
│       ├── 004_performance_feedback.sql
│       ├── 005_ai_usage_logs.sql
│       ├── 006_admin_rbac.sql
│       ├── 007_chat_storage.sql
│       ├── 008_allow_anonymous_uploads.sql
│       └── 009_notifications_realtime.sql
│
├── __tests__/                    # Test suite (180 tests)
│   ├── api/                      # API route tests
│   ├── components/               # Component tests
│   ├── lib/                      # Unit tests for lib functions
│   └── stores/                   # Zustand store tests
│
├── .github/workflows/deploy.yml  # GitHub Actions CI/CD
├── Dockerfile                    # Multi-stage Docker build
├── cloudbuild.yaml               # Google Cloud Build config
├── middleware.ts                 # Auth + i18n locale middleware
└── next.config.ts                # Next.js configuration
```

---

## Database Schema

The PostgreSQL database (via Supabase) has the following core tables:

| Table | Description |
|---|---|
| `profiles` | Extended user profile (linked to Supabase Auth) |
| `constituencies` | 543 Lok Sabha + state constituencies with geo data |
| `elections` | Election events with phases and status |
| `candidates` | Candidate profiles with assets, party, and records |
| `voter_registrations` | Registration status records |
| `polling_booths` | Booth locations with lat/lng |
| `guides` | Voter guide content (slug, category, content) |
| `documents` | RAG knowledge base documents |
| `document_chunks` | Chunked text with `embedding` vector (1536-d) |
| `chat_sessions` | Persisted chat session metadata |
| `chat_messages` | Individual messages with role and citations |
| `quiz_questions` | Multiple-choice civic quiz questions |
| `quiz_attempts` | User quiz attempts with scores |
| `notifications` | System and admin-broadcast notifications |
| `notification_reads` | Per-user read state for notifications |
| `ai_usage_logs` | Per-query token usage and cost tracking |
| `performance_feedback` | User feedback on AI response quality |
| `admin_roles` | RBAC role assignments |
| `evm_stages` | EVM process stage illustrations |

All tables use **Row Level Security (RLS)** enforced at the database level.

---

## AI & RAG Pipeline

### Embedding Generation
- Model: `text-embedding-004` (1536 dimensions)
- Chunking: token-aware with configurable overlap
- Storage: pgvector `vector(1536)` column on `document_chunks`

### Retrieval Strategy
```typescript
// Hybrid search with Reciprocal Rank Fusion
hybridSearch(query, topK=5, semanticWeight=0.7, keywordWeight=0.3)
```
1. **Semantic search** — pgvector cosine similarity on query embedding
2. **Full-text search** — Postgres `tsvector` / `tsquery` on chunk text
3. **RRF fusion** — combines both rank lists with `k=60` constant
4. Falls back to pure vector search on FTS failure

### Chat Completion
- **Streaming** via `ReadableStream` → Server-Sent Events → client
- System prompt enforces ECI grounding and citation rules
- Conversation history included for multi-turn coherence
- Cost tracked per request (input tokens, output tokens, model)

### Translation
- On-demand response translation via `gemini.ts`
- Target language derived from user's `next-intl` locale

---

## Internationalization

Supported locales (15 total):

| Code | Language | Status |
|---|---|---|
| `en` | English | ✅ Full |
| `hi` | Hindi | ✅ Full |
| `bn` | Bengali | ✅ Full |
| `ta` | Tamil | ✅ Full |
| `te` | Telugu | ✅ Full |
| `gu` | Gujarati | ✅ Full |
| `mr` | Marathi | ✅ Full |
| `pa` | Punjabi | 🟡 Partial |
| `or` | Odia | 🟡 Partial |
| `ml` | Malayalam | 🟡 Partial |
| `kn` | Kannada | 🟡 Partial |
| `as` | Assamese | 🟡 Partial |
| `ne` | Nepali | 🟡 Partial |
| `ur` | Urdu | 🟡 Partial |
| `sa` | Sanskrit | 🟡 Partial |

Routing: `middleware.ts` detects locale from cookie / Accept-Language header and rewrites URLs to `/{locale}/...`

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chat` | Optional | Streaming AI chat with RAG |
| `GET` | `/api/constituencies` | Public | List all constituencies |
| `GET` | `/api/elections` | Public | Active elections |
| `GET` | `/api/evm-stages` | Public | EVM process stages |
| `GET` | `/api/geocode` | Public | Geocode address to lat/lng |
| `GET` | `/api/verify-registration` | Public | Check voter roll status |
| `GET/POST` | `/api/notifications` | Auth | User notifications |
| `POST` | `/api/admin/notifications` | Admin | Broadcast notification |
| `POST` | `/api/cron/notifications` | CRON | Scheduled notification delivery |
| `GET` | `/api/health` | Public | Health check endpoint |

---

## Testing

**180 tests** across 4 categories:

```
__tests__/
├── api/           ─ API route handler tests
├── components/    ─ React component rendering tests
├── lib/
│   ├── retrieval.test.ts    ─ Hybrid search, RRF, fallback logic
│   └── validation.test.ts   ─ Schema validation (Zod)
└── stores/
    ├── chat-store.test.ts       ─ Zustand chat state actions
    └── onboarding-store.test.ts ─ Zustand onboarding state
```

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Coverage Targets
- Unit tests (lib functions): ~100%
- Store tests: ~100%
- API route tests: ~70%
- Component tests: ~60%

### E2E Testing
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test
```

---

## CI/CD & Deployment

### GitHub Actions Pipeline (`.github/workflows/deploy.yml`)

```
Push to main
    │
    ▼
┌─────────────┐
│   Lint      │  ESLint check
└──────┬──────┘
       │
    ▼
┌─────────────┐
│   Test      │  Jest (180 tests)
└──────┬──────┘
       │
    ▼
┌─────────────┐
│   Build     │  npx next build (TypeScript check)
└──────┬──────┘
       │
    ▼
┌──────────────────────┐
│  Docker Build        │  Multi-stage Dockerfile
│  Push to GCR         │  gcr.io/[project]/electionguide-ai
└──────────┬───────────┘
           │
    ▼
┌──────────────────────┐
│  Deploy to Cloud Run │  asia-south1 region
│  (Google Cloud Run)  │  Auto-scaling · HTTPS
└──────────────────────┘
```

### Docker Build

```bash
# Build image
docker build -t electionguide-ai .

# Run locally
docker run -p 3000:3000 --env-file .env.local electionguide-ai
```

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your-gemini-api-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# CRON security
CRON_SECRET=your-cron-secret

# Optional: Admin
ADMIN_EMAIL=admin@example.com
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10
- A Supabase project with pgvector enabled
- A Google AI (Gemini) API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/BeerRebek/electionguide-ai.git
cd electionguide-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase + Gemini credentials

# 4. Run database migrations
# Apply supabase/migrations/*.sql to your Supabase project
# via Supabase Dashboard > SQL Editor, or:
npx supabase db push

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed Knowledge Base

To populate the RAG knowledge base with ECI documents:

```bash
# From the scripts/ directory
node scripts/seed-documents.js
```

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request against `main`

All PRs must pass:
- ✅ ESLint (`npm run lint`)
- ✅ TypeScript (`npx tsc --noEmit`)
- ✅ Jest tests (`npm test`)

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for Indian democracy · Powered by <a href="https://deepmind.google/technologies/gemini/">Google Gemini</a> + <a href="https://supabase.com">Supabase</a> + <a href="https://nextjs.org">Next.js</a>
</p>
