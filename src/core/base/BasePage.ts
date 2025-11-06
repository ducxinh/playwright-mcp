import { Locator, Page } from "@playwright/test";
import { env } from "../../config/environment.config";
import { TIMEOUTS } from "../../config/constants";
import { WaitForState } from "../../types";

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = env.baseUrl;
  }

  /**
   * Navigate to a specific path
   * @param path - Relative or absolute path
   */
  async navigateTo(path: string): Promise<void> {
    const fullUrl = this.resolveUrl(path);
    await this.page.goto(fullUrl, {
      waitUntil: "domcontentloaded",
      timeout: env.timeout.navigation,
    });
    await this.waitForPageLoad();
  }

  /**
   * Resolve URL - converts relative path to absolute URL
   * @param path - Relative or absolute path
   */
  protected resolveUrl(path: string): string {
    if (path.startsWith("http")) {
      return path;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  // Element interactions with built-in waits
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.clear();
    await locator.fill(text);
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.selectOption(value);
  }

  async check(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    if (!(await locator.isChecked())) {
      await locator.check();
    }
  }

  async uncheck(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    if (await locator.isChecked()) {
      await locator.uncheck();
    }
  }

  /**
   * Wait for page to fully load
   */
  protected async waitForPageLoad(): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState("domcontentloaded"),
      this.page.waitForLoadState("networkidle", { timeout: TIMEOUTS.MEDIUM }),
    ]);
  }

  /**
   * Wait for element to be in a specific state
   * @param locator - Element locator
   * @param state - Desired state
   * @param timeout - Custom timeout
   */
  protected async waitForElement(
    locator: Locator,
    state: WaitForState = "visible",
    timeout: number = TIMEOUTS.MEDIUM
  ): Promise<void> {
    await locator.waitFor({ state, timeout });
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Custom timeout
   */
  protected async waitForVisible(
    locator: Locator,
    timeout?: number
  ): Promise<void> {
    await this.waitForElement(locator, "visible", timeout);
  }

  /**
   * Wait for element to be hidden
   * @param locator - Element locator
   * @param timeout - Custom timeout
   */
  protected async waitForHidden(
    locator: Locator,
    timeout?: number
  ): Promise<void> {
    await this.waitForElement(locator, "hidden", timeout);
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
   * @param timeout - Custom timeout
   */
  protected async isVisible(
    locator: Locator,
    timeout: number = TIMEOUTS.SHORT
  ): Promise<boolean> {
    try {
      await locator.waitFor({ state: "visible", timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Check if current URL contains specific path
   * @param path - Path to check
   */
  isOnPage(path: string): boolean {
    return this.getCurrentUrl().includes(path);
  }

  /**
   * Reload current page
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: "domcontentloaded" });
    await this.waitForPageLoad();
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: "domcontentloaded" });
    await this.waitForPageLoad();
  }

  /**
   * Take screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Abstract method to navigate to page's default URL
   * Must be implemented by child classes
   */
  abstract goto(): Promise<void>;
}
