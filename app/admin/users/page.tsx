"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/client";
import { ROLE_LABELS, ROLE_COLORS, type UserRole } from "@/lib/admin/rbac";

interface UserProfile {
  id: string;
  full_name: string | null;
  role: UserRole;
  language_pref: string;
  state: string | null;
  onboarded: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("admin");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    // Get current user role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: myProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (myProfile) setCurrentUserRole(myProfile.role as UserRole);
    }

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, role, language_pref, state, onboarded, created_at")
      .order("created_at", { ascending: false });

    setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    setChangingRole(userId);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      alert(`Failed to update role: ${error.message}`);
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setChangingRole(null);
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminSidebar />

      <main className="lg:ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            View and manage {users.length} registered users
          </p>
        </div>

        {/* Role summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {(["user", "content_manager", "admin", "super_admin", "moderator"] as UserRole[]).map((r) => {
            const style = ROLE_COLORS[r];
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(roleFilter === r ? "all" : r)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  roleFilter === r
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className="text-lg font-bold text-on-surface">{roleCounts[r] || 0}</p>
                <p className={`text-xs font-medium ${style.text}`}>{ROLE_LABELS[r]}</p>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Users table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">State</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Onboarded</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                  {currentUserRole === "super_admin" && (
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
                      <p className="mt-2 text-sm">Loading users...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <span className="material-symbols-outlined text-[32px]">person_off</span>
                      <p className="mt-2 text-sm">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const roleStyle = ROLE_COLORS[user.role];
                    return (
                      <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {(user.full_name || "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-on-surface">
                                {user.full_name || "Unnamed User"}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">{user.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${roleStyle.bg} ${roleStyle.text}`}>
                            {ROLE_LABELS[user.role]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-on-surface-variant">{user.state || "—"}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`material-symbols-outlined text-[18px] ${user.onboarded ? "text-green-500" : "text-slate-300"}`}>
                            {user.onboarded ? "check_circle" : "radio_button_unchecked"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-slate-400">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        {currentUserRole === "super_admin" && (
                          <td className="py-3 px-4 text-center">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                              disabled={changingRole === user.id}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-primary disabled:opacity-50"
                            >
                              <option value="user">Citizen</option>
                              <option value="content_manager">Content Mgr</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
