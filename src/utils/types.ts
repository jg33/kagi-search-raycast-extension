// src/utils/types.ts
export interface SearchResult {
  id: string;
  description?: string;
  query: string;
  url: string;
  isNavigation?: boolean;
  isHistory?: boolean;
  isApiResult?: boolean;
  isAnswer?: boolean;
  isReference?: boolean;
}

export const HISTORY_KEY = "history";