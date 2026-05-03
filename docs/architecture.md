# ElectionGuide AI — Architecture

> Version 1.0 · May 2025

## System Overview

ElectionGuide AI is a civic technology platform for Indian voter education. It is built as a full-stack Next.js 16 application deployed on Google Cloud Run, with Supabase as the backend-as-a-service.

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTS                                   │
│  Browser (React 19)  │  PWA (Service Worker)               │
└──────────────┬───────────────────────┬──────────────────────┘
               │                       │
               ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS 16 — CLOUD RUN                         │
│  Region: asia-south1 (Mumbai) · asia-south2 (Delhi)         │
│  Min: 1 · Max: 100 instances · 2 CPU · 2 GB RAM             │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ App Router   │  │ API Routes   │  │  Middleware       │  │
│  │ (RSC + SSR)  │  │ /api/*       │  │  Auth + i18n      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└──────────┬──────────────────┬────────────────┬──────────────┘
           │                  │                │
     ┌─────▼──────┐   ┌──────▼─────┐  ┌──────▼──────┐
     │  SUPABASE  │   │ GOOGLE     │  │  GOOGLE     │
     │  Postgres  │   │ GEMINI AI  │  │  MAPS API   │
     │  Auth      │   │ (Gemini    │  │  Geocoding  │
     │  Storage   │   │  2.0 Flash)│  │  Places API │
     │  Realtime  │   └────────────┘  └─────────────┘
     └────────────┘
```

## Core Modules

| Module | Route | Description |
|---|---|---|
| Home | `/` | Landing page with GIGW skip link |
| Dashboard | `/dashboard` | Personalized voter hub |
| Registration Wizard | `/registration/*` | 4-step voter registration guide |
| AI Chat | `/chat` | RAG-powered electoral assistant |
| Quiz | `/quiz` | Civic knowledge testing |
| Candidates | `/candidates` | Candidate comparison tool |
| Booth Finder | `/booth-finder` | Google Maps booth locator |
| Timeline | `/timeline` | Electoral timeline visualization |
| Leaderboard | `/leaderboard` | Civic engagement rankings |
| Admin | `/admin` | Platform management |

## Technology Stack

### Frontend
- **Framework**: Next.js 16.2 (App Router, React Server Components)
- **UI**: React 19 + Tailwind CSS v4
- **Animations**: Framer Motion 12
- **State**: Zustand 5
- **Forms**: React Hook Form + Zod
- **Maps**: React Leaflet + Google Maps JavaScript API
- **i18n**: next-intl (English + Hindi)
- **Charts**: Recharts

### Backend
- **API**: Next.js Route Handlers (Edge-compatible)
- **Auth**: Supabase Auth (Google OAuth + Email OTP)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Realtime**: Supabase Realtime channels
- **AI**: Google Gemini 2.0 Flash via `@google/genai`
- **RAG**: Custom vector retrieval from seeded markdown documents
- **Push**: Web Push API with VAPID keys

### Infrastructure
- **Hosting**: Google Cloud Run (asia-south1 primary, asia-south2 failover)
- **Container**: Docker multi-stage (node:20-alpine)
- **CI/CD**: GitHub Actions (quality → build → staging → production)
- **Secrets**: Google Secret Manager
- **Monitoring**: Google Cloud Monitoring + structured logging

## Data Flow: AI Chat (RAG)

```
User Query
    │
    ▼
Middleware (auth check, locale detection)
    │
    ▼
/api/chat route handler
    │
    ├─ 1. Retrieve relevant documents from /data/seed-documents/
    │      (EVM lifecycle, voter rights, Model Code of Conduct, etc.)
    │
    ├─ 2. Augment prompt with retrieved context + user's state/constituency
    │
    ├─ 3. Call Gemini 2.0 Flash API (streaming)
    │
    └─ 4. Stream response back to client via Server-Sent Events
```

## Database Schema (key tables)

```sql
users           — Auth profiles (extends Supabase auth.users)
voter_profiles  — State, constituency, voter ID, verification status
quiz_attempts   — Quiz history, scores, completion timestamps
chat_sessions   — AI chat history (90-day retention)
notifications   — Push notification records and preferences
election_phases — Admin-managed election event calendar
```

## Security Architecture

- **Authentication**: JWT via Supabase Auth (httpOnly cookies via SSR)
- **Authorization**: Row Level Security on all database tables
- **Transport**: TLS 1.3 enforced (HSTS with preload)
- **CSP**: Strict Content Security Policy (no unsafe-eval in production)
- **Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Secrets**: Never in code — Google Secret Manager / env vars only

## Deployment Architecture

```
GitHub Push → main branch
    │
    ├─ [quality job] tsc + eslint + build validation
    ├─ [security job] npm audit
    │
    ▼ (on success)
Docker build → push to Artifact Registry
    │
    ▼
Cloud Run — Staging (asia-south1, 0–5 instances)
    │
    ├─ Smoke tests (/, /api/health, /dashboard)
    │
    ▼ (manual approval gate)
Cloud Run — Production Primary (asia-south1, 1–100 instances)
Cloud Run — Production Failover (asia-south2, 1–50 instances)
    │
    └─ Auto-rollback on failure
```

## Performance Targets

| Metric | Target | Strategy |
|---|---|---|
| LCP | < 2.5s | RSC + image optimization (AVIF/WebP) |
| FID | < 100ms | Minimal JS, deferred non-critical |
| CLS | < 0.1 | Fixed layout, font-display: swap |
| TTFB | < 800ms | Cloud Run min-instances=1, ISR |
| p95 Latency | < 2s | Regional deployment (Mumbai) |

## Compliance

- **GIGW 3.0**: Skip links, ARIA labels, keyboard navigation, contrast ratios
- **WCAG 2.1 AA**: Semantic HTML, focus management, screen reader support
- **DPDP Act 2023**: Grievance officer, data rights, 15-day resolution SLA
- **IT Act 2000 §79**: Safe harbour intermediary compliance
