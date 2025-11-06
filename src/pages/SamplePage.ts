import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";

export class SamplePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.click('a[href="/sample-section"]');
  }
}
