"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUploadAttachment() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const upload = async (file: File) => {
    // Basic validation
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    if (file.size > MAX_SIZE) {
      setError("File size exceeds 5MB limit");
      return null;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Please upload an image or PDF.");
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || "anonymous";
      
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("chat-attachments")
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        name: file.name,
        type: file.type,
        size: file.size,
      };
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
}
