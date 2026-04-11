import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Shared “dashboard” behavior: loader + title + table test id.
 * Child components pass the page-level root and their table test id.
 */
export class BaseDashboardComponent {
  constructor(
    protected readonly root: Locator,
    private readonly tableTestId: string
  ) {}

  /**
   * Ready when the data table is visible (server adds ~300–800ms delay).
   * If the loader is still in the DOM, we wait for it to disappear too.
   */
  async waitForLoaded(): Promise<void> {
    await expect(this.root.getByTestId(this.tableTestId)).toBeVisible({
      timeout: 15_000,
    });
    if ((await this.root.getByTestId('dashboard-loader').count()) > 0) {
      await expect(this.root.getByTestId('dashboard-loader')).toBeHidden();
    }
  }

  async expectTitleContains(text: string): Promise<void> {
    await expect(this.root.getByTestId('dashboard-title')).toContainText(text);
  }
}
