import type { Locator } from '@playwright/test';

/**
 * Shared “dashboard” behavior: loader + title + table test id.
 * Child components pass the page-level root and their table test id.
 */
export class BaseDashboardComponent {
  constructor(
    protected readonly root: Locator,
    private readonly tableTestId: string
  ) {}

  get title(): Locator {
    return this.root.getByTestId('dashboard-title');
  }

  /**
   * Ready when the data table is visible (server adds ~300–800ms delay) and the loader is gone.
   * This waits; it does not assert.
   */
  async waitForLoaded(): Promise<void> {
    await this.root.getByTestId(this.tableTestId).waitFor({ state: 'visible', timeout: 15_000 });
    await this.root.getByTestId('dashboard-loader').waitFor({ state: 'hidden' });
  }
}
