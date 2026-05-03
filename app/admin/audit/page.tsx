"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/client";

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

const ACTION_ICONS: Record<string, { icon: string; color: string }> = {
  role_changed: { icon: "manage_accounts", color: "text-purple-600 bg-purple-50" },
  document_uploaded: { icon: "upload_file", color: "text-blue-600 bg-blue-50" },
  document_deleted: { icon: "delete", color: "text-red-600 bg-red-50" },
  user_banned: { icon: "block", color: "text-red-600 bg-red-50" },
  settings_updated: { icon: "settings", color: "text-slate-600 bg-slate-50" },
  default: { icon: "history", color: "text-slate-600 bg-slate-50" },
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (actionFilter !== "all") {
      query = query.eq("action", actionFilter);
    }

    const { data } = await query;
    setLogs(data || []);
    setLoading(false);
  }, [actionFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminSidebar />

      <main className="lg:ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-on-surface">Audit Log</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Track all administrative actions across the platform
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "role_changed", "document_uploaded", "document_deleted", "settings_updated"].map((action) => (
            <button
              key={action}
              onClick={() => setActionFilter(action)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                actionFilter === action
                  ? "bg-primary text-on-primary"
                  : "bg-white border border-slate-200 text-on-surface-variant hover:border-primary"
              }`}
            >
              {action === "all" ? "All Actions" : action.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Log entries */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
              <p className="mt-2 text-sm">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-[32px]">receipt_long</span>
              <p className="mt-2 text-sm">No audit logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => {
                const { icon, color } = ACTION_ICONS[log.action] || ACTION_ICONS.default;
                return (
                  <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface">
                        {log.action.replace(/_/g, " ")}
                        {log.target_type && (
                          <span className="text-on-surface-variant font-normal"> on {log.target_type}</span>
                        )}
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <pre className="text-[11px] text-slate-400 mt-1 font-mono bg-slate-50 rounded px-2 py-1 max-w-md truncate">
                          {JSON.stringify(log.details)}
                        </pre>
                      )}
                      <p className="text-[11px] text-slate-400 mt-1">
                        Admin: {log.admin_id.slice(0, 8)}... • {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
