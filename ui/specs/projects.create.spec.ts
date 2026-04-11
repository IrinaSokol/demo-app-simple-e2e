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

    await createProjectPage.expectVisible();
    await createProjectPage.expectUrlContains('/projects/new');
    await projectsDashboard.expectOpen();

    const project = createProjectInput();
    await createProjectPage.createProject(project);

    await projectsDashboard.expectUrlIsProjectsList();
    await createProjectPage.expectHidden();
    await projectsDashboard.dashboard.waitForLoaded();
    await projectsDashboard.dashboard.expectHasProject(project.name);
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

    await createProjectPage.expectOverlayOpen();
    await createProjectPage.clickCancel();

    await projectsDashboard.expectUrlIsProjectsList();
    await createProjectPage.expectHidden();
    await projectsDashboard.dashboard.waitForLoaded();
  });
});
