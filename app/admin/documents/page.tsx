"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface KnowledgeDoc {
  id: string;
  title: string;
  source_type: string | null;
  language: string;
  source_url: string | null;
  created_at: string;
  chunk_count?: number;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ docs: 0, chunks: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [reindexing, setReindexing] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabase();

    const { data: docs } = await supabase
      .from("knowledge_documents")
      .select("id, title, source_type, language, source_url, created_at")
      .order("created_at", { ascending: false });

    // Get chunk counts
    const { data: chunks } = await supabase
      .from("knowledge_chunks")
      .select("document_id");

    const chunkMap: Record<string, number> = {};
    chunks?.forEach((c: { document_id: string }) => {
      chunkMap[c.document_id] = (chunkMap[c.document_id] || 0) + 1;
    });

    const enriched = (docs || []).map((d) => ({
      ...d,
      chunk_count: chunkMap[d.id] || 0,
    }));

    setDocuments(enriched);
    setStats({
      docs: enriched.length,
      chunks: Object.values(chunkMap).reduce((a, b) => a + b, 0),
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string) => {
    const supabase = getSupabase();
    // Chunks cascade-deleted via FK
    await supabase.from("knowledge_chunks").delete().eq("document_id", id);
    await supabase.from("knowledge_documents").delete().eq("id", id);
    setDeleteConfirm(null);
    fetchDocuments();
  };

  const handleReindex = async () => {
    setReindexing(true);
    try {
      const res = await fetch("/api/admin/reindex", { method: "POST" });
      const data = await res.json();
      alert(
        data.success
          ? `✅ Re-indexed ${data.count} documents`
          : `❌ Error: ${data.error}`
      );
    } catch {
      alert("❌ Re-index failed. Run: npx tsx scripts/ingest-documents.ts");
    }
    setReindexing(false);
    fetchDocuments();
  };

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.source_type || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const typeColors: Record<string, string> = {
    legislation: "bg-blue-100 text-blue-800",
    eci: "bg-green-100 text-green-800",
    manual: "bg-purple-100 text-purple-800",
    faq: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <AdminSidebar />
      <div className="lg:ml-64">
      {/* Header */}
      <header className="bg-white border-b border-outline-variant px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/chat" className="p-2 hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </a>
            <div>
              <h1 className="text-[20px] font-semibold text-on-surface">Document Manager</h1>
              <p className="text-[12px] text-outline">Manage your RAG knowledge base</p>
            </div>
          </div>
          <button
            onClick={handleReindex}
            disabled={reindexing}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-xl text-[14px] font-medium hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <span className={`material-symbols-outlined text-[18px] ${reindexing ? "animate-spin" : ""}`}>
              {reindexing ? "progress_activity" : "refresh"}
            </span>
            {reindexing ? "Re-indexing..." : "Re-index All"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-outline-variant p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">description</span>
              </div>
              <div>
                <p className="text-[24px] font-bold text-on-surface">{stats.docs}</p>
                <p className="text-[12px] text-outline">Total Documents</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-outline-variant p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">data_array</span>
              </div>
              <div>
                <p className="text-[24px] font-bold text-on-surface">{stats.chunks}</p>
                <p className="text-[12px] text-outline">Total Chunks</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-outline-variant p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
              </div>
              <div>
                <p className="text-[24px] font-bold text-on-surface">{stats.chunks}</p>
                <p className="text-[12px] text-outline">Embeddings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search documents by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  <th className="text-left py-3 px-4 text-[12px] font-semibold text-outline uppercase tracking-wider">Title</th>
                  <th className="text-left py-3 px-4 text-[12px] font-semibold text-outline uppercase tracking-wider">Category</th>
                  <th className="text-center py-3 px-4 text-[12px] font-semibold text-outline uppercase tracking-wider">Chunks</th>
                  <th className="text-left py-3 px-4 text-[12px] font-semibold text-outline uppercase tracking-wider">Language</th>
                  <th className="text-left py-3 px-4 text-[12px] font-semibold text-outline uppercase tracking-wider">Added</th>
                  <th className="text-center py-3 px-4 text-[12px] font-semibold text-outline uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-outline">
                      <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
                      <p className="mt-2 text-[14px]">Loading documents...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-outline">
                      <span className="material-symbols-outlined text-[32px]">folder_off</span>
                      <p className="mt-2 text-[14px]">No documents found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((doc) => (
                    <tr key={doc.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px]">article</span>
                          <div>
                            <p className="text-[14px] font-medium text-on-surface line-clamp-1">{doc.title}</p>
                            {doc.source_url && (
                              <a href={doc.source_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline">
                                {new URL(doc.source_url).hostname}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${typeColors[doc.source_type || ""] || "bg-gray-100 text-gray-600"}`}>
                          {doc.source_type || "unknown"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[14px] font-mono text-on-surface">{doc.chunk_count}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[12px] text-outline uppercase">{doc.language}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[12px] text-outline">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {deleteConfirm === doc.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-[11px] bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(doc.id)}
                            className="p-1.5 text-outline hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete document"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
