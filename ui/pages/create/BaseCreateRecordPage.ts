import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Shared behavior for route-based create overlays (full-screen dim + centered panel).
 */
export abstract class BaseCreateRecordPage {
  constructor(protected readonly page: Page) {}

  /** Full-viewport overlay root (e.g. create-project-overlay). */
  protected abstract overlayRoot(): Locator;

  protected abstract saveButton(): Locator;

  protected abstract cancelButton(): Locator;

  async expectVisible(): Promise<void> {
    await expect(this.overlayRoot()).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.overlayRoot()).toBeHidden();
  }

  /** Alias for tutorials — overlay is open. */
  async expectOverlayOpen(): Promise<void> {
    await this.expectVisible();
  }

  async clickSave(): Promise<void> {
    await this.saveButton().click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton().click();
  }

  /** Substring match on the full URL (e.g. `/projects/new`). */
  async expectUrlContains(part: string): Promise<void> {
    await expect.poll(() => this.page.url()).toContain(part);
  }
}
