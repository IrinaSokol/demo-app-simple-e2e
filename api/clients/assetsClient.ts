import { HttpClient } from './httpClient';

export type AssetDto = {
  id: string;
  name: string;
  type: string;
  status: string;
  updatedAt: string;
};

export class AssetsClient {
  constructor(private readonly http: HttpClient) {}

  async getAssets(token: string): Promise<AssetDto[]> {
    return this.http.getJson<AssetDto[]>('/api/assets', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
