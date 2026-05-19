// ─── Shared General Types ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}
