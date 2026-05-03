"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  /** Current image URL (if any) */
  currentUrl?: string | null;
  /** Supabase storage bucket name */
  bucket: string;
  /** File path prefix inside the bucket */
  pathPrefix: string;
  /** Callback with the public URL after upload */
  onUpload: (url: string) => void;
  /** Optional label */
  label?: string;
}

/**
 * Image upload component backed by Supabase Storage.
 * Shows preview, drag-and-drop area, upload progress.
 */
export function ImageUpload({
  currentUrl,
  bucket,
  pathPrefix,
  onUpload,
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const fileName = `${pathPrefix}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const url = publicUrlData.publicUrl;
      setPreview(url);
      onUpload(url);
    } catch {
      setError("Upload failed. Please try again.");
    }

    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  return (
    <div>
      <label className="block text-xs font-medium text-on-surface-variant mb-1.5">{label}</label>

      {/* Preview */}
      {preview && (
        <div className="relative mb-3">
          <img
            src={preview}
            alt="Stage illustration preview"
            className="w-full h-36 object-cover rounded-lg border border-outline-variant"
          />
          <button
            onClick={() => {
              setPreview(null);
              onUpload("");
            }}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
            aria-label="Remove image"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-outline-variant hover:border-primary/50 hover:bg-surface-container"
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-on-surface-variant">Uploading...</span>
          </div>
        ) : (
          <>
            <span className="material-symbols-outlined text-[28px] text-on-surface-variant/50 block mb-1" aria-hidden="true">
              cloud_upload
            </span>
            <p className="text-xs text-on-surface-variant">
              Drag & drop or <span className="text-primary font-medium">click to browse</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label={label}
      />

      {error && (
        <p className="text-xs text-error mt-1.5 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
