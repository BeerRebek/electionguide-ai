"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type PostgresEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface UseRealtimeOptions<T> {
  table: string;
  schema?: string;
  event?: PostgresEvent;
  filter?: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: T) => void;
  enabled?: boolean;
}

/**
 * Generic hook for Supabase realtime subscriptions.
 * Auto-cleans up on unmount. Supports reconnection.
 */
export function useRealtime<T extends Record<string, unknown>>({
  table,
  schema = "public",
  event = "*",
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeOptions<T>) {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const channelRef = useRef<RealtimeChannel | null>(null);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      const supabase = createClient();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setStatus("disconnected");
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    const supabase = createClient();
    setStatus("connecting");

    const channelConfig: {
      event: PostgresEvent;
      schema: string;
      table: string;
      filter?: string;
    } = { event, schema, table };

    if (filter) channelConfig.filter = filter;

    const channel = supabase
      .channel(`realtime:${table}:${event}`)
      .on(
        "postgres_changes" as "system",
        channelConfig as unknown as { event: string },
        (payload: RealtimePostgresChangesPayload<T>) => {
          const record = (payload.new || payload.old) as T;
          if (payload.eventType === "INSERT" && onInsert) onInsert(record);
          if (payload.eventType === "UPDATE" && onUpdate) onUpdate(record);
          if (payload.eventType === "DELETE" && onDelete) onDelete(record);
        }
      )
      .subscribe((status) => {
        setStatus(status === "SUBSCRIBED" ? "connected" : "connecting");
      });

    channelRef.current = channel;

    return cleanup;
  }, [table, schema, event, filter, enabled, onInsert, onUpdate, onDelete, cleanup]);

  return { status, unsubscribe: cleanup };
}
