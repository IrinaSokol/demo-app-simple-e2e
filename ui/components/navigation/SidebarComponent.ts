import type { Locator } from '@playwright/test';

export class SidebarComponent {
  constructor(private readonly root: Locator) {}

  async openProjects(): Promise<void> {
    await this.root.getByTestId('nav-projects').click();
  }

  async openAssets(): Promise<void> {
    await this.root.getByTestId('nav-assets').click();
  }
}
