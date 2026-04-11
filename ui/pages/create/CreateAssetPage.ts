import type { Locator, Page } from '@playwright/test';
import { BaseCreateRecordPage } from './BaseCreateRecordPage';

export type AssetFormData = {
  name: string;
  type: string;
  status: string;
};

export class CreateAssetPage extends BaseCreateRecordPage {
  constructor(page: Page) {
    super(page);
  }

  protected overlayRoot(): Locator {
    return this.page.getByTestId('create-asset-overlay');
  }

  protected saveButton(): Locator {
    return this.page.getByTestId('create-asset-save');
  }

  protected cancelButton(): Locator {
    return this.page.getByTestId('create-asset-cancel');
  }

  async open(): Promise<void> {
    await this.page.goto('/assets/new');
  }

  async fillName(name: string): Promise<void> {
    await this.page.getByTestId('asset-name').fill(name);
  }

  async fillType(type: string): Promise<void> {
    await this.page.getByTestId('asset-type').selectOption(type);
  }

  async selectStatus(status: string): Promise<void> {
    await this.page.getByTestId('asset-status').selectOption(status);
  }

  async createAsset(data: AssetFormData): Promise<void> {
    await this.fillName(data.name);
    await this.fillType(data.type);
    await this.selectStatus(data.status);
    await this.clickSave();
  }

  async clickClose(): Promise<void> {
    await this.page.getByTestId('create-asset-close').click();
  }
}
