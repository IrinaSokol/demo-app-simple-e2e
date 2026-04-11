import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AppShellPage } from '../AppShellPage';
import { ProjectsDashboardComponent } from '../../components/dashboards/ProjectsDashboardComponent';

export class ProjectsDashboardPage {
  constructor(private readonly page: Page) {}

  get shell(): AppShellPage {
    return new AppShellPage(this.page);
  }

  get root(): Locator {
    return this.page.getByTestId('projects-dashboard-root');
  }

  get dashboard(): ProjectsDashboardComponent {
    return new ProjectsDashboardComponent(this.root);
  }

  async open(): Promise<void> {
    await this.page.goto('/projects');
  }

  async expectOpen(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  /** Opens the route-based create overlay (`/projects/new`). */
  async openCreateProject(): Promise<void> {
    await this.page.getByTestId('projects-new').click();
  }

  /** List route only (not `/projects/new`). */
  async expectUrlIsProjectsList(): Promise<void> {
    await expect(this.page).toHaveURL(/\/projects$/);
  }
}
