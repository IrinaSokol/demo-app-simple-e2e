import { env } from '../../config/env';
import { test } from '../fixtures/uiTest';
import { AppShellPage } from '../pages/AppShellPage';
import { ProjectsDashboardPage } from '../pages/dashboards/ProjectsDashboardPage';

test.describe('UI — login', () => {
  test('logs in and reaches the authenticated shell', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.expectVisible();
    await loginPage.login(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);

    const shell = new AppShellPage(page);
    const projects = new ProjectsDashboardPage(page);
    await shell.expectLoaded();
    await projects.expectOpen();
  });
});
