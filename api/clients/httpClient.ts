import type { APIRequestContext, APIResponse } from '@playwright/test';

/** Thin wrapper over Playwright's APIRequestContext (use a context whose baseURL is API_URL). */
export class HttpClient {
  constructor(private readonly request: APIRequestContext) {}

  private async assertOk(res: APIResponse): Promise<void> {
    if (res.ok()) return;
    const body = await res.text();
    throw new Error(`HTTP ${res.status()} ${res.statusText()}: ${body || '(empty body)'}`);
  }

  async postJson<T>(
    path: string,
    options?: { data?: unknown; headers?: Record<string, string> }
  ): Promise<T> {
    const res = await this.request.post(path, {
      data: options?.data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    await this.assertOk(res);
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }

  async getJson<T>(path: string, options?: { headers?: Record<string, string> }): Promise<T> {
    const res = await this.request.get(path, { headers: options?.headers });
    await this.assertOk(res);
    return res.json() as Promise<T>;
  }
}
