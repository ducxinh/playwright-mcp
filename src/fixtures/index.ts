/**
 * Playwright Test Fixtures
 * Provides reusable test fixtures following best practices
 */

import { test as base, Page } from "@playwright/test";
import { SamplePage } from "../pages/SamplePage";
import { UserCredentials } from "../types";

// Define fixture types
export interface PageFixtures {
  samplePage: SamplePage;
}

// Combine all fixtures
export type TestFixtures = PageFixtures;

/**
 * Extended test with all fixtures
 */
export const test = base.extend<TestFixtures>({
  /**
   * Login Page fixture
   */
  samplePage: async ({ page }, use) => {
    const loginPage = new SamplePage(page);
    await use(loginPage);
  },
});

// Export expect from base test
export { expect } from "@playwright/test";
