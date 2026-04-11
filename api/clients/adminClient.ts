import { HttpClient } from './httpClient';

export type ResetResponse = { ok: boolean };

export class AdminClient {
  constructor(private readonly http: HttpClient) {}

  async resetDemoData(token: string): Promise<ResetResponse> {
    return this.http.postJson<ResetResponse>('/api/admin/reset', {
      data: {},
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
