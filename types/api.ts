/**
 * ElectionGuide AI — API Request/Response Types
 */

// ── Generic API Response ─────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

// ── Pagination ───────────────────────────────────────────────
export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ── Constituency API ─────────────────────────────────────────
export interface ConstituencySearchParams {
  state?: string;
  district?: string;
  type?: "parliamentary" | "assembly";
  query?: string;
}

// ── Admin APIs ───────────────────────────────────────────────
export interface ReindexRequest {
  documentIds?: string[];
  force?: boolean;
}

export interface ReindexResponse {
  processed: number;
  failed: number;
  errors: string[];
}

// ── Usage Report ─────────────────────────────────────────────
export interface UsageReport {
  totalRequests: number;
  totalTokens: number;
  averageLatency: number;
  byModel: Record<string, { requests: number; tokens: number }>;
  byDate: Array<{ date: string; requests: number; tokens: number }>;
}
