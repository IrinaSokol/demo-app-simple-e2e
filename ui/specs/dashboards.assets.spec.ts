import { demoData } from '../fixtures/data.fixture';
import { expect, test } from '../fixtures/uiTest';

test.describe('UI — Assets dashboard', () => {
  test('shows title and seeded asset row', async ({ page, assetsDashboard }) => {
    await page.goto('/');
    await assetsDashboard.shell.sidebar.openAssets();

    await assetsDashboard.dashboard.waitForLoaded();
    await expect(assetsDashboard.dashboard.title).toContainText('Assets');
    await expect(assetsDashboard.dashboard.assetRow(demoData.primaryAsset)).toBeVisible();
  });
});
