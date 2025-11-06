/**
 * Element Actions
 * Reusable actions for interacting with page elements
 * Following Single Responsibility Principle
 */

import { Locator, Page } from "@playwright/test";
import { TIMEOUTS } from "../../config/constants";

export class ElementActions {
  constructor(private readonly page: Page) {}

  /**
   * Click on element with retry logic
   * @param locator - Element to click
   * @param options - Click options
   */
  async click(
    locator: Locator,
    options?: {
      force?: boolean;
      timeout?: number;
      retry?: boolean;
    }
  ): Promise<void> {
    const timeout = options?.timeout || TIMEOUTS.MEDIUM;
    const maxRetries = options?.retry ? 3 : 1;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await locator.click({ force: options?.force, timeout });
        return;
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Double click on element
   * @param locator - Element to double click
   */
  async doubleClick(locator: Locator): Promise<void> {
    await locator.dblclick({ timeout: TIMEOUTS.MEDIUM });
  }

  /**
   * Fill input field
   * @param locator - Input element
   * @param value - Value to fill
   * @param options - Fill options
   */
  async fill(
    locator: Locator,
    value: string,
    options?: {
      clear?: boolean;
      timeout?: number;
    }
  ): Promise<void> {
    if (options?.clear) {
      await locator.clear();
    }
    await locator.fill(value, { timeout: options?.timeout || TIMEOUTS.MEDIUM });
  }

  /**
   * Type text slowly (character by character)
   * @param locator - Input element
   * @param text - Text to type
   * @param delay - Delay between keystrokes
   */
  async type(
    locator: Locator,
    text: string,
    delay: number = 100
  ): Promise<void> {
    await locator.click();
    await locator.type(text, { delay });
  }

  /**
   * Clear input field
   * @param locator - Input element
   */
  async clear(locator: Locator): Promise<void> {
    await locator.clear();
  }

  /**
   * Select option from dropdown
   * @param locator - Select element
   * @param value - Option value/label/index
   */
  async select(
    locator: Locator,
    value:
      | string
      | string[]
      | { value?: string; label?: string; index?: number }
  ): Promise<void> {
    if (typeof value === "string") {
      await locator.selectOption(value);
    } else if (Array.isArray(value)) {
      await locator.selectOption(value);
    } else {
      if (value.value) await locator.selectOption({ value: value.value });
      else if (value.label) await locator.selectOption({ label: value.label });
      else if (value.index !== undefined)
        await locator.selectOption({ index: value.index });
    }
  }

  /**
   * Check checkbox or radio button
   * @param locator - Checkbox/radio element
   */
  async check(locator: Locator): Promise<void> {
    if (!(await locator.isChecked())) {
      await locator.check();
    }
  }

  /**
   * Uncheck checkbox
   * @param locator - Checkbox element
   */
  async uncheck(locator: Locator): Promise<void> {
    if (await locator.isChecked()) {
      await locator.uncheck();
    }
  }

  /**
   * Hover over element
   * @param locator - Element to hover
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover({ timeout: TIMEOUTS.MEDIUM });
  }

  /**
   * Focus on element
   * @param locator - Element to focus
   */
  async focus(locator: Locator): Promise<void> {
    await locator.focus();
  }

  /**
   * Press keyboard key
   * @param key - Key to press
   */
  async press(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Get element text content
   * @param locator - Element
   */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || "";
  }

  /**
   * Get element inner text
   * @param locator - Element
   */
  async getInnerText(locator: Locator): Promise<string> {
    return (await locator.innerText()) || "";
  }

  /**
   * Get input value
   * @param locator - Input element
   */
  async getValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  /**
   * Get element attribute
   * @param locator - Element
   * @param name - Attribute name
   */
  async getAttribute(locator: Locator, name: string): Promise<string | null> {
    return await locator.getAttribute(name);
  }

  /**
   * Check if element is visible
   * @param locator - Element
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible({ timeout: TIMEOUTS.SHORT });
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param locator - Element
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Check if element is checked
   * @param locator - Element
   */
  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  /**
   * Wait for element to be visible
   * @param locator - Element
   * @param timeout - Custom timeout
   */
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: "visible",
      timeout: timeout || TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Wait for element to be hidden
   * @param locator - Element
   * @param timeout - Custom timeout
   */
  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: "hidden",
      timeout: timeout || TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Scroll element into view
   * @param locator - Element to scroll to
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Upload file
   * @param locator - File input element
   * @param filePath - Path to file
   */
  async uploadFile(
    locator: Locator,
    filePath: string | string[]
  ): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  /**
   * Drag and drop
   * @param source - Source element
   * @param target - Target element
   */
  async dragAndDrop(source: Locator, target: Locator): Promise<void> {
    await source.dragTo(target);
  }
}
