// src/utils/types.ts
export interface SearchResult {
  id: string;
  description?: string;
  query: string;
  url: string;
  isNavigation?: boolean;
  isHistory?: boolean;
  isApiResult?: boolean;  // Add this to identify API search results
  content?: string;       // For storing API response content
}

export const HISTORY_KEY = "history";