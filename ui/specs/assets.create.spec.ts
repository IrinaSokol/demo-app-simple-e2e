import { createAssetInput } from '../fixtures/data.fixture';
import { expect, test } from '../fixtures/uiTest';

test.describe('UI — Assets create (overlay)', () => {
  test.beforeEach(async ({ api, token }) => {
    expect(token, 'token for API setup').toBeTruthy();
    await api.admin.resetDemoData(token!);
  });

  test('creates an asset via overlay and returns to the list', async ({
    page,
    assetsDashboard,
    createAssetPage,
  }) => {
    await page.goto('/');
    await assetsDashboard.shell.sidebar.openAssets();
    await assetsDashboard.dashboard.waitForLoaded();
    await assetsDashboard.openCreateAsset();

    await expect(createAssetPage.overlay).toBeVisible();
    await expect(page).toHaveURL(createAssetPage.url);
    await expect(assetsDashboard.root).toBeVisible();

    const asset = createAssetInput();
    await createAssetPage.createAsset(asset);

    await expect(page).toHaveURL(assetsDashboard.url);
    await expect(createAssetPage.overlay).toBeHidden();
    await assetsDashboard.dashboard.waitForLoaded();
    await expect(assetsDashboard.dashboard.assetRow(asset.name)).toBeVisible();
  });

  test('Cancel closes overlay and stays on assets list URL', async ({
    page,
    assetsDashboard,
    createAssetPage,
  }) => {
    await page.goto('/');
    await assetsDashboard.shell.sidebar.openAssets();
    await assetsDashboard.dashboard.waitForLoaded();
    await assetsDashboard.openCreateAsset();

    await expect(createAssetPage.overlay).toBeVisible();
    await createAssetPage.clickCancel();

    await expect(page).toHaveURL(assetsDashboard.url);
    await expect(createAssetPage.overlay).toBeHidden();
    await assetsDashboard.dashboard.waitForLoaded();
  });
});
