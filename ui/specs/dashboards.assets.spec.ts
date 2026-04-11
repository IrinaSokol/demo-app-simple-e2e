import { demoData } from '../fixtures/data.fixture';
import { expect, test } from '../fixtures/uiTest';

test.describe('UI — Assets dashboard', () => {
  test.beforeEach(async ({ api, token }) => {
    expect(token, 'request a token for API setup').toBeTruthy();
    await api.admin.resetDemoData(token!);
  });

  test('shows title and seeded asset row', async ({ page, assetsDashboard }) => {
    await page.goto('/');
    await assetsDashboard.shell.sidebar.openAssets();

    await assetsDashboard.dashboard.waitForLoaded();
    await assetsDashboard.dashboard.expectTitleContains('Assets');
    await assetsDashboard.dashboard.expectHasAsset(demoData.primaryAsset);
  });
});
