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

    await createAssetPage.expectVisible();
    await createAssetPage.expectUrlContains('/assets/new');
    await assetsDashboard.expectOpen();

    const asset = createAssetInput();
    await createAssetPage.createAsset(asset);

    await assetsDashboard.expectUrlIsAssetsList();
    await createAssetPage.expectHidden();
    await assetsDashboard.dashboard.waitForLoaded();
    await assetsDashboard.dashboard.expectHasAsset(asset.name);
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

    await createAssetPage.expectOverlayOpen();
    await createAssetPage.clickCancel();

    await assetsDashboard.expectUrlIsAssetsList();
    await createAssetPage.expectHidden();
    await assetsDashboard.dashboard.waitForLoaded();
  });
});
