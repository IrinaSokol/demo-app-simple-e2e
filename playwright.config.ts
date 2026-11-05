import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  globalSetup: path.join(rootDir, 'globalSetup.ts'),
  testDir: '.',
  testMatch: ['api/**/*.spec.ts', 'ui/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: 'api/**/*.spec.ts',
    },
    {
      name: 'ui',
      testMatch: [
        'ui/specs/dashboards*.spec.ts',
        'ui/specs/projects.create.spec.ts',
        'ui/specs/projects.details.spec.ts',
        'ui/specs/assets.create.spec.ts',
      ],
      // `api` includes the destructive admin reset spec; it must finish before UI tests start.
      dependencies: ['api'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(rootDir, '.auth', 'admin.json'),
      },
    },
    {
      name: 'ui-guest',
      testMatch: 'ui/specs/auth.login-ui.spec.ts',
      dependencies: ['api'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
