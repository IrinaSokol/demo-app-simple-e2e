import type { Locator, Page } from '@playwright/test';
import { BaseCreateRecordPage } from './BaseCreateRecordPage';

export type ProjectFormData = {
  name: string;
  owner: string;
  status: string;
};

export class CreateProjectPage extends BaseCreateRecordPage {
  constructor(page: Page) {
    super(page);
  }

  protected overlayRoot(): Locator {
    return this.page.getByTestId('create-project-overlay');
  }

  protected saveButton(): Locator {
    return this.page.getByTestId('create-project-save');
  }

  protected cancelButton(): Locator {
    return this.page.getByTestId('create-project-cancel');
  }

  /** Navigate directly to the create overlay route (optional; prefer dashboard.openCreateProject()). */
  async open(): Promise<void> {
    await this.page.goto('/projects/new');
  }

  async fillName(name: string): Promise<void> {
    await this.page.getByTestId('project-name').fill(name);
  }

  async fillOwner(owner: string): Promise<void> {
    await this.page.getByTestId('project-owner').fill(owner);
  }

  async selectStatus(status: string): Promise<void> {
    await this.page.getByTestId('project-status').selectOption(status);
  }

  async createProject(data: ProjectFormData): Promise<void> {
    await this.fillName(data.name);
    await this.fillOwner(data.owner);
    await this.selectStatus(data.status);
    await this.clickSave();
  }

  async clickClose(): Promise<void> {
    await this.page.getByTestId('create-project-close').click();
  }
}
