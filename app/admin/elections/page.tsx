"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { createClient } from "@/lib/supabase/client";
import { logAdminAction } from "@/lib/admin/rbac";

interface Election {
  id: string;
  title: string;
  type: string;
  state: string | null;
  year: number;
  status: string;
  notification_date: string | null;
  polling_start: string | null;
  polling_end: string | null;
  result_date: string | null;
  election_phases?: Array<{
    id: string;
    phase_number: number;
    polling_date: string;
  }>;
}

function ElectionsContent() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newElection, setNewElection] = useState({
    title: "",
    type: "lok_sabha",
    state: "",
    year: new Date().getFullYear(),
    status: "upcoming",
  });

  useEffect(() => {
    fetchElections();
  }, []);

  async function fetchElections() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("elections")
      .select(`
        id, title, type, state, year, status,
        notification_date, polling_start, polling_end, result_date,
        election_phases (id, phase_number, polling_date)
      `)
      .order("year", { ascending: false });

    if (!error && data) {
      setElections(data);
    }
    setLoading(false);
  }

  async function updateElectionStatus(id: string) {
    setSaving(true);
    const supabase = createClient();
    const election = elections.find((e) => e.id === id);
    const { error } = await supabase
      .from("elections")
      .update({ status: editStatus })
      .eq("id", id);

    if (!error) {
      await logAdminAction({
        action: "update_election_status",
        targetType: "election",
        targetId: id,
        details: {
          title: election?.title,
          oldStatus: election?.status,
          newStatus: editStatus,
        },
      });
      await fetchElections();
      setEditingId(null);
    }
    setSaving(false);
  }

  async function createElection() {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("elections")
      .insert({
        title: newElection.title,
        type: newElection.type,
        state: newElection.state || null,
        year: newElection.year,
        status: newElection.status,
      })
      .select("id")
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "create_election",
        targetType: "election",
        targetId: data.id,
        details: { title: newElection.title, type: newElection.type },
      });
      setShowCreate(false);
      setNewElection({ title: "", type: "lok_sabha", state: "", year: new Date().getFullYear(), status: "upcoming" });
      await fetchElections();
    }
    setSaving(false);
  }

  const statusColors: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-amber-100 text-amber-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminSidebar />

      <main className="lg:ml-64 p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Elections Management</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Manage elections, phases, and status updates
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Election
            </button>
            <button
              onClick={fetchElections}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Add New Election</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Title</label>
                <input
                  type="text"
                  value={newElection.title}
                  onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                  placeholder="e.g. Lok Sabha 2029"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Type</label>
                <select
                  value={newElection.type}
                  onChange={(e) => setNewElection({ ...newElection, type: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="lok_sabha">Lok Sabha</option>
                  <option value="assembly">State Assembly</option>
                  <option value="by_election">By-Election</option>
                  <option value="local_body">Local Body</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">State (optional)</label>
                <input
                  type="text"
                  value={newElection.state}
                  onChange={(e) => setNewElection({ ...newElection, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Year</label>
                <input
                  type="number"
                  value={newElection.year}
                  onChange={(e) => setNewElection({ ...newElection, year: parseInt(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={createElection}
                disabled={saving || !newElection.title}
                className="bg-primary text-on-primary text-sm px-4 py-2 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Election"}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="text-sm text-slate-500 px-4 py-2 hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <div key={election.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-on-surface">{election.title}</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[election.status] || "bg-slate-100"}`}>
                        {election.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">category</span>
                        {election.type}
                      </span>
                      {election.state && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {election.state}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {election.year}
                      </span>
                      {election.election_phases && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">linear_scale</span>
                          {election.election_phases.length} phases
                        </span>
                      )}
                    </div>
                    {election.polling_start && (
                      <p className="text-xs text-slate-400 mt-2">
                        Polling: {election.polling_start} → {election.polling_end} | Results: {election.result_date}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === election.id ? (
                      <>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="text-sm border border-slate-200 rounded-lg px-3 py-2"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => updateElectionStatus(election.id)}
                          disabled={saving}
                          className="bg-primary text-white text-sm px-3 py-2 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-sm text-slate-500 px-3 py-2 hover:bg-slate-50 rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(election.id);
                          setEditStatus(election.status);
                        }}
                        className="flex items-center gap-1 text-sm text-primary hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Edit Status
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {elections.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">
                  how_to_vote
                </span>
                <h3 className="text-lg font-semibold text-on-surface mb-2">No Elections Found</h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  Run the seed script to populate election data.
                </p>
                <code className="text-xs bg-slate-100 px-3 py-1.5 rounded font-mono">
                  npx tsx scripts/seed-elections.ts
                </code>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminElectionsPage() {
  return (
    <AdminGuard requiredRole="admin">
      <ElectionsContent />
    </AdminGuard>
  );
}
