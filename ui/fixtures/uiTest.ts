import { test as apiTest, expect } from '../../api/fixtures/apiTest';
import { LoginPage } from '../pages/LoginPage';
import { ProjectsDashboardPage } from '../pages/dashboards/ProjectsDashboardPage';
import { AssetsDashboardPage } from '../pages/dashboards/AssetsDashboardPage';
import { CreateProjectPage } from '../pages/create/CreateProjectPage';
import { CreateAssetPage } from '../pages/create/CreateAssetPage';
import { ProjectDetailsPage } from '../pages/details/ProjectDetailsPage';

type UiFixtures = {
  loginPage: LoginPage;
  projectsDashboard: ProjectsDashboardPage;
  assetsDashboard: AssetsDashboardPage;
  createProjectPage: CreateProjectPage;
  createAssetPage: CreateAssetPage;
  projectDetailsPage: ProjectDetailsPage;
};

/**
 * UI layer: extends API fixtures so tests can arrange data via API and drive the app via pages.
 * Demo data is reset once per run in `globalSetup.ts`, never per test.
 *
 * @example
 * test('…', async ({ api, token, projectsDashboard }) => {
 *   await api.projects.createProject(token, createProjectInput());
 * });
 */
export const test = apiTest.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  projectsDashboard: async ({ page }, use) => {
    await use(new ProjectsDashboardPage(page));
  },
  assetsDashboard: async ({ page }, use) => {
    await use(new AssetsDashboardPage(page));
  },
  createProjectPage: async ({ page }, use) => {
    await use(new CreateProjectPage(page));
  },
  createAssetPage: async ({ page }, use) => {
    await use(new CreateAssetPage(page));
  },
  projectDetailsPage: async ({ page }, use) => {
    await use(new ProjectDetailsPage(page));
  },
});

export { expect };
