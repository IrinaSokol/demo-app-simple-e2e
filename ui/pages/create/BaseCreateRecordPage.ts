import type { Locator, Page } from '@playwright/test';

/**
 * Shared behavior for route-based create overlays (full-screen dim + centered panel).
 */
export abstract class BaseCreateRecordPage {
  constructor(protected readonly page: Page) {}

  /** Route of the overlay (e.g. `/projects/new`). */
  abstract readonly url: RegExp;

  /** Full-viewport overlay root (e.g. create-project-overlay). */
  protected abstract overlayRoot(): Locator;

  protected abstract saveButton(): Locator;

  protected abstract cancelButton(): Locator;

  get overlay(): Locator {
    return this.overlayRoot();
  }

  async clickSave(): Promise<void> {
    await this.saveButton().click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton().click();
  }
}
