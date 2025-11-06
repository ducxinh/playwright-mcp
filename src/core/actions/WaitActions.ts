/**
 * Wait Actions
 * Reusable wait strategies for better test stability
 */

import { Locator, Page } from "@playwright/test";
import { TIMEOUTS } from "../../config/constants";

export class WaitActions {
  constructor(private readonly page: Page) {}

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout: TIMEOUTS.LONG });
  }

  /**
   * Wait for specific URL
   * @param urlPattern - URL pattern to wait for
   * @param timeout - Custom timeout
   */
  async waitForUrl(
    urlPattern: string | RegExp,
    timeout?: number
  ): Promise<void> {
    await this.page.waitForURL(urlPattern, {
      timeout: timeout || TIMEOUTS.LONG,
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * Wait for button to complete submission (loading state)
   * @param buttonLocator - Button element
   * @param buttonText - Original button text
   * @param loadingText - Loading state text
   */
  async waitForButtonSubmission(
    buttonLocator: Locator,
    buttonText: string,
    loadingText?: string
  ): Promise<void> {
    const actualLoadingText = loadingText || buttonText;

    try {
      // Wait for loading state
      const loadingButton = this.page.getByRole("button", {
        name: actualLoadingText,
      });
      await loadingButton.waitFor({
        state: "visible",
        timeout: TIMEOUTS.SHORT,
      });

      // Wait for completion (button disappears or returns to original text)
      await Promise.race([
        loadingButton.waitFor({ state: "hidden", timeout: TIMEOUTS.MEDIUM }),
        this.page
          .getByRole("button", { name: buttonText })
          .waitFor({ state: "visible", timeout: TIMEOUTS.MEDIUM }),
      ]);
    } catch {
      // Continue if button state change not detected
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Wait for element count
   * @param locator - Element locator
   * @param count - Expected count
   * @param timeout - Custom timeout
   */
  async waitForElementCount(
    locator: Locator,
    count: number,
    timeout?: number
  ): Promise<void> {
    await locator.first().waitFor({ timeout: timeout || TIMEOUTS.MEDIUM });
    const actualCount = await locator.count();
    if (actualCount !== count) {
      throw new Error(`Expected ${count} elements, but found ${actualCount}`);
    }
  }

  /**
   * Wait for text to appear
   * @param text - Text to wait for
   * @param timeout - Custom timeout
   */
  async waitForText(text: string, timeout?: number): Promise<void> {
    await this.page.getByText(text).waitFor({
      state: "visible",
      timeout: timeout || TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Wait for text to disappear
   * @param text - Text to wait for
   * @param timeout - Custom timeout
   */
  async waitForTextToDisappear(text: string, timeout?: number): Promise<void> {
    await this.page.getByText(text).waitFor({
      state: "hidden",
      timeout: timeout || TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Wait for specific timeout
   * @param ms - Milliseconds to wait
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Wait for selector to be present
   * @param selector - CSS selector
   * @param timeout - Custom timeout
   */
  async waitForSelector(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, {
      state: "visible",
      timeout: timeout || TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Wait for function to return truthy value
   * @param fn - Function to evaluate
   * @param timeout - Custom timeout
   */
  async waitForFunction(
    fn: () => boolean | Promise<boolean>,
    timeout?: number
  ): Promise<void> {
    await this.page.waitForFunction(fn, {
      timeout: timeout || TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Wait for page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState("domcontentloaded"),
      this.page.waitForLoadState("networkidle", { timeout: TIMEOUTS.MEDIUM }),
    ]);
  }
}
