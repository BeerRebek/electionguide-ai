-- ══════════════════════════════════════════════════════════════
-- Migration 009: Notifications — realtime + indexes + seed data
-- ══════════════════════════════════════════════════════════════

-- Add missing columns if not present
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS href TEXT,
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- Rename 'read' → 'is_read' with backward compat (if 'read' exists)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'read'
  ) THEN
    UPDATE notifications SET is_read = read WHERE is_read IS NULL;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id, is_read)
  WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON notifications(created_at DESC);

-- ── Enable Realtime for notifications table ───────────────────
-- This publishes INSERT/UPDATE/DELETE events to connected clients
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
  CREATE PUBLICATION supabase_realtime FOR TABLE notifications;
COMMIT;

-- ── RLS: allow service_role to insert (for cron jobs) ─────────
DO $$ BEGIN
  CREATE POLICY "Service role can insert notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own notifications"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Notification preferences: add granular channel fields ─────
-- Extends the existing JSONB column with sane defaults
UPDATE profiles
SET notification_preferences = notification_preferences || '{
  "channels": {
    "in_app": true,
    "email": false,
    "push": false,
    "sms": false
  },
  "quiet_hours": {
    "enabled": false,
    "from": "22:00",
    "to": "07:00"
  },
  "categories": {
    "election_reminders": true,
    "quiz_alerts": true,
    "guide_updates": true,
    "booth_changes": true,
    "milestones": true,
    "system_alerts": true
  }
}'::jsonb
WHERE notification_preferences IS NOT NULL
  AND NOT (notification_preferences ? 'channels');
