import type { Locator, Page } from '@playwright/test';

/**
 * Route-based details overlay (`/projects/:projectId`) shown over the projects dashboard.
 */
export class ProjectDetailsPage {
  constructor(private readonly page: Page) {}

  get root(): Locator {
    return this.page.getByTestId('project-details-overlay');
  }

  get name(): Locator {
    return this.root.getByTestId('project-details-name');
  }

  get owner(): Locator {
    return this.root.getByTestId('project-details-owner');
  }

  get status(): Locator {
    return this.root.getByTestId('project-details-status');
  }

  /** Disabled by the app for projects that are already archived. */
  get archiveButton(): Locator {
    return this.root.getByTestId('project-details-archive');
  }

  /** Navigate directly to the details overlay (optional; prefer opening a row from the dashboard). */
  async open(projectId: string): Promise<void> {
    await this.page.goto(`/projects/${projectId}`);
  }

  async clickArchive(): Promise<void> {
    await this.archiveButton.click();
  }

  async clickClose(): Promise<void> {
    await this.root.getByTestId('project-details-close').click();
  }
}
