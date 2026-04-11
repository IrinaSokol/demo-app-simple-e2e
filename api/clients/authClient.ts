import { HttpClient } from './httpClient';

export type LoginResponse = { token: string };

export class AuthClient {
  constructor(private readonly http: HttpClient) {}

  async getToken(email: string, password: string): Promise<string> {
    const body = await this.http.postJson<LoginResponse>('/api/auth/login', {
      data: { email, password },
    });
    return body.token;
  }
}
