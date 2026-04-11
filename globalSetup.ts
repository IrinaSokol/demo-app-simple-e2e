import { chromium, type FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Writes `.auth/admin.json` so the `ui` project can start logged in.
 * Matches the app: localStorage key `auth_token`, value `demo-token`.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
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
