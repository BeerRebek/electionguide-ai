#!/bin/bash
# ElectionGuide AI — Store all secrets in Google Secret Manager
set -euo pipefail

PROJECT_ID="project-86a1a2a8-0a81-4297-b3d"

echo "🔐 ElectionGuide AI — Secret Manager Setup"
echo "   Project: $PROJECT_ID"
echo ""

# Source .env.local for values
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | xargs)
  echo "✅ Loaded .env.local"
else
  echo "❌ .env.local not found. Run from project root."
  exit 1
fi

create_or_update_secret() {
  local NAME="$1"
  local VALUE="$2"

  if [ -z "$VALUE" ]; then
    echo "   ⚠️  Skipping $NAME (empty value)"
    return
  fi

  if gcloud secrets describe "$NAME" --project="$PROJECT_ID" &>/dev/null; then
    echo -n "$VALUE" | gcloud secrets versions add "$NAME" \
      --data-file=- --project="$PROJECT_ID" --quiet
    echo "   🔄 Updated: $NAME"
  else
    echo -n "$VALUE" | gcloud secrets create "$NAME" \
      --data-file=- --project="$PROJECT_ID" --quiet
    echo "   ✅ Created: $NAME"
  fi
}

# Store all secrets
create_or_update_secret "NEXT_PUBLIC_SUPABASE_URL"    "${NEXT_PUBLIC_SUPABASE_URL:-}"
create_or_update_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"
create_or_update_secret "SUPABASE_SERVICE_ROLE_KEY"   "${SUPABASE_SERVICE_ROLE_KEY:-}"
create_or_update_secret "GEMINI_API_KEY"              "${GEMINI_API_KEY:-}"
create_or_update_secret "NEXT_PUBLIC_GOOGLE_MAPS_KEY" "${NEXT_PUBLIC_GOOGLE_MAPS_KEY:-}"
create_or_update_secret "CRON_SECRET"                 "${CRON_SECRET:-}"
create_or_update_secret "VAPID_PUBLIC_KEY"            "${VAPID_PUBLIC_KEY:-}"
create_or_update_secret "VAPID_PRIVATE_KEY"           "${VAPID_PRIVATE_KEY:-}"

echo ""
echo "✅ All secrets stored in Secret Manager"
echo "   View: https://console.cloud.google.com/security/secret-manager?project=$PROJECT_ID"
