/**
 * User Signup Flow Tests
 * Tests the complete signup process including form validation and profile display
 */

import { test, expect } from "../fixtures";
import { SignupData } from "../types";

test.describe("User Signup Flow", () => {
  test("should successfully signup a new user with valid data", async ({
    signupPage,
    accountPage,
  }) => {
    // Generate unique test data to avoid duplicate email issues
    const timestamp = Date.now();
    const testUser: SignupData = {
      name: "Test User",
      email: `testuser_${timestamp}@example.com`,
      password: "TestPassword123!",
      confirmPassword: "TestPassword123!",
    };

    // Arrange: Navigate to signup page
    await signupPage.goto();

    // Act: Fill out the signup form
    await signupPage.fillSignupForm(testUser);

    // Submit the form
    await signupPage.submitForm();

    // Assert: Verify successful signup and account page content
    expect(await accountPage.isOnAccountPage()).toBeTruthy();

    // Verify user information is displayed correctly on account page
    expect(await accountPage.getProfileFullName()).toBe(testUser.name);
    expect(await accountPage.getProfileEmail()).toBe(testUser.email);

    // Verify Personal Information section shows correct data
    expect(await accountPage.getPersonalInfoFullName()).toBe(testUser.name);
    expect(await accountPage.getPersonalInfoEmail()).toBe(testUser.email);
  });

  test("should display entered email correctly in profile section", async ({
    signupPage,
    accountPage,
  }) => {
    // Generate unique test data
    const timestamp = Date.now();
    const testUser: SignupData = {
      name: "Profile Test User",
      email: `profiletest_${timestamp}@example.com`,
      password: "SecurePassword456!",
      confirmPassword: "SecurePassword456!",
    };

    // Arrange: Navigate and fill signup form
    await signupPage.goto();
    await signupPage.fillSignupForm(testUser);

    // Act: Submit the form
    await signupPage.submitForm();

    // Assert: Focus on email validation as per requirements
    await expect(accountPage.isOnAccountPage()).resolves.toBeTruthy();

    // Verify the entered email is correctly displayed in both locations
    const profileEmail = await accountPage.getProfileEmail();
    const personalInfoEmail = await accountPage.getPersonalInfoEmail();

    expect(profileEmail).toBe(testUser.email);
    expect(personalInfoEmail).toBe(testUser.email);
  });

  test("should handle signup with different email formats", async ({
    signupPage,
    accountPage,
  }) => {
    // Test with different email format
    const timestamp = Date.now();
    const testUser: SignupData = {
      name: "Email Format Test",
      email: `test.email+tag_${timestamp}@domain.co.uk`,
      password: "ComplexPassword789!",
      confirmPassword: "ComplexPassword789!",
    };

    // Arrange & Act
    await signupPage.goto();
    await signupPage.fillSignupForm(testUser);
    await signupPage.submitForm();

    // Assert: Verify the complex email format is preserved
    expect(await accountPage.isOnAccountPage()).toBeTruthy();
    expect(await accountPage.getPersonalInfoEmail()).toBe(testUser.email);
  });
});
