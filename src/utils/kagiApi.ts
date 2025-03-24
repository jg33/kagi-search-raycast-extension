// src/utils/kagiSearchApi.ts
import fetch from "node-fetch";
import { randomId } from "@raycast/api";
import { SearchResult } from "./types";

interface KagiSearchResponse {
  meta: {
    id: string;
    node: string;
    ms: number;
    api_balance: number;
  };
  data: Array<{
    t: number;
    url: string;
    title: string;
    snippet?: string;
    published?: string;
    thumbnail?: {
      url: string;
      width?: number;
      height?: number;
    };
    list?: string[]; // for related searches (t=1)
  }>;
}

export async function searchWithKagiAPI(
  query: string,
  apiKey: string,
  signal: AbortSignal
): Promise<SearchResult[]> {
  console.log(apiKey);
  const response = await fetch(`https://kagi.com/api/v0/search?q=${encodeURIComponent(query)}`, {
    method: "GET",
    signal: signal,
    headers: {
      "Authorization": `Bot ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  const data = await response.json() as KagiSearchResponse;
  const results: SearchResult[] = [];

  // Process search results (t=0)
  data.data.forEach((item) => {
    if (item.t === 0) {
      results.push({
        id: randomId(),
        query: item.title,
        description: item.snippet || "",
        url: item.url,
        isApiResult: true,
      });
    }
  });

  return results;
}