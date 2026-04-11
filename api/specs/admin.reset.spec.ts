import { SEED_ASSET_NAMES, SEED_PROJECT_NAMES } from '../../config/demoSeed';
import { expect, test } from '../fixtures/apiTest';

test.describe('API — admin reset', () => {
  test('resets in-memory data to the initial seed', async ({ api, token }) => {
    expect(token).toBeDefined();

    const reset = await api.admin.resetDemoData(token!);
    expect(reset.ok).toBe(true);

    const projects = await api.projects.getProjects(token!);
    const names = projects.map((p) => p.name);
    expect(names).toEqual([...SEED_PROJECT_NAMES]);

    const assets = await api.assets.getAssets(token!);
    const assetNames = assets.map((a) => a.name);
    expect(assetNames).toEqual([...SEED_ASSET_NAMES]);
  });
});
