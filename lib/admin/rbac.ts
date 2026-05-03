import { createClient } from "@/lib/supabase/client";

export type UserRole = "user" | "content_manager" | "admin" | "super_admin" | "moderator";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  moderator: 1,
  content_manager: 2,
  admin: 3,
  super_admin: 4,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "Citizen",
  moderator: "Moderator",
  content_manager: "Content Manager",
  admin: "Administrator",
  super_admin: "Super Admin",
};

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  user: { bg: "bg-slate-100", text: "text-slate-700" },
  moderator: { bg: "bg-amber-100", text: "text-amber-800" },
  content_manager: { bg: "bg-blue-100", text: "text-blue-800" },
  admin: { bg: "bg-purple-100", text: "text-purple-800" },
  super_admin: { bg: "bg-red-100", text: "text-red-800" },
};

/**
 * Check if a role has admin-level access (admin or super_admin)
 */
export function isAdminRole(role: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.admin;
}

/**
 * Check if a role has content management access
 */
export function hasContentAccess(role: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.content_manager;
}

/**
 * Get current user's role from Supabase
 */
export async function getCurrentUserRole(): Promise<{ role: UserRole; userId: string } | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile ? { role: profile.role as UserRole, userId: user.id } : null;
}

/**
 * Log an admin action to the audit log
 */
export async function logAdminAction(params: {
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("admin_audit_logs").insert({
    admin_id: user.id,
    action: params.action,
    target_type: params.targetType || null,
    target_id: params.targetId || null,
    details: params.details || {},
  });
}

/**
 * Admin navigation items based on role
 */
export function getAdminNavItems(role: UserRole) {
  const items = [
    { icon: "dashboard", label: "Dashboard", href: "/admin/dashboard", minRole: "admin" as UserRole },
    { icon: "description", label: "Documents", href: "/admin/documents", minRole: "content_manager" as UserRole },
    { icon: "how_to_vote", label: "Elections", href: "/admin/elections", minRole: "content_manager" as UserRole },
    { icon: "memory", label: "EVM Content", href: "/admin/evm-content", minRole: "content_manager" as UserRole },
    { icon: "group", label: "Users", href: "/admin/users", minRole: "admin" as UserRole },
    { icon: "quiz", label: "Quizzes", href: "/admin/quizzes", minRole: "content_manager" as UserRole },
    { icon: "analytics", label: "Analytics", href: "/admin/analytics", minRole: "admin" as UserRole },
    { icon: "shield", label: "Audit Log", href: "/admin/audit", minRole: "super_admin" as UserRole },
    { icon: "settings", label: "Settings", href: "/admin/settings", minRole: "super_admin" as UserRole },
  ];

  return items.filter((item) => ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[item.minRole]);
}
