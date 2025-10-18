import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NewsSourcesResponse } from './types/news.types';

@Injectable()
export class NewsService {
  private readonly baseUrl = 'https://newsapi.org/v2/top-headlines/sources';
  private readonly defaultCountry = 'br';
  private readonly defaultCategory = 'general';
  private readonly requestTimeoutMs = 5000;

  constructor(private readonly config: ConfigService) {}

  private get apiKey(): string {
    return this.config.get<string>('NEWS_API_KEY') || '';
  }

  private buildUrl(): string {
    const url = new URL(this.baseUrl);
    url.searchParams.set('country', this.defaultCountry);
    url.searchParams.set('category', this.defaultCategory);
    url.searchParams.set('apiKey', this.apiKey);
    return url.toString();
  }

  private async request<T>(url: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      ...init,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      throw new InternalServerErrorException(
        `NewsAPI request failed: ${res.status} ${res.statusText} - ${text}`,
      );
    }

    return (await res.json()) as T;
  }

  private ensureOkStatus(payload: NewsSourcesResponse): void {
    if (payload.status !== 'ok') {
      const code = payload.code || 'unknown_error';
      const message = payload.message || 'Unknown NewsAPI error';
      throw new InternalServerErrorException(`NewsAPI responded with error: ${code} - ${message}`);
    }
  }

  async getSources(): Promise<NewsSourcesResponse> {
    if (!this.apiKey) {
      throw new InternalServerErrorException('Missing NEWS_API_KEY environment variable');
    }

    const url = this.buildUrl();
    const payload = await this.request<NewsSourcesResponse>(url);
    this.ensureOkStatus(payload);
    return payload;
  }
}
