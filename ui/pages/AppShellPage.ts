import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { SidebarComponent } from '../components/navigation/SidebarComponent';

export class AppShellPage {
  constructor(private readonly page: Page) {}

  get sidebar(): SidebarComponent {
    return new SidebarComponent(this.page.getByTestId('sidebar-root'));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByTestId('app-shell')).toBeVisible();
  }
}
