import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("Signup Demo", () => {
  test("Signup Form - Fill, Submit and Screenshot Result", async ({ page }) => {
    // Initialize page object
    const signupPage = new SignupPage(page);

    // Generate dynamic test data to avoid duplicate email issues
    const testData = SignupPage.generateTestData();
    console.log("Generated test data:", {
      name: testData.name,
      email: testData.email,
      // Password not logged for security
    });

    // Navigate to signup page
    await signupPage.goto();

    // Verify the page loaded correctly
    await signupPage.verifyFormElementsVisible();

    // Take screenshot of initial form state
    await page.screenshot({
      path: "test-results/demo-signup-initial.png",
      fullPage: true,
    });
    console.log("📸 Screenshot taken: Initial form state");

    // Fill the signup form with dynamic data
    await signupPage.fillSignupForm(testData);
    console.log("✅ Form filled with dynamic data");

    // Take screenshot after filling form
    await page.screenshot({
      path: "test-results/demo-signup-filled.png",
      fullPage: true,
    });
    console.log("📸 Screenshot taken: Form filled");

    // Submit the form
    await signupPage.submitForm();
    console.log("🚀 Form submitted");

    // Wait for response
    await page.waitForTimeout(3000);

    // Take screenshot of the result
    await page.screenshot({
      path: "test-results/demo-signup-result.png",
      fullPage: true,
    });
    console.log("📸 Screenshot taken: Form submission result");

    // Check the result
    const isSuccessful = await signupPage.isSignupSuccessful();
    const currentUrl = page.url();

    console.log("📊 Test Results:");
    console.log(`  - Current URL: ${currentUrl}`);
    console.log(`  - Signup successful: ${isSuccessful}`);

    // Log any validation errors if present
    const errors = await signupPage.getValidationErrors();
    if (errors.length > 0) {
      console.log(`  - Validation errors: ${errors.join(", ")}`);
    }

    console.log(
      "✨ Test completed successfully! Check test-results/ folder for screenshots."
    );
  });
});
