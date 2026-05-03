#!/usr/bin/env bash
# scripts/setup-cloud-scheduler.sh
# ─────────────────────────────────────────────────────────────────────────────
# Sets up GCP Cloud Scheduler jobs for ElectionGuide AI CRON endpoints.
# Prerequisites:
#   - gcloud CLI authenticated: gcloud auth login
#   - Project set: gcloud config set project YOUR_PROJECT_ID
#   - Cloud Scheduler API enabled: gcloud services enable cloudscheduler.googleapis.com
#
# Usage:
#   CRON_SECRET=your_secret APP_URL=https://electionguide.ai bash scripts/setup-cloud-scheduler.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

APP_URL="${APP_URL:-https://electionguide.ai}"
CRON_SECRET="${CRON_SECRET:?CRON_SECRET env var is required}"
REGION="${GCP_REGION:-asia-south1}"  # Mumbai region for IST latency

echo "🚀 Setting up Cloud Scheduler for: $APP_URL"
echo "   Region: $REGION"
echo ""

# ── Helper: create or update a job ───────────────────────────────────────────
create_or_update_job() {
  local name="$1"
  local schedule="$2"
  local url="$3"
  local description="$4"

  if gcloud scheduler jobs describe "$name" --location="$REGION" &>/dev/null; then
    echo "↻  Updating: $name"
    gcloud scheduler jobs update http "$name" \
      --location="$REGION" \
      --schedule="$schedule" \
      --uri="$url" \
      --http-method=GET \
      --headers="Authorization=Bearer $CRON_SECRET,Content-Type=application/json" \
      --time-zone="Asia/Kolkata" \
      --attempt-deadline=300s \
      --description="$description"
  else
    echo "✚  Creating: $name"
    gcloud scheduler jobs create http "$name" \
      --location="$REGION" \
      --schedule="$schedule" \
      --uri="$url" \
      --http-method=GET \
      --headers="Authorization=Bearer $CRON_SECRET,Content-Type=application/json" \
      --time-zone="Asia/Kolkata" \
      --attempt-deadline=300s \
      --description="$description"
  fi
}

# ── Job 1: Daily Election Reminders (9:00 AM IST) ────────────────────────────
create_or_update_job \
  "electionguide-daily-reminders" \
  "0 9 * * *" \
  "$APP_URL/api/cron/election-reminders" \
  "Daily election reminders for upcoming polling phases"

# ── Job 2: Phase Checker (every 6 hours) ─────────────────────────────────────
create_or_update_job \
  "electionguide-phase-checker" \
  "0 */6 * * *" \
  "$APP_URL/api/cron/election-phase-checker" \
  "Periodic check for new election phases and status updates"

# ── Job 3: Weekly Digest (Monday 9:00 AM IST) ────────────────────────────────
create_or_update_job \
  "electionguide-weekly-digest" \
  "0 9 * * 1" \
  "$APP_URL/api/cron/weekly-digest" \
  "Weekly quiz performance digest for opted-in users"

echo ""
echo "✅ All Cloud Scheduler jobs configured!"
echo ""
echo "📋 Verify jobs:"
gcloud scheduler jobs list --location="$REGION" --filter="name~electionguide"

echo ""
echo "🧪 Test a job manually:"
echo "   gcloud scheduler jobs run electionguide-daily-reminders --location=$REGION"
