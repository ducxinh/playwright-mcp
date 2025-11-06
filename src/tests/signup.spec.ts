/**
 * User Signup Flow Tests
 * Tests the complete user registration process including form validation and success verification
 */

import { test, expect } from "../fixtures";
import { UserCredentials } from "../types";

test.describe("User Signup Flow", () => {
  let testUser: UserCredentials;

  test.beforeEach(async () => {
    // Generate dynamic test data to avoid duplicate email issues
    const timestamp = Date.now();
    testUser = {
      username: "John Doe",
      email: `test.user.${timestamp}@example.com`,
      password: "SecurePassword123!",
    };
  });

  test("should successfully register a new user with valid data", async ({
    signupPage,
    accountPage,
  }) => {
    // Navigate to signup page
    await signupPage.goto();

    // Verify signup page is loaded
    await signupPage.verifySignupPageLoaded();

    // Fill and submit signup form
    await signupPage.signup(testUser);

    // Verify redirection to account page
    await accountPage.verifyAccountUrl();

    // Verify account page is loaded
    await accountPage.verifyAccountPageLoaded();

    // Verify success notification
    await accountPage.verifySuccessNotification();

    // Verify user information is displayed correctly
    await accountPage.verifyUserInformation(testUser.username, testUser.email);

    // Verify user profile section
    await accountPage.verifyUserProfile(testUser.username, testUser.email);

    // Take screenshot for verification
    await accountPage.captureScreenshot(`signup-success-${Date.now()}.png`);
  });

  test("should display signup page elements correctly", async ({
    signupPage,
  }) => {
    // Navigate to signup page
    await signupPage.goto();

    // Verify all form elements are visible and accessible
    await signupPage.verifySignupPageLoaded();

    // Verify additional page elements
    await signupPage.verifyAdditionalElements();
  });

  test("should navigate to login page when clicking login link", async ({
    signupPage,
  }) => {
    // Navigate to signup page
    await signupPage.goto();

    // Click login link
    await signupPage.clickLoginLink();

    // Verify navigation to login page
    expect(signupPage.getCurrentUrl()).toContain("/login");
  });

  test("should handle form validation for empty fields", async ({
    signupPage,
  }) => {
    // Navigate to signup page
    await signupPage.goto();

    // Try to submit empty form
    await signupPage.clickSignup();

    // Form should remain on the same page (validation should prevent submission)
    expect(signupPage.getCurrentUrl()).toContain("/signup");

    // Verify form elements are still visible
    await signupPage.verifySignupPageLoaded();
  });

  test("should handle mismatched passwords", async ({ signupPage }) => {
    // Navigate to signup page
    await signupPage.goto();

    // Fill form with mismatched passwords
    const mismatchedUser: UserCredentials = {
      username: "Test User",
      email: `test.${Date.now()}@example.com`,
      password: "Password123!",
    };

    await signupPage.fillFormWithMismatchedPasswords(
      mismatchedUser,
      "DifferentPassword123!"
    );

    // Try to submit form
    await signupPage.clickSignup();

    // Should remain on signup page due to validation
    expect(signupPage.getCurrentUrl()).toContain("/signup");
  });

  test("should display Google signup option", async ({ signupPage }) => {
    // Navigate to signup page
    await signupPage.goto();

    // Verify Google signup button is present and clickable
    const googleButton = signupPage.getGoogleSignupButton();
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();

    // Verify Google icon is present within the button
    await expect(googleButton.locator("img")).toBeVisible();
  });
});
