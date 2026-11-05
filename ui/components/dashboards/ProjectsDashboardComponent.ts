import type { Locator } from '@playwright/test';
import { DataTableComponent } from '../common/DataTableComponent';
import { BaseDashboardComponent } from './BaseDashboardComponent';

export class ProjectsDashboardComponent extends BaseDashboardComponent {
  private readonly table: DataTableComponent;

  constructor(root: Locator) {
    super(root, 'projects-table');
    this.table = new DataTableComponent(root.getByTestId('projects-table'));
  }

  projectRow(name: string): Locator {
    return this.table.rowByText(name);
  }

  /** Clicking a row opens the details overlay (`/projects/:projectId`). */
  async openProject(name: string): Promise<void> {
    await this.table.openRow(name);
  }

  async search(text: string): Promise<void> {
    await this.root.getByTestId('projects-search').fill(text);
  }
}
