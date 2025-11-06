import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";
import { ElementActions } from "../core/actions/ElementActions";
import { WaitActions } from "../core/actions/WaitActions";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class SignupPage extends BasePage {
  // Form Locators
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly signupButton: Locator;
  private readonly googleSigninButton: Locator;
  private readonly loginLink: Locator;

  // Result Locators
  private readonly successNotification: Locator;
  private readonly accountPageHeading: Locator;
  private readonly userDisplayName: Locator;

  // Actions
  private readonly elementActions: ElementActions;
  private readonly waitActions: WaitActions;

  constructor(page: Page) {
    super(page);

    // Form elements
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
    this.googleSigninButton = this.page.getByRole("button", {
      name: "Sign in with Google",
    });
    this.loginLink = this.page.getByRole("link", { name: "Login here" });

    // Result elements
    this.successNotification = this.page.getByText(
      "Signup successful! Please check your email to verify your account."
    );
    this.accountPageHeading = this.page.getByRole("heading", {
      name: "My Profile",
      level: 1,
    });
    this.userDisplayName = this.page.locator("h2").first();

    // Initialize actions
    this.elementActions = new ElementActions(page);
    this.waitActions = new WaitActions(page);
  }

  /**
   * Navigate to the signup page
   */
  async goto(): Promise<void> {
    await this.page.goto("https://dummy-demo-njndex.web.app/signup");
    await this.waitForPageToLoad();
  }

  /**
   * Wait for signup page to be fully loaded
   */
  private async waitForPageToLoad(): Promise<void> {
    await this.waitForVisible(this.nameInput);
    await this.waitForVisible(this.signupButton);
  }

  /**
   * Fill out the signup form with provided data
   */
  async fillSignupForm(formData: SignupFormData): Promise<void> {
    await this.elementActions.fill(this.nameInput, formData.name);
    await this.elementActions.fill(this.emailInput, formData.email);
    await this.elementActions.fill(this.passwordInput, formData.password);
    await this.elementActions.fill(
      this.confirmPasswordInput,
      formData.confirmPassword
    );
  }

  /**
   * Submit the signup form
   */
  async submitForm(): Promise<void> {
    await this.elementActions.click(this.signupButton);
  }

  /**
   * Check if signup was successful by verifying success notification
   */
  async isSignupSuccessful(): Promise<boolean> {
    try {
      await this.successNotification.waitFor({
        state: "visible",
        timeout: 10000,
      });
      return await this.successNotification.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if user is redirected to account page
   */
  async isOnAccountPage(): Promise<boolean> {
    try {
      // Wait for either the My Profile heading or check URL contains /account
      await this.page.waitForURL("**/account", { timeout: 10000 });
      return this.page.url().includes("/account");
    } catch {
      return false;
    }
  }

  /**
   * Get the displayed user name on the account page
   */
  async getDisplayedUserName(): Promise<string> {
    // Look for the user name in the full name textbox which should contain the same value
    const fullNameInput = this.page
      .getByRole("textbox")
      .filter({ hasText: /Test User/ })
      .first();
    await fullNameInput.waitFor({ state: "visible", timeout: 5000 });
    return (await fullNameInput.inputValue()) || "";
  }

  /**
   * Check if Google sign-in option is available
   */
  async isGoogleSigninAvailable(): Promise<boolean> {
    return await this.googleSigninButton.isVisible();
  }

  /**
   * Click on the login link to navigate to login page
   */
  async clickLoginLink(): Promise<void> {
    await this.elementActions.click(this.loginLink);
  }

  /**
   * Generate unique test user data to avoid duplicate email issues
   */
  static generateTestUserData(): SignupFormData {
    const timestamp = Date.now();
    return {
      name: `Test User ${timestamp}`,
      email: `testuser_${timestamp}@example.com`,
      password: "TestPassword123!",
      confirmPassword: "TestPassword123!",
    };
  }
}
