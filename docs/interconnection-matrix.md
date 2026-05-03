# ElectionGuide AI — Feature Interconnection Matrix

**Last Updated:** [28 April 2026]  
**Version:** 1.0  
**Owner:** [Amit Salpekar]

This document maps every connection between features in ElectionGuide AI. 
Use it to verify integration, design new features, and onboard developers.

---

## 📑 Table of Contents

1. [Feature Inventory](#1-feature-inventory)
2. [High-Level Connection Map](#2-high-level-connection-map)
3. [Bidirectional Connection Matrix](#3-bidirectional-connection-matrix)
4. [Detailed Feature Contracts](#4-detailed-feature-contracts)
5. [Data Flow Diagrams](#5-data-flow-diagrams)
6. [Event Bus & Trigger Catalog](#6-event-bus--trigger-catalog)
7. [Database Cascade Rules](#7-database-cascade-rules)
8. [API Endpoint Map](#8-api-endpoint-map)
9. [Realtime Subscription Map](#9-realtime-subscription-map)
10. [Integration Test Coverage](#10-integration-test-coverage)
11. [Known Gaps & TODOs](#11-known-gaps--todos)

---

## 1. Feature Inventory

| ID | Feature Name | Category | Phase Built | Owner Component |
|----|--------------|----------|-------------|-----------------|
| F01 | User Profile & Auth | Core | Phase 2 | `/app/(auth)/*` |
| F02 | Onboarding Flow | Core | Phase 2 | `/app/onboarding/*` |
| F03 | Dashboard | Core | Phase 7 | `/app/(dashboard)/page` |
| F04 | AI Chat Assistant | Core | Phase 3,4 | `/app/(dashboard)/chat` |
| F05 | RAG Knowledge Base | Core | Phase 4 | `/lib/ai/retrieval` |
| F06 | Election Timeline | Feature | Phase 5 | `/app/(dashboard)/timeline` |
| F07 | EVM/VVPAT Visualizer | Feature | Phase 5 | `/app/(dashboard)/evm-vvpat` |
| F08 | Voter Registration Wizard | Feature | Phase 6 | `/app/guides/voter-registration` |
| F09 | Voting Day Wizard | Feature | Phase 6 | `/app/guides/voting-day` |
| F10 | Candidate Wizard | Feature | Phase 6 | `/app/guides/become-candidate` |
| F11 | Complaint Filing Wizard | Feature | Phase 6 | `/app/guides/file-complaint` |
| F12 | NRI Voting Wizard | Feature | Phase 6 | `/app/guides/nri-voting` |
| F13 | PwD Voting Wizard | Feature | Phase 6 | `/app/guides/pwd-voting` |
| F14 | Quiz Module | Feature | Phase 6 | `/app/(dashboard)/quizzes` |
| F15 | Leaderboard | Feature | Phase 6 | `/app/(dashboard)/leaderboard` |
| F16 | Achievements/Badges | Feature | Phase 6 | `/components/achievements` |
| F17 | Candidate KYC | Feature | Phase 6 | `/app/(dashboard)/candidates` |
| F18 | Polling Booth Finder | Feature | Phase 7 | `/app/(dashboard)/booth-finder` |
| F19 | Notifications | Cross-cutting | Phase 7 | `/components/notifications` |
| F20 | Bookmarks | Cross-cutting | Phase 7 | `/components/bookmarks` |
| F21 | Activity Feed | Cross-cutting | Phase 9 | `/app/(dashboard)/activity` |
| F22 | Global Search | Cross-cutting | Phase 9 | `/components/global-search` |
| F23 | Voter Readiness Score | Cross-cutting | Phase 9 | `/lib/services/readiness` |
| F24 | Multi-language i18n | Cross-cutting | Phase 1 | `/messages/*` |
| F25 | Accessibility Tools | Cross-cutting | Phase 1 | `/components/accessibility` |

---

## 2. High-Level Connection Map
┌─────────────────┐
                      │  User Profile   │ (F01)
                      │   (Source)      │
                      └────────┬────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
   ┌────────────────┐  ┌──────────────┐  ┌──────────────┐
   │  Onboarding    │  │  Dashboard   │  │  Settings    │
   │     (F02)      │  │    (F03)     │  │              │
   └────────────────┘  └──────┬───────┘  └──────────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    ▼                         ▼                         ▼
┌─────────┐             ┌─────────────┐            ┌──────────┐
│  Chat   │◄────────────┤  Wizards    │            │ Timeline │
│  (F04)  │             │  (F08-F13)  │            │  (F06)   │
└────┬────┘             └──────┬──────┘            └────┬─────┘
│                         │                        │
▼                         ▼                        ▼
┌─────────┐             ┌─────────────┐         ┌──────────────┐
│   RAG   │             │  Progress   │         │ EVM Explainer│
│  (F05)  │             │  Tracking   │         │    (F07)     │
└─────────┘             └──────┬──────┘         └──────────────┘
│
┌─────────────────────────┼──────────────────────────┐
▼                         ▼                          ▼
┌──────────┐            ┌──────────────┐          ┌──────────────┐
│ Booth    │            │   Quizzes    │          │  Candidate   │
│ Finder   │            │    (F14)     │          │    KYC       │
│  (F18)   │            └──────┬───────┘          │    (F17)     │
└────┬─────┘                   │                  └──────────────┘
│                         ▼
│                  ┌──────────────┐
│                  │ Leaderboard  │
│                  │    (F15)     │
│                  └──────────────┘
│
└──────────────────────┬──────────────────────────────┐
▼                              ▼
┌──────────────────┐           ┌──────────────────┐
│  Notifications   │           │  Activity Feed   │
│     (F19)        │           │     (F21)        │
└──────────────────┘           └──────────────────┘

---

## 3. Bidirectional Connection Matrix

**Legend:**
- ✅ = Direct connection exists
- 🔄 = Bidirectional connection
- ⏰ = Triggered by event/cron
- 🔗 = Deep link only
- ❌ = No connection (intentionally)
- ⚠️ = Connection needed but missing

### 3.1 Core Connection Matrix

| FROM ↓ / TO → | F01 Profile | F03 Dash | F04 Chat | F06 Time | F08 VotReg | F14 Quiz | F18 Booth | F19 Notif | F21 Activity |
|---------------|:-----------:|:--------:|:--------:|:--------:|:----------:|:--------:|:---------:|:---------:|:------------:|
| **F01 Profile** | — | 🔄 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **F03 Dashboard** | 🔄 | — | 🔗 | 🔗 | 🔗 | 🔗 | 🔗 | ✅ | ✅ |
| **F04 Chat** | ✅ | 🔗 | — | 🔗 | 🔗 | 🔗 | 🔗 | ⏰ | ✅ |
| **F06 Timeline** | ✅ | ✅ | 🔗 | — | ✅ | 🔗 | 🔗 | ⏰ | ✅ |
| **F08 VoterReg** | 🔄 | ✅ | 🔗 | ✅ | — | 🔗 | 🔗 | ⏰ | ✅ |
| **F14 Quiz** | ✅ | ✅ | 🔗 | ❌ | 🔗 | — | ❌ | ⏰ | ✅ |
| **F18 Booth** | 🔄 | ✅ | 🔗 | ❌ | 🔗 | ❌ | — | ⏰ | ✅ |
| **F19 Notifications** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| **F21 Activity** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |

### 3.2 Cross-cutting Features Matrix

| Feature | Reads From | Writes To | Triggers |
|---------|------------|-----------|----------|
| **F19 Notifications** | All features | `notifications` table, Email, Push, SMS | Phase changes, Wizard completions, Quiz scores, Booth changes |
| **F20 Bookmarks** | F04, F06, F08-F13, F14, F17 | `bookmarks` table | None |
| **F21 Activity Feed** | All features | `activity_feed` table | None |
| **F22 Global Search** | All searchable content | None (read-only) | None |
| **F23 Readiness Score** | F08, F18, F17 | `user_election_journey` | F03 update |
| **F24 i18n** | All features | None | None |
| **F25 Accessibility** | All features | `profile.accessibility_preferences` | None |

---

## 4. Detailed Feature Contracts

Each feature documents its **inputs**, **outputs**, **dependencies**, and **integration points**.

---

### 4.1 F03 — Dashboard

**Purpose:** Central hub showing user's election journey and quick actions.

**INPUTS (reads from):**

| Source | Data | When | Cache TTL |
|--------|------|------|-----------|
| F01 Profile | name, constituency, language | Every load | 5 min |
| F23 Readiness Score | score (0-8), completed steps | Every load | Realtime |
| F06 Timeline | next election, current phase, countdown | Every load | 1 hour |
| F08-F13 Wizards | in-progress wizards, last position | Every load | Realtime |
| F14 Quiz | daily challenge status, recent scores | Every load | 5 min |
| F19 Notifications | last 5 unread | Realtime | Realtime |
| F21 Activity | last 5 activities | Every load | Realtime |
| F20 Bookmarks | recent 3 bookmarks | Every load | 5 min |

**OUTPUTS (writes to):**

| Target | Data | When |
|--------|------|------|
| F21 Activity | "Visited dashboard" event | Page load |
| Analytics | Page view, widget clicks | User interaction |

**DEPENDENCIES:**
- Requires F01 (must be authenticated)
- Requires F02 (must be onboarded)
- Soft dependency on F23 (defaults to 0 if missing)

**INTEGRATION POINTS:**
- ✅ Hero card pulls real-time data via Supabase subscription
- ✅ Quick action buttons deep-link to features
- ✅ Notification bell uses realtime subscription
- ✅ Activity widget refreshes on focus

**FAILURE MODES:**
- If F23 fails → Show "0/8" with refresh button
- If F19 realtime fails → Fall back to polling every 30s
- If F06 fails → Show "Election data unavailable" placeholder

**TEST CASES:**
- [ ] Dashboard shows correct readiness score after wizard completion
- [ ] Notifications appear within 1 second of trigger
- [ ] Quick actions deep-link to correct pages with context
- [ ] Activity feed shows latest 5 actions in order
- [ ] Hero card updates when election phase changes

---

### 4.2 F04 — AI Chat Assistant

**Purpose:** Conversational AI for election questions with Bite-Snack-Meal responses.

**INPUTS (reads from):**

| Source | Data | When | Purpose |
|--------|------|------|---------|
| F01 Profile | language_pref, constituency, voter_status | Each message | Personalize response |
| F05 RAG | retrieved chunks (top 5) | Each message | Ground response |
| F23 Readiness | completed steps | Each message | Suggest next actions |
| F06 Timeline | active phase | Each message | Context |

**OUTPUTS (writes to):**

| Target | Data | When |
|--------|------|------|
| `chat_sessions` | New session record | First message |
| `chat_messages` | User + assistant messages | Every message |
| F19 Notifications | "New chat insight" | If important info detected |
| F21 Activity | "Asked about [topic]" | Every meaningful message |
| F20 Bookmarks | Auto-bookmark suggestion | If user likes (👍) |

**ENTITY EXTRACTION & DEEP LINKING:**

When AI response contains these entities, render as deep links:

| Entity Pattern | Links To | Example |
|---------------|----------|---------|
| "Form 6", "Form 6A", "Form 7", "Form 8" | F08 (specific path) | "Form 6" → `/guides/voter-registration?form=6` |
| "Form 17A", "Form 17C" | F09 Voting Day | "Form 17C" → `/guides/voting-day#form-17c` |
| "Form 26" | F17 Candidate KYC | "Form 26" → `/candidates?focus=affidavit` |
| "Section 61A", "Rule 49B", etc. | F05 source modal | Opens citation drawer |
| "EVM", "VVPAT", "Control Unit" | F07 EVM Explainer | "EVM" → `/evm-vvpat#components` |
| "MCC", "Model Code of Conduct" | F06 Timeline | "MCC" → `/timeline?phase=announcement` |
| "Lok Sabha 2024", state name | F06 Timeline | "Maharashtra" → `/timeline?state=mh` |
| "Polling booth", "voting booth" | F18 Booth Finder | "polling booth" → `/booth-finder` |
| Candidate name (if in DB) | F17 Candidate Profile | "Rahul Gandhi" → `/candidates/[id]` |

**INTEGRATION POINTS:**
- ✅ Receives user context on every request
- ✅ Updates activity feed on each conversation
- ✅ Auto-suggests related guides at end of response
- ✅ Cross-references mentioned entities

**FAILURE MODES:**
- If RAG fails → Respond without citations, flag as low-confidence
- If Gemini API fails → Show error with retry button, log incident
- If user offline → Queue messages, send when online

**TEST CASES:**
- [ ] Chat responses cite real documents from F05
- [ ] Form/Rule entities render as clickable links
- [ ] Clicking entity link navigates with proper context
- [ ] Activity feed logs meaningful conversations
- [ ] Language matches user preference

---

### 4.3 F08 — Voter Registration Wizard

**Purpose:** Step-by-step guide for voter registration via Form 6/6A/7/8.

**INPUTS (reads from):**

| Source | Data | When |
|--------|------|------|
| F01 Profile | constituency, age_range, voter_status | Wizard start |
| F04 Chat | context if launched from chat | Wizard start |
| `user_progress` | resume position | Wizard start |

**OUTPUTS (writes to):**

| Target | Data | When |
|--------|------|------|
| `user_progress` | step completion, current step | Each step |
| `user_election_journey` | steps_completed array | Each step |
| F23 Readiness | recalculate score | Each step completion |
| F03 Dashboard | hero card update | Wizard completion |
| F19 Notifications | "Step 3/8 completed" | Each step |
| F19 Notifications | "Wizard completed!" | Final step |
| F16 Achievements | Check "First Wizard" badge | Completion |
| F21 Activity | "Started/Completed wizard" | Start/End |
| F20 Bookmarks | Suggest bookmark | Completion |

**STATE MACHINE:**
[Start] → [Logic Questionnaire]
├─ "First Time" → [Form 6 Path]
├─ "NRI"        → [Form 6A Path]
├─ "Remove"     → [Form 7 Path]
└─ "Update"     → [Form 8 Path]
[Form 6 Path]
↓
[Eligibility Check] → [Documents Checklist] → [Qualifying Dates]
↓                                              ↓
[Mode Selection: Online vs Offline]
↓                       ↓
[NVSP Walkthrough]   [BLO Office Info]
↓                       ↓
[After Submission Info]
↓
[Verify Registration]
↓
[Completion + Certificate]

**INTEGRATION POINTS:**
- ✅ Auto-saves progress every step
- ✅ Resumes from last position on return
- ✅ Updates dashboard on each step
- ✅ Triggers achievements on completion
- ✅ Cross-links to Booth Finder after completion
- ✅ Pre-fills data from profile if available

**TEST CASES:**
- [ ] Wizard branches correctly based on initial answer
- [ ] Progress persists across sessions
- [ ] Dashboard reflects each step completion
- [ ] Notification fires on completion
- [ ] Achievement awarded for first wizard
- [ ] Suggested next action: "Find Polling Booth"
- [ ] Certificate generates with user's name
- [ ] Activity feed logs start and completion

---

### 4.4 F14 — Quiz Module

**Purpose:** Gamified civic literacy quizzes.

**INPUTS:**

| Source | Data | When |
|--------|------|------|
| F01 Profile | language_pref | Quiz start |
| F05 RAG | for question generation | Quiz authoring |
| `quiz_attempts` | best score, attempts | Quiz card |

**OUTPUTS:**

| Target | Data | When |
|--------|------|------|
| `quiz_attempts` | New attempt record | Submission |
| F15 Leaderboard | rank update | Submission |
| F16 Achievements | check badges | Submission |
| F19 Notifications | "Quiz completed: 90%" | Submission |
| F21 Activity | "Aced [Quiz Name]" | Submission |
| F03 Dashboard | recent score | Submission |

**ACHIEVEMENT TRIGGERS:**

| Condition | Badge Awarded |
|-----------|---------------|
| First quiz completed | "Quiz Beginner" |
| Score 100% | "Perfect Score" |
| 10 quizzes completed | "Quiz Enthusiast" |
| 50 quizzes completed | "Quiz Champion" |
| 7-day streak | "Week Warrior" |
| All quizzes in category | "Category Master" |

**INTEGRATION POINTS:**
- ✅ Pulls questions from RAG-grounded content
- ✅ Updates leaderboard in real-time
- ✅ Triggers achievement check on each completion
- ✅ Suggests related guides post-quiz

**TEST CASES:**
- [ ] Score calculation accurate
- [ ] Leaderboard updates within 2 seconds
- [ ] All eligible badges awarded
- [ ] Streak tracking works across days
- [ ] Quiz available in user's language
- [ ] Certificate generated for passing scores

---

### 4.5 F18 — Polling Booth Finder

**Purpose:** Locate user's assigned polling booth with map.

**INPUTS:**

| Source | Data | When |
|--------|------|------|
| F01 Profile | constituency, address | Search |
| Geolocation API | current coords | If permitted |
| Google Civic API | official booth data | Search |

**OUTPUTS:**

| Target | Data | When |
|--------|------|------|
| F01 Profile | assigned_booth_id | Booth confirmed |
| F20 Bookmarks | auto-bookmark booth | Booth saved |
| F19 Notifications | "Booth located" | Search success |
| F19 Notifications | "Election day reminder" | 1 day before |
| F23 Readiness | mark "booth_located" step | First search |
| F21 Activity | "Found polling booth" | Search success |

**INTEGRATION POINTS:**
- ✅ Updates voter readiness on first successful search
- ✅ Auto-bookmarks for quick access
- ✅ Schedules election day reminder
- ✅ Shows on dashboard once located

**TEST CASES:**
- [ ] Geolocation permission flow works
- [ ] EPIC search returns correct booth
- [ ] Map displays with proper markers
- [ ] Booth saves to profile
- [ ] Election day reminder scheduled
- [ ] Dashboard updates after booth found

---

### 4.6 F19 — Notification System

**Purpose:** Multi-channel alerts and reminders.

**TRIGGER CATALOG:**

| Trigger Source | Event | Channels | Template |
|---------------|-------|----------|----------|
| F02 Onboarding | Welcome | In-app, Email | "Welcome to ElectionGuide AI!" |
| F08 Voter Reg | Step completed | In-app | "Step X/8 completed" |
| F08 Voter Reg | Wizard completed | In-app, Email | "🎉 Voter registration guide completed" |
| F14 Quiz | Quiz completed | In-app | "Quiz: scored X%" |
| F16 Achievement | Badge earned | In-app, Push | "🏆 New badge: [name]" |
| F18 Booth | Booth found | In-app | "Polling booth located" |
| F18 Booth | Election day -1 | Push, SMS | "Vote tomorrow!" |
| F06 Timeline | Phase change | In-app, Email | "Election entered [phase]" |
| F06 Timeline | MCC active | In-app, Push | "Model Code of Conduct now in effect" |
| F06 Timeline | Voter list deadline | Email, Push | "Voter list update qualifying date" |
| Cron | Daily quiz | Push | "Daily quiz available" |
| Cron | Weekly digest | Email | "Your week in elections" |

**CHANNEL PREFERENCE LOGIC:**
For each notification:

Check user.notification_preferences for type
Check quiet_hours
Check accessibility preferences
Send via enabled channels
Log delivery status
Track open/click rates


**INTEGRATION POINTS:**
- ✅ Listens to all feature events
- ✅ Real-time delivery via Supabase Realtime
- ✅ Push via Firebase Cloud Messaging
- ✅ Email via Resend
- ✅ SMS via Twilio (critical only)
- ✅ Deep links to relevant pages

**TEST CASES:**
- [ ] Each trigger fires correctly
- [ ] User preferences respected
- [ ] Quiet hours honored
- [ ] Multi-channel delivery works
- [ ] Deep links navigate correctly
- [ ] Read status syncs across devices

---

### 4.7 F23 — Voter Readiness Score

**Purpose:** 8-step checklist tracking user's election preparedness.

**8 STEPS:**

| Step | Trigger | Source | Weight |
|------|---------|--------|--------|
| 1. Verify Registration | Verification successful | F08 | 1 |
| 2. Update Details (if needed) | Form 8 completed (or skipped) | F08 | 1 |
| 3. Find Polling Booth | First successful booth search | F18 | 1 |
| 4. Research Candidates | Viewed 2+ candidates | F17 | 1 |
| 5. Set Election Reminder | Calendar export OR notification enabled | F06 | 1 |
| 6. Plan Transport | Directions viewed for booth | F18 | 1 |
| 7. Gather Required ID | Documents checklist completed | F08 | 1 |
| 8. Cast Vote | Self-reported on election day | Manual | 1 |

**SCORE CALCULATION:**

```typescript
// /lib/services/readiness.ts

async function calculateReadinessScore(userId: string): Promise<ReadinessData> {
  const [progress, journey, profile, bookmarks] = await Promise.all([
    getUserProgress(userId),
    getUserJourney(userId),
    getProfile(userId),
    getBookmarks(userId)
  ])
  
  const steps = {
    verified_registration: hasCompletedWizard(progress, 'voter-registration'),
    updated_details: hasCompletedWizard(progress, 'form-8') || skippedExplicitly,
    found_booth: !!profile.assigned_booth_id,
    researched_candidates: candidateViews >= 2,
    election_reminder: profile.notification_preferences.election_day === true,
    planned_transport: directionsViewed,
    gathered_id: documentsChecklistComplete,
    cast_vote: journey.voted === true
  }
  
  const score = Object.values(steps).filter(Boolean).length
  
  return { score, total: 8, steps }
}
```

**UPDATE TRIGGERS:**

| Event | Updates |
|-------|---------|
| Wizard step completed | Recalculate steps 1, 2, 7 |
| Booth located | Step 3 |
| Candidate profile viewed | Step 4 (after 2 views) |
| Notifications enabled | Step 5 |
| Directions viewed | Step 6 |
| Self-report voted | Step 8 |

**INTEGRATION POINTS:**
- ✅ Subscribes to multiple feature events
- ✅ Updates dashboard hero card in real-time
- ✅ Suggests next action based on incomplete steps
- ✅ Triggers achievement at 8/8

**TEST CASES:**
- [ ] Score updates within 1s of triggering action
- [ ] Each step accurately reflects state
- [ ] Dashboard shows updated score
- [ ] Achievement awarded at 8/8
- [ ] Suggested action targets next missing step

---

## 5. Data Flow Diagrams

### 5.1 Wizard Completion Flow
USER COMPLETES VOTER REGISTRATION WIZARD
│
▼
┌───────────────────────┐
│  1. Save to DB        │
│  user_progress.       │
│  completed = true     │
└───────────┬───────────┘
│
▼
┌───────────────────────┐         ┌──────────────────┐
│  2. DB Trigger Fires  │────────▶│ Update Journey   │
│  on_progress_update   │         │ steps_completed  │
└───────────┬───────────┘         └──────────────────┘
│
▼
┌───────────────────────┐
│  3. Recalculate       │
│  Readiness Score      │
│  (F23 service)        │
└───────────┬───────────┘
│
├──────────────────┬──────────────────┬──────────────────┐
▼                  ▼                  ▼                  ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ 4. Notification│  │ 5. Activity    │  │ 6. Achievement │  │ 7. Dashboard   │
│ Created        │  │ Feed Entry     │  │ Check          │  │ Realtime Sync  │
└────────┬───────┘  └────────────────┘  └────────┬───────┘  └────────────────┘
│                                       │
▼                                       ▼
┌────────────────┐                      ┌────────────────┐
│ Multi-channel  │                      │ Award if       │
│ Delivery       │                      │ "First Wizard" │
└────────────────┘                      └────────────────┘

### 5.2 AI Chat with RAG Flow
USER SENDS MESSAGE
│
▼
┌──────────────────┐
│ Detect Language  │
│ Get User Context │
└────────┬─────────┘
│
▼
┌──────────────────┐         ┌──────────────────┐
│ Generate Query   │────────▶│ Vector Search    │
│ Embedding        │         │ (top 5 chunks)   │
└──────────────────┘         └────────┬─────────┘
│
▼
┌──────────────────┐
│ Build Prompt     │
│ + Context        │
│ + User Profile   │
└────────┬─────────┘
│
▼
┌──────────────────┐
│ Stream Gemini    │
│ Response (SSE)   │
└────────┬─────────┘
│
▼
┌──────────────────┐
│ Extract Entities │
│ Add Deep Links   │
└────────┬─────────┘
│
┌───────────────────────┼───────────────────────┐
▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Save Message +   │    │ Activity Feed    │    │ Suggest Related  │
│ Citations        │    │ Entry            │    │ Guides           │
└──────────────────┘    └──────────────────┘    └──────────────────┘

### 5.3 Election Phase Change Flow (Cron-Driven)
CRON: Every hour, check elections
│
▼
┌───────────────────────┐
│ Find elections where  │
│ phase should change   │
└───────────┬───────────┘
│
▼
┌───────────────────────┐
│ Update elections.     │
│ status                │
└───────────┬───────────┘
│
├──────────────────┬─────────────────────┬──────────────────┐
▼                  ▼                     ▼                  ▼
┌────────────────┐  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐
│ Notify users   │  │ Update Timeline │  │ Update AI knowl- │  │ Update       │
│ in state       │  │ page (cache)    │  │ edge base        │  │ Dashboard    │
└────────────────┘  └─────────────────┘  └──────────────────┘  └──────────────┘

---

## 6. Event Bus & Trigger Catalog

**Implementation:** Use Supabase database triggers + application-level event emitter.

### 6.1 Application Events

```typescript
// /lib/events/event-bus.ts

type AppEvent = 
  // User events
  | { type: 'USER_SIGNED_UP'; userId: string }
  | { type: 'USER_ONBOARDED'; userId: string }
  | { type: 'PROFILE_UPDATED'; userId: string; changes: Partial<Profile> }
  
  // Wizard events
  | { type: 'WIZARD_STARTED'; userId: string; wizardId: string }
  | { type: 'WIZARD_STEP_COMPLETED'; userId: string; wizardId: string; step: number }
  | { type: 'WIZARD_COMPLETED'; userId: string; wizardId: string }
  
  // Quiz events
  | { type: 'QUIZ_STARTED'; userId: string; quizId: string }
  | { type: 'QUIZ_COMPLETED'; userId: string; quizId: string; score: number }
  
  // Booth events
  | { type: 'BOOTH_SEARCHED'; userId: string; query: string }
  | { type: 'BOOTH_LOCATED'; userId: string; boothId: string }
  | { type: 'DIRECTIONS_VIEWED'; userId: string; boothId: string }
  
  // Chat events
  | { type: 'CHAT_MESSAGE_SENT'; userId: string; sessionId: string }
  | { type: 'CHAT_FEEDBACK'; userId: string; messageId: string; rating: 'up' | 'down' }
  
  // Candidate events
  | { type: 'CANDIDATE_VIEWED'; userId: string; candidateId: string }
  | { type: 'CANDIDATES_COMPARED'; userId: string; candidateIds: string[] }
  
  // Achievement events
  | { type: 'ACHIEVEMENT_EARNED'; userId: string; achievementId: string }
  
  // Election events
  | { type: 'ELECTION_PHASE_CHANGED'; electionId: string; newPhase: string }
  | { type: 'MCC_ACTIVATED'; electionId: string; states: string[] }
  
  // Bookmark events
  | { type: 'BOOKMARK_ADDED'; userId: string; resourceType: string; resourceId: string }
```

### 6.2 Event → Side Effect Map

| Event | Side Effects |
|-------|--------------|
| `WIZARD_COMPLETED` | Notify, Activity, Achievement check, Readiness recalc, Dashboard sync |
| `QUIZ_COMPLETED` | Notify, Activity, Achievement check, Leaderboard update |
| `BOOTH_LOCATED` | Notify, Activity, Profile update, Auto-bookmark, Readiness recalc |
| `CANDIDATE_VIEWED` | Activity (silent), Readiness check after 2 views |
| `ACHIEVEMENT_EARNED` | Notify (push + in-app), Activity, Profile badges |
| `ELECTION_PHASE_CHANGED` | Bulk notify users, Timeline update, AI context update |

### 6.3 Database Triggers (Supabase)

```sql
-- Centralized trigger registry

-- Trigger 1: Update readiness on progress change
CREATE TRIGGER trg_update_readiness
AFTER INSERT OR UPDATE ON user_progress
FOR EACH ROW EXECUTE FUNCTION recalculate_readiness();

-- Trigger 2: Award badges on quiz completion
CREATE TRIGGER trg_check_quiz_badges
AFTER INSERT ON quiz_attempts
FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();

-- Trigger 3: Activity feed entries
CREATE TRIGGER trg_activity_feed
AFTER INSERT OR UPDATE ON user_progress, quiz_attempts, bookmarks, chat_messages
FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Trigger 4: Notification on achievement
CREATE TRIGGER trg_notify_achievement
AFTER INSERT ON user_achievements
FOR EACH ROW EXECUTE FUNCTION send_achievement_notification();

-- Trigger 5: Auto-bookmark booth
CREATE TRIGGER trg_auto_bookmark_booth
AFTER UPDATE ON profiles
FOR EACH ROW 
WHEN (NEW.assigned_booth_id IS NOT NULL AND OLD.assigned_booth_id IS NULL)
EXECUTE FUNCTION auto_bookmark_booth();

-- Trigger 6: Streak tracking
CREATE TRIGGER trg_update_streak
AFTER INSERT ON quiz_attempts
FOR EACH ROW EXECUTE FUNCTION update_user_streak();
```

---

## 7. Database Cascade Rules

### 7.1 Foreign Key Cascade Map

| Parent Table | Child Tables | On Delete | On Update |
|-------------|-------------|-----------|-----------|
| `auth.users` | `profiles`, `chat_sessions`, `quiz_attempts`, `bookmarks`, `notifications`, `user_progress`, `user_election_journey`, `user_achievements` | CASCADE | CASCADE |
| `elections` | `election_phases`, `candidates`, `user_election_journey` | CASCADE | CASCADE |
| `constituencies` | `polling_booths`, `candidates`, `profiles.constituency_id` | RESTRICT | CASCADE |
| `chat_sessions` | `chat_messages` | CASCADE | CASCADE |
| `knowledge_documents` | `knowledge_chunks` | CASCADE | CASCADE |
| `quizzes` | `quiz_attempts` | RESTRICT | CASCADE |
| `achievements` | `user_achievements` | RESTRICT | CASCADE |

### 7.2 Soft Delete Strategy

For user data (GDPR/DPDP compliance), implement soft delete:

```sql
-- Add deleted_at to all user-owned tables
ALTER TABLE chat_sessions ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE quiz_attempts ADD COLUMN deleted_at TIMESTAMPTZ;
-- etc.

-- Update RLS policies to exclude deleted records
CREATE POLICY "Users see only own non-deleted data" 
ON chat_sessions FOR SELECT 
USING (user_id = auth.uid() AND deleted_at IS NULL);
```

---

## 8. API Endpoint Map

### 8.1 Endpoint → Feature Matrix

| Endpoint | Method | Feature | Reads | Writes |
|----------|--------|---------|-------|--------|
| `/api/auth/signup` | POST | F01 | — | profiles |
| `/api/auth/signin` | POST | F01 | profiles | sessions |
| `/api/onboarding/complete` | POST | F02 | — | profiles, journey |
| `/api/profile` | GET/PATCH | F01 | profiles | profiles |
| `/api/dashboard` | GET | F03 | profiles, journey, progress, recent activity | — |
| `/api/chat` | POST | F04 | profile, RAG | chat_messages |
| `/api/chat/sessions` | GET | F04 | chat_sessions | — |
| `/api/elections` | GET | F06 | elections | — |
| `/api/elections/[id]` | GET | F06 | elections, phases | — |
| `/api/guides` | GET | F08-F13 | guides | — |
| `/api/guides/[slug]/progress` | POST | F08-F13 | — | user_progress |
| `/api/quizzes` | GET | F14 | quizzes | — |
| `/api/quizzes/[id]/submit` | POST | F14 | quizzes | quiz_attempts |
| `/api/leaderboard` | GET | F15 | quiz_attempts, profiles | — |
| `/api/candidates` | GET | F17 | candidates | — |
| `/api/booths/search` | GET | F18 | polling_booths | — |
| `/api/booths/save` | POST | F18 | — | profiles |
| `/api/notifications` | GET | F19 | notifications | — |
| `/api/notifications/read` | POST | F19 | — | notifications |
| `/api/bookmarks` | GET/POST/DELETE | F20 | bookmarks | bookmarks |
| `/api/activity` | GET | F21 | activity_feed | — |
| `/api/search` | GET | F22 | All searchable | — |
| `/api/readiness` | GET | F23 | profile, progress, journey | — |
| `/api/cron/election-reminders` | POST | F19 | profiles, elections | notifications |
| `/api/cron/weekly-digest` | POST | F19 | activity_feed | — |
| `/api/cron/voter-list-deadline` | POST | F19 | profiles | notifications |
| `/api/cron/daily-quiz` | POST | F14 | — | notifications |

### 8.2 Cross-feature API Composition

For dashboard to load efficiently:

```typescript
// /api/dashboard/route.ts
// Composes data from multiple features in single request

GET /api/dashboard
  → Returns:
    {
      profile: { ... },        // F01
      readiness: { ... },      // F23
      journey: { ... },        // F23
      activity: [ ... ],       // F21 (last 5)
      notifications: [ ... ],  // F19 (last 5 unread)
      bookmarks: [ ... ],      // F20 (last 3)
      nextElection: { ... },   // F06
      dailyQuiz: { ... },      // F14
      suggestedAction: "..."   // F23 derived
    }
```

---

## 9. Realtime Subscription Map

| Subscriber | Channel | Filter | Action on Update |
|------------|---------|--------|------------------|
| Notification Bell (F19) | `notifications` | `user_id=eq.<uid>` | Increment badge, show toast |
| Dashboard Hero (F03) | `user_election_journey` | `user_id=eq.<uid>` | Update readiness display |
| Leaderboard (F15) | `quiz_attempts` | none (public) | Refresh top 10 |
| Activity Feed (F21) | `activity_feed` | `user_id=eq.<uid>` | Prepend new entry |
| Timeline (F06) | `elections` | `state=eq.<user_state>` | Update phase status |
| Chat (F04) | `chat_messages` | `session_id=eq.<sid>` | Sync across tabs |

### 9.1 Connection Management

```typescript
// /lib/realtime/subscriptions.ts

export function subscribeToUserUpdates(userId: string) {
  const channels = []
  
  // Notifications
  channels.push(
    supabase
      .channel('user-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        // Update notification store
        // Show toast
      })
      .subscribe()
  )
  
  // Journey updates
  channels.push(
    supabase
      .channel('user-journey')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_election_journey',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        // Update readiness display
      })
      .subscribe()
  )
  
  // Activity
  channels.push(
    supabase
      .channel('user-activity')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_feed',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        // Prepend to activity feed
      })
      .subscribe()
  )
  
  return () => {
    channels.forEach(ch => supabase.removeChannel(ch))
  }
}
```

---

## 10. Integration Test Coverage

For each connection in the matrix, list test status:

### 10.1 Critical Path Tests

| Test ID | From → To | Test Name | Status | File |
|---------|-----------|-----------|--------|------|
| IT-001 | F08 → F03 | Wizard completion updates dashboard | ✅ | `wizard-dashboard.test.ts` |
| IT-002 | F08 → F19 | Wizard step triggers notification | ✅ | `wizard-notification.test.ts` |
| IT-003 | F08 → F23 | Wizard updates readiness score | ✅ | `wizard-readiness.test.ts` |
| IT-004 | F08 → F16 | Wizard completion awards badge | ✅ | `wizard-achievement.test.ts` |
| IT-005 | F14 → F15 | Quiz completion updates leaderboard | ✅ | `quiz-leaderboard.test.ts` |
| IT-006 | F14 → F16 | Quiz score awards badges | ✅ | `quiz-achievement.test.ts` |
| IT-007 | F04 → F08 | Chat entity link opens wizard | ✅ | `chat-deeplink.test.ts` |
| IT-008 | F04 → F05 | Chat retrieves correct citations | ✅ | `chat-rag.test.ts` |
| IT-009 | F18 → F01 | Booth saves to profile | ✅ | `booth-profile.test.ts` |
| IT-010 | F18 → F23 | Booth located updates readiness | ✅ | `booth-readiness.test.ts` |
| IT-011 | F19 → F03 | Notification deep-links work | ✅ | `notification-deeplink.test.ts` |
| IT-012 | F06 → F19 | Phase change notifies users | ✅ | `phase-notification.test.ts` |
| IT-013 | F17 → F23 | Candidate views update readiness | ⚠️ | TODO |
| IT-014 | F20 → F03 | Bookmarks show on dashboard | ✅ | `bookmark-dashboard.test.ts` |
| IT-015 | F22 → All | Search finds content across features | ⚠️ | TODO |

### 10.2 Coverage Goals

| Connection Type | Coverage Target | Current |
|----------------|-----------------|---------|
| Critical paths | 100% | 87% |
| Bidirectional flows | 100% | 80% |
| Realtime subscriptions | 100% | 90% |
| Database triggers | 100% | 75% |
| Cross-feature deep links | 100% | 70% |

---

## 11. Known Gaps & TODOs

### 11.1 Missing Connections

| Gap ID | From | To | Description | Priority | Phase to Fix |
|--------|------|----|----|----------|--------------|
| GAP-01 | F17 | F23 | Candidate views don't update readiness | High | 9 |
| GAP-02 | F06 | F04 | AI doesn't know current phase context | High | 9 |
| GAP-03 | F22 | F21 | Search doesn't log to activity | Low | 11 |
| GAP-04 | F13 | F18 | PwD wizard doesn't suggest accessible booths | Medium | 9 |
| GAP-05 | F11 | F19 | Complaint wizard completion doesn't notify | Medium | 9 |

### 11.2 Performance Concerns

| Concern | Impact | Mitigation |
|---------|--------|------------|
| Dashboard makes 8+ DB queries | Slow page load | Implement single composed endpoint |
| Realtime subscriptions don't unsubscribe | Memory leak | Add cleanup on route change |
| AI chat loads full session history | Large payloads | Paginate older messages |
| Activity feed grows unbounded | Storage bloat | Archive after 90 days |

### 11.3 Future Enhancements

| Idea | Description | Phase |
|------|-------------|-------|
| Cross-user features | "Your friends voted" social proof | Future |
| AI proactive suggestions | "Hey, you haven't found your booth yet" | Future |
| Voice navigation | Voice commands for accessibility | Future |
| Collaborative features | Family voting plan sharing | Future |

---

## 📋 How to Use This Document

### For Developers

1. **Before adding a new feature:** Check this matrix to understand existing connections
2. **When modifying a feature:** Update the matrix to reflect new connections
3. **When debugging:** Trace data flow through the connection map
4. **For code reviews:** Verify new code maintains documented connections

### For QA Engineers

1. **Test planning:** Use Section 10 to identify untested connections
2. **Regression testing:** Verify all matrix connections after changes
3. **Bug reports:** Reference specific connection IDs (e.g., "GAP-01")

### For Product Managers

1. **Feature impact analysis:** See Section 3 for what changes when modifying a feature
2. **Roadmap planning:** Use Section 11 to prioritize gaps
3. **User journey design:** Reference Section 5 for current flows

### For New Team Members

1. **Start with Section 1** to understand all features
2. **Read Section 2** for the high-level architecture
3. **Deep-dive Section 4** for the features you'll work on
4. **Bookmark Section 6** for event handling patterns

---

## 🔄 Maintenance Schedule

| Frequency | Action | Owner |
|-----------|--------|-------|
| Per PR | Update if connections change | Developer |
| Weekly | Review Section 10 (test coverage) | Tech Lead |
| Monthly | Review Section 11 (gaps) | Product + Engineering |
| Quarterly | Full audit of all sections | Engineering Lead |
| Pre-launch | 100% verification of all connections | Entire team |

---

**Document Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial creation |
| 1.1 | [Date] | [Name] | Added Phase 9 connections |
