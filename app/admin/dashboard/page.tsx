"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalUsers: number;
  totalDocuments: number;
  totalChunks: number;
  totalSessions: number;
  recentSignups: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDocuments: 0,
    totalChunks: 0,
    totalSessions: 0,
    recentSignups: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [users, docs, chunks, sessions] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("knowledge_documents").select("id", { count: "exact", head: true }),
        supabase.from("knowledge_chunks").select("id", { count: "exact", head: true }),
        supabase.from("chat_sessions").select("id", { count: "exact", head: true }),
      ]);

      // Recent signups (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: recentCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo);

      setStats({
        totalUsers: users.count || 0,
        totalDocuments: docs.count || 0,
        totalChunks: chunks.count || 0,
        totalSessions: sessions.count || 0,
        recentSignups: recentCount || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "group", color: "bg-blue-500", trend: `+${stats.recentSignups} this week` },
    { label: "Documents", value: stats.totalDocuments, icon: "description", color: "bg-green-500", trend: "Knowledge base" },
    { label: "Chunks", value: stats.totalChunks, icon: "data_array", color: "bg-purple-500", trend: "Embeddings indexed" },
    { label: "Chat Sessions", value: stats.totalSessions, icon: "forum", color: "bg-amber-500", trend: "AI conversations" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminSidebar />

      <main className="lg:ml-64 p-6">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-on-surface">Admin Dashboard</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Overview of your ElectionGuide AI platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-white text-[20px]">
                    {card.icon}
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-on-surface">
                {loading ? (
                  <span className="inline-block w-12 h-7 bg-slate-200 rounded animate-pulse" />
                ) : (
                  card.value.toLocaleString()
                )}
              </p>
              <p className="text-sm text-on-surface-variant mt-1">{card.label}</p>
              <p className="text-xs text-slate-400 mt-2">{card.trend}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bolt</span>
              Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { label: "Manage Documents", href: "/admin/documents", icon: "description", desc: "Upload, edit, or delete knowledge base documents" },
                { label: "View Users", href: "/admin/users", icon: "group", desc: "Manage user accounts and roles" },
                { label: "Audit Log", href: "/admin/audit", icon: "history", desc: "View admin action history" },
              ].map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      {action.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">{action.label}</p>
                    <p className="text-xs text-on-surface-variant">{action.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-[18px] transition-colors">
                    arrow_forward
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              System Status
            </h2>
            <div className="space-y-3">
              {[
                { label: "Supabase Connection", status: "Healthy", color: "bg-green-500" },
                { label: "Gemini AI API", status: "Active", color: "bg-green-500" },
                { label: "Knowledge Base", status: `${stats.totalDocuments} docs indexed`, color: "bg-blue-500" },
                { label: "Authentication", status: "Email provider active", color: "bg-green-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-on-surface">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-on-surface-variant">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
