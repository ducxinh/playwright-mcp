import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";
import { UserCredentials } from "../types";

export class SignupPage extends BasePage {
  // Locators
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly signupButton: Locator;
  private readonly googleSignupButton: Locator;
  private readonly loginLink: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.nameInput = this.page.getByRole("textbox", { name: "Name *" });
    this.emailInput = this.page.getByRole("textbox", { name: "Email *" });
    this.passwordInput = this.page.getByRole("textbox", {
      name: "Password *",
      exact: true,
    });
    this.confirmPasswordInput = this.page.getByRole("textbox", {
      name: "Confirm Password *",
    });
    this.signupButton = this.page.getByRole("button", { name: "Sign up" });
    this.googleSignupButton = this.page.getByRole("button", {
      name: "Sign in with Google",
    });
    this.loginLink = this.page.getByRole("link", { name: "Login here" });
    this.pageTitle = this.page.getByRole("heading", {
      name: "Create an account",
    });
  }

  /**
   * Navigate to the signup page
   */
  async goto(): Promise<void> {
    await this.navigateTo("/signup");
  }

  /**
   * Fill the signup form with user data
   * @param userData - User credentials and information
   */
  async fillSignupForm(userData: UserCredentials): Promise<void> {
    await this.fill(this.nameInput, userData.username);
    await this.fill(this.emailInput, userData.email);
    await this.fill(this.passwordInput, userData.password);
    await this.fill(this.confirmPasswordInput, userData.password);
  }

  /**
   * Click the signup button to submit the form
   */
  async clickSignup(): Promise<void> {
    await this.click(this.signupButton);
  }

  /**
   * Complete the signup process
   * @param userData - User credentials and information
   */
  async signup(userData: UserCredentials): Promise<void> {
    await this.fillSignupForm(userData);
    await this.clickSignup();
  }

  /**
   * Click the Google signup button
   */
  async clickGoogleSignup(): Promise<void> {
    await this.click(this.googleSignupButton);
  }

  /**
   * Click the login link to navigate to login page
   */
  async clickLoginLink(): Promise<void> {
    await this.click(this.loginLink);
  }

  /**
   * Verify signup page is loaded
   */
  async verifySignupPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.signupButton).toBeVisible();
  }

  /**
   * Verify form validation messages
   */
  async verifyFormValidation(): Promise<void> {
    // Click signup without filling form to trigger validation
    await this.clickSignup();
    // Add specific validation checks based on the actual implementation
  }

  /**
   * Get success notification after signup
   */
  async getSuccessNotification(): Promise<Locator> {
    return this.page
      .locator('[role="alert"]')
      .or(
        this.page
          .locator(".notification")
          .or(this.page.locator("text=Signup successful"))
      );
  }

  /**
   * Get the current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page locator for external access
   */
  getPageLocator(): Page {
    return this.page;
  }

  /**
   * Verify additional page elements
   */
  async verifyAdditionalElements(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Create an account" })
    ).toBeVisible();
    await expect(this.page.getByPlaceholder("Enter your name")).toBeVisible();
    await expect(this.page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(
      this.page.getByPlaceholder("Enter your password")
    ).toBeVisible();
    await expect(
      this.page.getByPlaceholder("Confirm your password")
    ).toBeVisible();
    await expect(this.page.getByText("OR")).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Sign in with Google" })
    ).toBeVisible();
    await expect(this.page.getByText("Already have an account?")).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Login here" })
    ).toBeVisible();
  }

  /**
   * Fill form with mismatched passwords for testing
   */
  async fillFormWithMismatchedPasswords(
    userData: UserCredentials,
    confirmPassword: string
  ): Promise<void> {
    await this.fill(this.nameInput, userData.username);
    await this.fill(this.emailInput, userData.email);
    await this.fill(this.passwordInput, userData.password);
    await this.fill(this.confirmPasswordInput, confirmPassword);
  }

  /**
   * Get Google signup button
   */
  getGoogleSignupButton(): Locator {
    return this.googleSignupButton;
  }
}
