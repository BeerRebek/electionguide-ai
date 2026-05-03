#!/bin/bash
# ElectionGuide AI — Cloud Run Deployment Script
set -euo pipefail

PROJECT_ID="project-86a1a2a8-0a81-4297-b3d"
SERVICE_NAME="electionguide-ai"
REGION_PRIMARY="asia-south1"
REGION_FAILOVER="asia-south2"
REGISTRY="asia-south1-docker.pkg.dev"
REPO_NAME="electionguide-ai"
IMAGE_TAG="$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')"
IMAGE_URL="$REGISTRY/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:$IMAGE_TAG"

echo "🚀 ElectionGuide AI — Cloud Run Deployment"
echo "   Project: $PROJECT_ID | Image: $IMAGE_URL"

# Enable APIs
echo "📡 Enabling APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  secretmanager.googleapis.com cloudbuild.googleapis.com \
  cloudscheduler.googleapis.com --project="$PROJECT_ID" --quiet

# Create Artifact Registry repo
gcloud artifacts repositories create "$REPO_NAME" \
  --repository-format=docker --location="$REGION_PRIMARY" \
  --project="$PROJECT_ID" --quiet 2>/dev/null || true

# Auth Docker
gcloud auth configure-docker "$REGION_PRIMARY-docker.pkg.dev" --quiet

# Build image (NEXT_PUBLIC vars read from Secret Manager at build time)
echo "🐳 Building Docker image..."
docker build -t "$IMAGE_URL" -t "$REGISTRY/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:latest" .

# Push image
echo "📤 Pushing to Artifact Registry..."
docker push "$IMAGE_URL"
docker push "$REGISTRY/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:latest"

SECRETS="NEXT_PUBLIC_SUPABASE_URL=NEXT_PUBLIC_SUPABASE_URL:latest,\
NEXT_PUBLIC_SUPABASE_ANON_KEY=NEXT_PUBLIC_SUPABASE_ANON_KEY:latest,\
SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,\
GEMINI_API_KEY=GEMINI_API_KEY:latest,\
NEXT_PUBLIC_GOOGLE_MAPS_KEY=NEXT_PUBLIC_GOOGLE_MAPS_KEY:latest,\
CRON_SECRET=CRON_SECRET:latest,\
VAPID_PUBLIC_KEY=VAPID_PUBLIC_KEY:latest,\
VAPID_PRIVATE_KEY=VAPID_PRIVATE_KEY:latest"

# Deploy Primary (Mumbai)
echo "🌏 Deploying to asia-south1 (Mumbai)..."
gcloud run deploy "$SERVICE_NAME" --image="$IMAGE_URL" \
  --region="$REGION_PRIMARY" --project="$PROJECT_ID" \
  --platform=managed --allow-unauthenticated \
  --min-instances=1 --max-instances=100 \
  --memory=2Gi --cpu=2 --concurrency=80 --timeout=60 --port=8080 \
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,VAPID_SUBJECT=mailto:admin@electionguide.ai" \
  --set-secrets="$SECRETS" --quiet

PRIMARY_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --region="$REGION_PRIMARY" --project="$PROJECT_ID" --format="value(status.url)")
echo "   ✅ Primary: $PRIMARY_URL"

# Deploy Failover (Delhi)
echo "🌏 Deploying to asia-south2 (Delhi)..."
gcloud run deploy "$SERVICE_NAME" --image="$IMAGE_URL" \
  --region="$REGION_FAILOVER" --project="$PROJECT_ID" \
  --platform=managed --allow-unauthenticated \
  --min-instances=1 --max-instances=50 \
  --memory=2Gi --cpu=2 --concurrency=80 --timeout=60 --port=8080 \
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
  --set-secrets="$SECRETS" --quiet

FAILOVER_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --region="$REGION_FAILOVER" --project="$PROJECT_ID" --format="value(status.url)")
echo "   ✅ Failover: $FAILOVER_URL"

# Smoke tests
echo "🔍 Running smoke tests on $PRIMARY_URL..."
sleep 5
for EP in "/" "/api/health" "/disclaimer" "/privacy-policy"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRIMARY_URL$EP" || echo "000")
  echo "   $EP → $STATUS"
done

echo ""
echo "══════════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETE"
echo "   Primary  : $PRIMARY_URL"
echo "   Failover : $FAILOVER_URL"
echo "   Health   : $PRIMARY_URL/api/health"
echo "   Console  : https://console.cloud.google.com/run?project=$PROJECT_ID"
echo ""
echo "Next steps:"
echo "  bash scripts/setup-secrets.sh       # Store secrets in Secret Manager"
echo "  bash scripts/setup-monitoring.sh    # Configure alerts"
echo "  bash scripts/setup-cloud-scheduler.sh  # Set up cron jobs"
echo "══════════════════════════════════════════════"
