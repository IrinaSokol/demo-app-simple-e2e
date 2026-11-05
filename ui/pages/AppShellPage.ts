import type { Locator, Page } from '@playwright/test';
import { SidebarComponent } from '../components/navigation/SidebarComponent';

export class AppShellPage {
  constructor(private readonly page: Page) {}

  get root(): Locator {
    return this.page.getByTestId('app-shell');
  }

  get sidebar(): SidebarComponent {
    return new SidebarComponent(this.page.getByTestId('sidebar-root'));
  }
}
