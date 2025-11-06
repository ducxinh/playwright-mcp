/**
 * Playwright Test Fixtures
 * Provides reusable test fixtures following best practices
 */

import { test as base, Page } from "@playwright/test";
import { SamplePage } from "../pages/SamplePage";
import { SignupPage } from "../pages/SignupPage";
import { AccountPage } from "../pages/AccountPage";
import { UserCredentials } from "../types";

// Define fixture types
export interface PageFixtures {
  samplePage: SamplePage;
  signupPage: SignupPage;
  accountPage: AccountPage;
}

// Combine all fixtures
export type TestFixtures = PageFixtures;

/**
 * Extended test with all fixtures
 */
export const test = base.extend<TestFixtures>({
  /**
   * Sample Page fixture
   */
  samplePage: async ({ page }, use) => {
    const samplePage = new SamplePage(page);
    await use(samplePage);
  },

  /**
   * Signup Page fixture
   */
  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },

  /**
   * Account Page fixture
   */
  accountPage: async ({ page }, use) => {
    const accountPage = new AccountPage(page);
    await use(accountPage);
  },
});

// Export expect from base test
export { expect } from "@playwright/test";
