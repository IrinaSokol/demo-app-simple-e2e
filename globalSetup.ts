import { chromium, request, type FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env';
import { HttpClient } from './api/clients/httpClient';
import { AuthClient } from './api/clients/authClient';
import { AdminClient } from './api/clients/adminClient';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Restores the seed once per run. Specs never reset in `beforeEach`: with parallel workers
 * a reset in one test wipes data another test has just created.
 */
async function resetDemoDataOnce(): Promise<void> {
  const context = await request.newContext({ baseURL: env.API_URL });
  const http = new HttpClient(context);
  const token = await new AuthClient(http).getToken(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
  await new AdminClient(http).resetDemoData(token);
  await context.dispose();
}

/**
 * Resets demo data, then writes `.auth/admin.json` so the `ui` project can start logged in.
 * Matches the app: localStorage key `auth_token`, value `demo-token`.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  await resetDemoDataOnce();

  const authDir = path.join(__dirname, '.auth');
  fs.mkdirSync(authDir, { recursive: true });
  const storagePath = path.join(authDir, 'admin.json');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${env.BASE_URL}/login`);
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'demo-token');
  });

  await context.storageState({ path: storagePath });
  await browser.close();
}

export default globalSetup;
