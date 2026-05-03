-- ══════════════════════════════════════════════════════════════
-- ElectionGuide AI — Admin RBAC Migration
-- Run in Supabase SQL Editor after 005_ai_usage_logs.sql
-- ══════════════════════════════════════════════════════════════

-- 1. Expand role values to include content_manager and super_admin
-- Drop old constraint and add new one
DO $$ BEGIN
  ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('user', 'content_manager', 'admin', 'super_admin', 'moderator'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 2. Admin Permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  permission TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (role, permission)
);

-- Seed permissions
INSERT INTO public.admin_permissions (role, permission, description) VALUES
  -- content_manager permissions
  ('content_manager', 'edit_guides', 'Edit and publish voter guides'),
  ('content_manager', 'edit_faqs', 'Manage FAQ content'),
  ('content_manager', 'manage_documents', 'Upload/delete knowledge base documents'),
  ('content_manager', 'view_analytics', 'View content analytics'),
  -- admin permissions (inherits content_manager)
  ('admin', 'edit_guides', 'Edit and publish voter guides'),
  ('admin', 'edit_faqs', 'Manage FAQ content'),
  ('admin', 'manage_documents', 'Upload/delete knowledge base documents'),
  ('admin', 'view_analytics', 'View all analytics and reports'),
  ('admin', 'manage_users', 'View and manage user accounts'),
  ('admin', 'moderate_content', 'Moderate user-generated content'),
  ('admin', 'send_notifications', 'Send push notifications to users'),
  ('admin', 'manage_quizzes', 'Create and manage quiz questions'),
  -- super_admin permissions (inherits admin)
  ('super_admin', 'edit_guides', 'Edit and publish voter guides'),
  ('super_admin', 'edit_faqs', 'Manage FAQ content'),
  ('super_admin', 'manage_documents', 'Upload/delete knowledge base documents'),
  ('super_admin', 'view_analytics', 'View all analytics and reports'),
  ('super_admin', 'manage_users', 'View and manage user accounts'),
  ('super_admin', 'moderate_content', 'Moderate user-generated content'),
  ('super_admin', 'send_notifications', 'Send push notifications to users'),
  ('super_admin', 'manage_quizzes', 'Create and manage quiz questions'),
  ('super_admin', 'manage_roles', 'Change user roles'),
  ('super_admin', 'manage_admins', 'Create and manage admin accounts'),
  ('super_admin', 'system_settings', 'Modify system-wide settings')
ON CONFLICT (role, permission) DO NOTHING;

-- 3. Admin Audit Logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin_date
  ON public.admin_audit_logs (admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action_date
  ON public.admin_audit_logs (action, created_at DESC);

-- 4. Helper functions

-- Check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = check_user_id
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = check_user_id
    AND role = 'super_admin'
  );
$$;

-- Check specific permission
CREATE OR REPLACE FUNCTION public.has_permission(check_user_id UUID, check_permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    JOIN public.profiles p ON p.role = ap.role
    WHERE p.id = check_user_id
    AND ap.permission = check_permission
  );
$$;

-- Get user role
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = check_user_id;
$$;

-- 5. RLS Policies

-- Admin permissions: readable by authenticated
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Authenticated can read permissions" ON public.admin_permissions
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Audit logs: super_admin sees all, admin sees own
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Super admin sees all audit logs" ON public.admin_audit_logs
    FOR SELECT USING (public.is_super_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins see own audit logs" ON public.admin_audit_logs
    FOR SELECT USING (
      public.is_admin(auth.uid()) AND admin_id = auth.uid()
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Profiles: admins can view all profiles
DO $$ BEGIN
  CREATE POLICY "Admins view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 6. Role change trigger for audit logging
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.admin_audit_logs (admin_id, action, target_type, target_id, details)
    VALUES (
      auth.uid(),
      'role_changed',
      'user',
      NEW.id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid()
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_log_role_change ON public.profiles;
CREATE TRIGGER trigger_log_role_change
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();

-- 7. Verify
SELECT 'Migration 006 RBAC complete!' AS status;
