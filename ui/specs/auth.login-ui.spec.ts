import { env } from '../../config/env';
import { expect, test } from '../fixtures/uiTest';
import { AppShellPage } from '../pages/AppShellPage';
import { ProjectsDashboardPage } from '../pages/dashboards/ProjectsDashboardPage';

test.describe('UI — login', () => {
  test('logs in and reaches the authenticated shell', async ({ page, loginPage }) => {
    await loginPage.open();
    await expect(loginPage.root).toBeVisible();
    await loginPage.login(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);

    const shell = new AppShellPage(page);
    const projects = new ProjectsDashboardPage(page);
    await expect(shell.root).toBeVisible();
    await expect(projects.root).toBeVisible();
  });
});
