import type { Locator } from '@playwright/test';

/** Table helper scoped to a single table root (e.g. projects-table). */
export class DataTableComponent {
  constructor(private readonly table: Locator) {}

  rowByText(text: string): Locator {
    return this.table.getByTestId('row').filter({ hasText: text });
  }

  /** Clicks a row; only tables rendered with `onRowClick` in the app navigate on click. */
  async openRow(text: string): Promise<void> {
    await this.rowByText(text).click();
  }
}
