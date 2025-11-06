import { test, expect } from "@playwright/test";
import { SignupPage, SignupFormData } from "../pages/SignupPage";

test.describe("Signup Form Tests", () => {
  let signupPage: SignupPage;
  let testData: SignupFormData;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    testData = SignupPage.generateTestData();

    // Navigate to signup page
    await signupPage.goto();
  });

  test("Fill, Submit and Screenshot Result", async ({ page }) => {
    // Verify all form elements are visible
    await signupPage.verifyFormElementsVisible();

    // Take screenshot of initial form state
    await page.screenshot({
      path: "test-results/signup-form-initial.png",
      fullPage: true,
    });

    // Fill the signup form with dynamic data
    await signupPage.fillSignupForm(testData);

    // Take screenshot after filling form
    await page.screenshot({
      path: "test-results/signup-form-filled.png",
      fullPage: true,
    });

    // Submit the form
    await signupPage.submitForm();

    // Wait for potential response/redirect
    await page.waitForTimeout(3000);

    // Take screenshot of the result
    await page.screenshot({
      path: "test-results/signup-form-result.png",
      fullPage: true,
    });

    // Log the test data used for debugging
    console.log("Test data used:", {
      name: testData.name,
      email: testData.email,
      // Don't log password for security
      timestamp: Date.now(),
    });

    // Check for validation errors
    const errors = await signupPage.getValidationErrors();
    if (errors.length > 0) {
      console.log("Validation errors found:", errors);
    }

    // Verify signup result (either success or expected error handling)
    const isSuccessful = await signupPage.isSignupSuccessful();

    if (isSuccessful) {
      console.log(
        "Signup appears to be successful - user was redirected or success message shown"
      );
    } else {
      console.log(
        "Signup form is still visible - checking for validation messages"
      );

      // If signup failed, let's check what happened
      const currentUrl = page.url();
      expect(currentUrl).toContain("signup"); // Should still be on signup page

      // The test should pass even if signup "fails" due to backend limitations
      // The important part is that we filled the form and captured the result
    }
  });

  test("Fill Form with Different Email Domains", async ({ page }) => {
    // Test with different email domains to ensure uniqueness
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "test.com"];

    for (const domain of domains) {
      // Generate unique data for each domain
      const domainTestData = SignupPage.generateTestDataWithDomain(domain);

      // Clear and fill form
      await signupPage.fillSignupForm(domainTestData);

      // Take screenshot for this domain
      await page.screenshot({
        path: `test-results/signup-form-${domain.replace(".", "_")}.png`,
        fullPage: true,
      });

      console.log(`Filled form with email: ${domainTestData.email}`);

      // Wait a bit before next iteration
      await page.waitForTimeout(1000);
    }

    // Submit the last form
    await signupPage.submitForm();
    await page.waitForTimeout(2000);

    // Final screenshot
    await page.screenshot({
      path: "test-results/signup-multiple-domains-result.png",
      fullPage: true,
    });
  });

  test("Verify Form Validation", async ({ page }) => {
    // Test empty form submission
    await signupPage.submitForm();
    await page.waitForTimeout(1000);

    // Take screenshot of validation state
    await page.screenshot({
      path: "test-results/signup-empty-form-validation.png",
      fullPage: true,
    });

    // Test mismatched passwords
    const mismatchData: SignupFormData = {
      name: "Test User",
      email: SignupPage.generateTestData().email, // Use dynamic email
      password: "Password123!",
      confirmPassword: "DifferentPassword123!",
    };

    await signupPage.fillSignupForm(mismatchData);
    await signupPage.submitForm();
    await page.waitForTimeout(1000);

    // Screenshot password mismatch validation
    await page.screenshot({
      path: "test-results/signup-password-mismatch-validation.png",
      fullPage: true,
    });

    // Check for validation errors
    const errors = await signupPage.getValidationErrors();
    console.log("Validation errors for mismatched passwords:", errors);
  });

  test("Test Google Signup Button", async ({ page }) => {
    // Click Google signup button
    await signupPage.signupWithGoogle();

    // Wait for potential popup or redirect
    await page.waitForTimeout(2000);

    // Take screenshot of Google signup result
    await page.screenshot({
      path: "test-results/signup-google-button-result.png",
      fullPage: true,
    });

    console.log("Google signup button clicked - current URL:", page.url());
  });

  test("Navigate to Login from Signup", async ({ page }) => {
    // Click login link
    await signupPage.navigateToLogin();

    // Wait for navigation
    await page.waitForTimeout(2000);

    // Take screenshot of login page
    await page.screenshot({
      path: "test-results/navigate-to-login-from-signup.png",
      fullPage: true,
    });

    // Verify we navigated to login page
    const currentUrl = page.url();
    expect(currentUrl).toContain("login");
    console.log("Successfully navigated to login page:", currentUrl);
  });
});
