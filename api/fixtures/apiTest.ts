import { test as base } from '@playwright/test';
import { env } from '../../config/env';
import { HttpClient } from '../clients/httpClient';
import { AuthClient } from '../clients/authClient';
import { AdminClient } from '../clients/adminClient';
import { ProjectsClient } from '../clients/projectsClient';
import { AssetsClient } from '../clients/assetsClient';

export type ApiClients = {
  auth: AuthClient;
  admin: AdminClient;
  projects: ProjectsClient;
  assets: AssetsClient;
};

type ApiFixtures = {
  api: ApiClients;
  token: string;
};

/**
 * API layer fixture: HTTP clients + a fresh bearer token per test.
 * UI tests extend this to reuse `api` and `token` in beforeEach/afterEach.
 */
export const test = base.extend<ApiFixtures>({
  api: async ({ playwright }, use) => {
    const request = await playwright.request.newContext({
      baseURL: env.API_URL,
    });
    const http = new HttpClient(request);
    const clients: ApiClients = {
      auth: new AuthClient(http),
      admin: new AdminClient(http),
      projects: new ProjectsClient(http),
      assets: new AssetsClient(http),
    };
    await use(clients);
    await request.dispose();
  },

  token: [
    async ({ api }, use) => {
      const token = await api.auth.getToken(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
      await use(token);
    },
    { option: true },
  ],
});

export { expect } from '@playwright/test';
