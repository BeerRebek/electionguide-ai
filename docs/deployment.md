# ElectionGuide AI — Deployment Guide

> Last updated: May 2025

## Prerequisites

- Node.js 20+
- Docker Desktop
- Google Cloud SDK (`gcloud`)
- GitHub repository connected to GCP

---

## Local Development

```bash
# Clone and install
git clone https://github.com/YOUR_ORG/electionguide-ai.git
cd electionguide-ai
npm install

# Copy env file and fill in your values
cp .env.local.example .env.local

# Start development server
npm run dev
# Open http://localhost:3000
```

---

## Environment Variables

All secrets are managed via **Google Secret Manager** in production. For local development, copy `.env.local.example` to `.env.local`.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role (server-only) |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | ✅ | Google Maps JavaScript API key |
| `CRON_SECRET` | ✅ | Secret for Cloud Scheduler cron calls |
| `VAPID_PUBLIC_KEY` | ✅ | Web Push VAPID public key |
| `VAPID_PRIVATE_KEY` | ✅ | Web Push VAPID private key |

---

## Database Setup (Supabase)

Run migrations in order:

```bash
# Apply all migrations to your Supabase project
# Go to: Supabase Dashboard → SQL Editor
# Run each file in supabase/migrations/ in sequence (001 → 009)
```

Migrations available:
- `001_initial_schema.sql` — core tables
- `002_rls_policies.sql` — Row Level Security
- `003_quiz_schema.sql` — quiz system
- `004_notifications.sql` — push notifications
- `005_election_phases.sql` — admin election calendar
- `006_chat_history.sql` — conversation persistence
- `007_leaderboard.sql` — scoring system
- `008_admin_roles.sql` — admin access control
- `009_notifications_realtime.sql` — realtime channels

---

## Docker Build (Local)

```bash
# Build production image
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="your-url" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key" \
  -t electionguide-ai:local .

# Test locally
docker run -p 8080:8080 \
  -e GEMINI_API_KEY="your-key" \
  -e SUPABASE_SERVICE_ROLE_KEY="your-key" \
  electionguide-ai:local

# Open http://localhost:8080
```

---

## Google Cloud Run Deployment

### 1. One-Time Setup

```bash
# Set project
gcloud config set project project-86a1a2a8-0a81-4297-b3d

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  cloudscheduler.googleapis.com

# Create Artifact Registry repository
gcloud artifacts repositories create electionguide-ai \
  --repository-format=docker \
  --location=asia-south1

# Create Service Account for GitHub Actions
gcloud iam service-accounts create github-actions-deploy \
  --display-name="GitHub Actions Deploy"

# Grant permissions
gcloud projects add-iam-policy-binding project-86a1a2a8-0a81-4297-b3d \
  --member="serviceAccount:github-actions-deploy@project-86a1a2a8-0a81-4297-b3d.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding project-86a1a2a8-0a81-4297-b3d \
  --member="serviceAccount:github-actions-deploy@project-86a1a2a8-0a81-4297-b3d.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding project-86a1a2a8-0a81-4297-b3d \
  --member="serviceAccount:github-actions-deploy@project-86a1a2a8-0a81-4297-b3d.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding project-86a1a2a8-0a81-4297-b3d \
  --member="serviceAccount:github-actions-deploy@project-86a1a2a8-0a81-4297-b3d.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Generate key for GitHub Secrets
gcloud iam service-accounts keys create github-sa-key.json \
  --iam-account=github-actions-deploy@project-86a1a2a8-0a81-4297-b3d.iam.gserviceaccount.com
```

### 2. Store Secrets in Secret Manager

```bash
# Run the setup script
bash scripts/setup-secrets.sh
```

Or manually:

```bash
for SECRET_NAME in \
  NEXT_PUBLIC_SUPABASE_URL \
  NEXT_PUBLIC_SUPABASE_ANON_KEY \
  SUPABASE_SERVICE_ROLE_KEY \
  GEMINI_API_KEY \
  NEXT_PUBLIC_GOOGLE_MAPS_KEY \
  CRON_SECRET \
  VAPID_PUBLIC_KEY \
  VAPID_PRIVATE_KEY; do
  echo -n "Enter value for $SECRET_NAME: "
  read -s VALUE
  echo ""
  echo -n "$VALUE" | gcloud secrets create "$SECRET_NAME" --data-file=-
done
```

### 3. GitHub Secrets Required

Add these to your GitHub repository → Settings → Secrets:

| Secret | Value |
|---|---|
| `GCP_PROJECT_ID` | `project-86a1a2a8-0a81-4297-b3d` |
| `GCP_SA_KEY` | Contents of `github-sa-key.json` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Your Maps API key |
| `GCP_PROJECT_HASH` | Cloud Run URL hash (from first deploy) |

### 4. First Deployment

```bash
# Manual first deployment (subsequent ones via CI/CD)
bash scripts/deploy-cloudrun.sh
```

### 5. Verify Deployment

```bash
# Check service status
gcloud run services describe electionguide-ai --region=asia-south1

# Test health endpoint
curl https://YOUR-SERVICE-URL/api/health

# View logs
gcloud logs read --service=electionguide-ai --region=asia-south1 --limit=50
```

---

## CI/CD Pipeline

The `.github/workflows/deploy.yml` pipeline runs automatically:

1. **On every PR**: TypeScript check + ESLint + build validation + security audit
2. **On merge to main**: Docker build → push to Artifact Registry → staging deploy
3. **Manual approval**: Production deploy (via GitHub Environments)
4. **On failure**: Auto-rollback to previous revision

---

## Cloud Scheduler (Cron Jobs)

```bash
# Set up scheduled jobs
bash scripts/setup-cloud-scheduler.sh

# Jobs configured:
# - /api/cron/send-notifications — daily at 8 AM IST
# - /api/cron/cleanup — weekly Sunday 2 AM IST
```

---

## Rollback

```bash
# List revisions
gcloud run revisions list --service=electionguide-ai --region=asia-south1

# Route 100% traffic to previous revision
gcloud run services update-traffic electionguide-ai \
  --region=asia-south1 \
  --to-revisions=REVISION_NAME=100
```

---

## Monitoring

Access dashboards at:
- **Cloud Console**: https://console.cloud.google.com/run?project=project-86a1a2a8-0a81-4297-b3d
- **Health endpoint**: `https://your-domain/api/health`
- **Logs**: `gcloud logs read --service=electionguide-ai`
