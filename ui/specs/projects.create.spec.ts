import { createProjectInput } from '../fixtures/data.fixture';
import { expect, test } from '../fixtures/uiTest';

test.describe('UI — Projects create (overlay)', () => {
  test.beforeEach(async ({ api, token }) => {
    expect(token, 'token for API setup').toBeTruthy();
    await api.admin.resetDemoData(token!);
  });

  test('creates a project via overlay and returns to the list', async ({
    page,
    projectsDashboard,
    createProjectPage,
  }) => {
    await page.goto('/');
    await projectsDashboard.shell.sidebar.openProjects();
    await projectsDashboard.dashboard.waitForLoaded();
    await projectsDashboard.openCreateProject();

    await expect(createProjectPage.overlay).toBeVisible();
    await expect(page).toHaveURL(createProjectPage.url);
    await expect(projectsDashboard.root).toBeVisible();

    const project = createProjectInput();
    await createProjectPage.createProject(project);

    await expect(page).toHaveURL(projectsDashboard.url);
    await expect(createProjectPage.overlay).toBeHidden();
    await projectsDashboard.dashboard.waitForLoaded();
    await expect(projectsDashboard.dashboard.projectRow(project.name)).toBeVisible();
  });

  test('Cancel closes overlay and stays on projects list URL', async ({
    page,
    projectsDashboard,
    createProjectPage,
  }) => {
    await page.goto('/');
    await projectsDashboard.shell.sidebar.openProjects();
    await projectsDashboard.dashboard.waitForLoaded();
    await projectsDashboard.openCreateProject();

    await expect(createProjectPage.overlay).toBeVisible();
    await createProjectPage.clickCancel();

    await expect(page).toHaveURL(projectsDashboard.url);
    await expect(createProjectPage.overlay).toBeHidden();
    await projectsDashboard.dashboard.waitForLoaded();
  });
});
