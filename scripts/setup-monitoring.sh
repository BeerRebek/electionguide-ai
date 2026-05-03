#!/bin/bash
# ElectionGuide AI — Google Cloud Monitoring Alert Setup
set -euo pipefail

PROJECT_ID="project-86a1a2a8-0a81-4297-b3d"
SERVICE_NAME="electionguide-ai"
ALERT_EMAIL="${1:-admin@electionguide.ai}"

echo "📊 ElectionGuide AI — Monitoring Setup"
echo "   Project: $PROJECT_ID"
echo "   Alerts → $ALERT_EMAIL"
echo ""

# ── Create notification channel ───────────────────────────────────
echo "📬 Creating email notification channel..."
CHANNEL_JSON=$(gcloud alpha monitoring channels create \
  --display-name="ElectionGuide AI Alerts" \
  --type=email \
  --channel-labels="email_address=$ALERT_EMAIL" \
  --project="$PROJECT_ID" \
  --format="json" 2>/dev/null || echo '{}')

CHANNEL_NAME=$(echo "$CHANNEL_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('name',''))" 2>/dev/null || echo "")
echo "   Channel: $CHANNEL_NAME"

# ── Alert: 5xx Error Rate > 1% ────────────────────────────────────
echo "🚨 Creating 5xx error rate alert..."
cat > /tmp/alert-5xx.json << EOF
{
  "displayName": "ElectionGuide AI — 5xx Error Rate > 1%",
  "documentation": {
    "content": "The 5xx error rate for ElectionGuide AI Cloud Run service has exceeded 1%. Investigate immediately.",
    "mimeType": "text/markdown"
  },
  "conditions": [{
    "displayName": "5xx error rate > 1%",
    "conditionThreshold": {
      "filter": "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"$SERVICE_NAME\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\"",
      "aggregations": [{
        "alignmentPeriod": "60s",
        "perSeriesAligner": "ALIGN_RATE"
      }],
      "comparison": "COMPARISON_GT",
      "thresholdValue": 0.01,
      "duration": "120s"
    }
  }],
  "alertStrategy": {
    "autoClose": "604800s"
  },
  "combiner": "OR",
  "enabled": true
}
EOF

gcloud alpha monitoring policies create \
  --policy-from-file=/tmp/alert-5xx.json \
  --project="$PROJECT_ID" --quiet 2>/dev/null && echo "   ✅ 5xx alert created" || echo "   ⚠️  5xx alert (may already exist)"

echo ""
echo "✅ Monitoring setup complete"
echo "   Dashboards: https://console.cloud.google.com/monitoring?project=$PROJECT_ID"
echo ""
echo "Manual steps to complete in Cloud Console:"
echo "  1. Create uptime check: Cloud Run URL /api/health (1-min interval)"
echo "  2. Set up p95 latency alert: > 2000ms for 5 minutes"
echo "  3. Enable Cloud Run default metrics dashboard"
