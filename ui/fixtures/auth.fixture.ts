import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Full sign-in through the UI (for specs that do not use `storageState`).
 * Authenticated flows in this repo usually rely on `globalSetup` instead.
 */
export async function loginThroughUi(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(email, password);
}
