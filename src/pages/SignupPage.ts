import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";
import { ROUTES, SELECTORS, TIMEOUTS } from "../config/constants";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class SignupPage extends BasePage {
  // Form elements
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly signupButton: Locator;
  private readonly googleSigninButton: Locator;
  private readonly loginLink: Locator;

  // Form labels and headings
  private readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.nameInput = page.getByPlaceholder("Enter your name");
    this.emailInput = page.getByPlaceholder("Enter your email");
    this.passwordInput = page.getByPlaceholder("Enter your password");
    this.confirmPasswordInput = page.getByPlaceholder("Confirm your password");
    this.signupButton = page.getByRole("button", { name: "Sign up" });
    this.googleSigninButton = page.getByRole("button", {
      name: "Sign in with Google",
    });
    this.loginLink = page.getByRole("link", { name: "Login here" });
    this.pageHeading = page.getByRole("heading", { name: "Create an account" });
  }

  /**
   * Navigate to the signup page
   */
  async goto(): Promise<void> {
    await this.navigateTo(ROUTES.SIGNUP);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the signup page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.pageHeading.waitFor({
      state: "visible",
      timeout: TIMEOUTS.MEDIUM,
    });
    await this.signupButton.waitFor({
      state: "visible",
      timeout: TIMEOUTS.MEDIUM,
    });
  }

  /**
   * Fill the signup form with provided data
   */
  async fillSignupForm(formData: SignupFormData): Promise<void> {
    await this.fill(this.nameInput, formData.name);
    await this.fill(this.emailInput, formData.email);
    await this.fill(this.passwordInput, formData.password);
    await this.fill(this.confirmPasswordInput, formData.confirmPassword);
  }

  /**
   * Submit the signup form
   */
  async submitForm(): Promise<void> {
    await this.click(this.signupButton);
  }

  /**
   * Complete signup process with form data
   */
  async signup(formData: SignupFormData): Promise<void> {
    await this.fillSignupForm(formData);
    await this.submitForm();
  }

  /**
   * Click on Google sign-in button
   */
  async signupWithGoogle(): Promise<void> {
    await this.click(this.googleSigninButton);
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.click(this.loginLink);
  }

  /**
   * Verify all form elements are visible
   */
  async verifyFormElementsVisible(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.signupButton).toBeVisible();
    await expect(this.googleSigninButton).toBeVisible();
    await expect(this.loginLink).toBeVisible();
  }

  /**
   * Get form validation errors if any
   */
  async getValidationErrors(): Promise<string[]> {
    const errorElements = this.page.locator(
      '[role="alert"], .error-message, .text-red-500'
    );
    const errors: string[] = [];
    const count = await errorElements.count();

    for (let i = 0; i < count; i++) {
      const errorText = await errorElements.nth(i).textContent();
      if (errorText) {
        errors.push(errorText.trim());
      }
    }

    return errors;
  }

  /**
   * Check if signup was successful by looking for success indicators
   */
  async isSignupSuccessful(): Promise<boolean> {
    // Wait a bit for potential redirect or success message
    await this.page.waitForTimeout(2000);

    // Check if we're redirected away from signup page
    const currentUrl = this.page.url();
    if (!currentUrl.includes("/signup")) {
      return true;
    }

    // Check for success messages
    const successElements = this.page.locator(
      '[role="status"], .success-message, .text-green-500'
    );
    const successCount = await successElements.count();

    return successCount > 0;
  }

  /**
   * Generate dynamic test data to avoid duplicate emails
   */
  static generateTestData(): SignupFormData {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);

    return {
      name: `Test User ${timestamp}`,
      email: `testuser${timestamp}${randomNum}@example.com`,
      password: "TestPassword123!",
      confirmPassword: "TestPassword123!",
    };
  }

  /**
   * Generate test data with custom email domain
   */
  static generateTestDataWithDomain(
    domain: string = "example.com"
  ): SignupFormData {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);

    return {
      name: `Test User ${timestamp}`,
      email: `testuser${timestamp}${randomNum}@${domain}`,
      password: "TestPassword123!",
      confirmPassword: "TestPassword123!",
    };
  }
}
