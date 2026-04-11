import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AppShellPage } from '../AppShellPage';
import { AssetsDashboardComponent } from '../../components/dashboards/AssetsDashboardComponent';

export class AssetsDashboardPage {
  constructor(private readonly page: Page) {}

  get shell(): AppShellPage {
    return new AppShellPage(this.page);
  }

  get root(): Locator {
    return this.page.getByTestId('assets-dashboard-root');
  }

  get dashboard(): AssetsDashboardComponent {
    return new AssetsDashboardComponent(this.root);
  }

  async open(): Promise<void> {
    await this.page.goto('/assets');
  }

  async expectOpen(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async openCreateAsset(): Promise<void> {
    await this.page.getByTestId('assets-new').click();
  }

  async expectUrlIsAssetsList(): Promise<void> {
    await expect(this.page).toHaveURL(/\/assets$/);
  }
}
