export interface NewsSource {
  id: string | null;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

export interface NewsSourcesResponse {
  status: 'ok' | 'error';
  code?: string;
  message?: string;
  sources: NewsSource[];
}
