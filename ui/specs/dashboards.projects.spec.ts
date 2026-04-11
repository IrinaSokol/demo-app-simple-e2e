import { demoData } from '../fixtures/data.fixture';
import { expect, test } from '../fixtures/uiTest';

test.describe('UI — Projects dashboard', () => {
  test.beforeEach(async ({ api, token }) => {
    expect(token, 'request a token for API setup').toBeTruthy();
    await api.admin.resetDemoData(token!);
  });

  test('shows title and seeded project row', async ({ page, projectsDashboard }) => {
    await page.goto('/');
    await projectsDashboard.shell.sidebar.openProjects();

    await projectsDashboard.dashboard.waitForLoaded();
    await projectsDashboard.dashboard.expectTitleContains('Projects');
    await projectsDashboard.dashboard.expectHasProject(demoData.primaryProject);
  });
});
