import { createProjectInput, demoData } from '../fixtures/data.fixture';
import { expect, test } from '../fixtures/uiTest';

test.describe('UI — Project details (overlay)', () => {
  test.beforeEach(async ({ api, token }) => {
    expect(token, 'token for API setup').toBeTruthy();
    await api.admin.resetDemoData(token!);
  });

  test('opens a project from the list and shows its details', async ({
    page,
    api,
    token,
    projectsDashboard,
    projectDetailsPage,
  }) => {
    const project = createProjectInput();
    await api.projects.createProject(token!, project);

    await page.goto('/');
    await projectsDashboard.shell.sidebar.openProjects();
    await projectsDashboard.dashboard.waitForLoaded();
    await projectsDashboard.dashboard.openProject(project.name);

    await expect(projectDetailsPage.root).toBeVisible();
    await expect(projectDetailsPage.name).toHaveText(project.name);
    await expect(projectDetailsPage.owner).toHaveText(project.owner);
    await expect(projectDetailsPage.status).toHaveText(project.status);
    await expect(projectDetailsPage.archiveButton).toBeEnabled();
    await expect(projectsDashboard.root).toBeVisible();
  });

  test('archives an active project and shows it as archived in the list', async ({
    page,
    api,
    token,
    projectsDashboard,
    projectDetailsPage,
  }) => {
    const project = createProjectInput();
    const created = await api.projects.createProject(token!, project);

    await page.goto('/');
    await projectsDashboard.shell.sidebar.openProjects();
    await projectsDashboard.dashboard.waitForLoaded();
    await projectsDashboard.dashboard.openProject(project.name);
    await projectDetailsPage.clickArchive();

    await expect(page).toHaveURL(projectsDashboard.url);
    await expect(projectDetailsPage.root).toBeHidden();
    await projectsDashboard.dashboard.waitForLoaded();
    await expect(projectsDashboard.dashboard.projectRow(project.name)).toContainText('Archived');

    const saved = await api.projects.getProject(token!, created.id);
    expect(saved.status, 'status persisted by the API').toBe('Archived');
  });

  test('does not allow archiving a project that is already archived', async ({
    page,
    projectsDashboard,
    projectDetailsPage,
  }) => {
    await page.goto('/');
    await projectsDashboard.shell.sidebar.openProjects();
    await projectsDashboard.dashboard.waitForLoaded();
    await projectsDashboard.dashboard.openProject(demoData.archivedProject);

    await expect(projectDetailsPage.root).toBeVisible();
    await expect(projectDetailsPage.status).toHaveText('Archived');
    await expect(projectDetailsPage.archiveButton).toBeDisabled();
  });

  test('closes the overlay and stays on the projects list', async ({
    page,
    projectsDashboard,
    projectDetailsPage,
  }) => {
    await page.goto('/');
    await projectsDashboard.shell.sidebar.openProjects();
    await projectsDashboard.dashboard.waitForLoaded();
    await projectsDashboard.dashboard.openProject(demoData.primaryProject);
    await expect(projectDetailsPage.root).toBeVisible();
    await projectDetailsPage.clickClose();

    await expect(page).toHaveURL(projectsDashboard.url);
    await expect(projectDetailsPage.root).toBeHidden();
    await projectsDashboard.dashboard.waitForLoaded();
  });
});
