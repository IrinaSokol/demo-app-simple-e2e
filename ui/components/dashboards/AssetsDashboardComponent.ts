import type { Locator } from '@playwright/test';
import { DataTableComponent } from '../common/DataTableComponent';
import { BaseDashboardComponent } from './BaseDashboardComponent';

export class AssetsDashboardComponent extends BaseDashboardComponent {
  private readonly table: DataTableComponent;

  constructor(root: Locator) {
    super(root, 'assets-table');
    this.table = new DataTableComponent(root.getByTestId('assets-table'));
  }

  async expectHasAsset(name: string): Promise<void> {
    await this.table.expectRowVisible(name);
  }

  async search(text: string): Promise<void> {
    await this.root.getByTestId('assets-search').fill(text);
  }
}
