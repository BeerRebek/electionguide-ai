"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { createClient } from "@/lib/supabase/client";
import { logAdminAction } from "@/lib/admin/rbac";

interface EVMStage {
  id: string;
  stage_order: number;
  title: string;
  description: string;
  icon: string;
  illustration_url: string | null;
  details: {
    bite?: string;
    snack?: string;
    legal_provisions?: string[];
    authorities?: string[];
    security_protocols?: string[];
  };
}

function EVMContentPageInner() {
  const [stages, setStages] = useState<EVMStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    description: "",
    bite: "",
    snack: "",
    illustrationUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStages();
  }, []);

  async function fetchStages() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("evm_lifecycle_stages")
      .select("*")
      .order("stage_order", { ascending: true });

    if (!error && data) {
      setStages(data);
    }
    setLoading(false);
  }

  async function updateStage(id: string) {
    setSaving(true);
    const supabase = createClient();
    const stage = stages.find((s) => s.id === id);

    // Build the updated details JSONB
    const updatedDetails = {
      ...stage?.details,
      bite: editForm.bite || stage?.details?.bite,
      snack: editForm.snack || stage?.details?.snack,
    };

    const updatePayload: Record<string, unknown> = {
      description: editForm.description,
      details: updatedDetails,
    };

    // Only update illustration_url if changed
    if (editForm.illustrationUrl !== (stage?.illustration_url || "")) {
      updatePayload.illustration_url = editForm.illustrationUrl || null;
    }

    const { error } = await supabase
      .from("evm_lifecycle_stages")
      .update(updatePayload)
      .eq("id", id);

    if (!error) {
      const fieldsUpdated = ["description", "bite", "snack"];
      if (editForm.illustrationUrl !== (stage?.illustration_url || "")) {
        fieldsUpdated.push("illustration_url");
      }
      await logAdminAction({
        action: "update_evm_stage",
        targetType: "evm_lifecycle_stage",
        targetId: id,
        details: {
          title: stage?.title,
          fieldsUpdated,
        },
      });
      await fetchStages();
      setEditingId(null);
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AdminSidebar />

      <main className="lg:ml-64 p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">EVM/VVPAT Content</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Manage EVM lifecycle stage descriptions, bite/snack content, and details
            </p>
          </div>
          <button
            onClick={fetchStages}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {stages.map((stage) => (
              <div key={stage.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[24px]">
                      {stage.icon || "settings"}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Stage {stage.stage_order}
                      </span>
                      <h3 className="text-lg font-semibold text-on-surface">{stage.title}</h3>
                    </div>

                    {editingId === stage.id ? (
                      <div className="mt-3 space-y-4">
                        {/* Description */}
                        <div>
                          <label className="block text-xs font-medium text-on-surface-variant mb-1">Description</label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none"
                            rows={2}
                          />
                        </div>

                        {/* Bite (one-liner) */}
                        <div>
                          <label className="block text-xs font-medium text-on-surface-variant mb-1">
                            Bite <span className="text-slate-400">(one-liner summary)</span>
                          </label>
                          <input
                            type="text"
                            value={editForm.bite}
                            onChange={(e) => setEditForm({ ...editForm, bite: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            placeholder="Brief one-line summary..."
                          />
                        </div>

                        {/* Snack (paragraph) */}
                        <div>
                          <label className="block text-xs font-medium text-on-surface-variant mb-1">
                            Snack <span className="text-slate-400">(expanded paragraph)</span>
                          </label>
                          <textarea
                            value={editForm.snack}
                            onChange={(e) => setEditForm({ ...editForm, snack: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none"
                            rows={3}
                            placeholder="More detailed explanation..."
                          />
                        </div>

                        {/* Illustration Upload */}
                        <ImageUpload
                          currentUrl={stage.illustration_url}
                          bucket="evm-illustrations"
                          pathPrefix={`stage-${stage.stage_order}`}
                          onUpload={(url) => setEditForm({ ...editForm, illustrationUrl: url })}
                          label="Stage Illustration"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStage(stage.id)}
                            disabled={saving}
                            className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-sm text-slate-500 px-4 py-2 hover:bg-slate-50 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-on-surface-variant mb-3">{stage.description}</p>

                        {/* Bite/Snack preview */}
                        {stage.details && (stage.details.bite || stage.details.snack) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            {stage.details.bite && (
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-blue-700 mb-1">🍪 Bite</p>
                                <p className="text-xs text-blue-600 line-clamp-2">{stage.details.bite}</p>
                              </div>
                            )}
                            {stage.details.snack && (
                              <div className="bg-amber-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-amber-700 mb-1">🥪 Snack</p>
                                <p className="text-xs text-amber-600 line-clamp-2">{stage.details.snack}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Details Preview */}
                        {stage.details && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            {stage.details.legal_provisions && stage.details.legal_provisions.length > 0 && (
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-slate-600 mb-1">Legal References</p>
                                <ul className="text-xs text-slate-500 space-y-0.5">
                                  {stage.details.legal_provisions.slice(0, 2).map((ref, i) => (
                                    <li key={i} className="truncate">• {ref}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {stage.details.authorities && stage.details.authorities.length > 0 && (
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-slate-600 mb-1">Authorities</p>
                                <ul className="text-xs text-slate-500 space-y-0.5">
                                  {stage.details.authorities.slice(0, 2).map((auth, i) => (
                                    <li key={i} className="truncate">• {auth}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {stage.details.security_protocols && stage.details.security_protocols.length > 0 && (
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-slate-600 mb-1">Security Protocols</p>
                                <ul className="text-xs text-slate-500 space-y-0.5">
                                  {stage.details.security_protocols.slice(0, 2).map((sec, i) => (
                                    <li key={i} className="truncate">• {sec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setEditingId(stage.id);
                            setEditForm({
                              description: stage.description,
                              bite: stage.details?.bite || "",
                              snack: stage.details?.snack || "",
                              illustrationUrl: stage.illustration_url || "",
                            });
                          }}
                          className="flex items-center gap-1 text-sm text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Edit Content
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {stages.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">
                  memory
                </span>
                <h3 className="text-lg font-semibold text-on-surface mb-2">No EVM Stages Found</h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  Run the seed script to populate EVM lifecycle data.
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

export default function AdminEVMContentPage() {
  return (
    <AdminGuard requiredRole="content_manager">
      <EVMContentPageInner />
    </AdminGuard>
  );
}
