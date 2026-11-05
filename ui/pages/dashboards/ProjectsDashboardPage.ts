import type { Locator, Page } from '@playwright/test';
import { AppShellPage } from '../AppShellPage';
import { ProjectsDashboardComponent } from '../../components/dashboards/ProjectsDashboardComponent';

export class ProjectsDashboardPage {
  /** List route only (not `/projects/new`). */
  readonly url = /\/projects$/;

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

  /** Opens the route-based create overlay (`/projects/new`). */
  async openCreateProject(): Promise<void> {
    await this.page.getByTestId('projects-new').click();
  }
}
