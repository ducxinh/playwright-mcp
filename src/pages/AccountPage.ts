import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";

export class AccountPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly userNameHeading: Locator;
  private readonly userEmail: Locator;
  private readonly successNotification: Locator;
  private readonly profileButton: Locator;
  private readonly ordersButton: Locator;
  private readonly wishlistButton: Locator;
  private readonly settingsButton: Locator;
  private readonly logoutButton: Locator;
  private readonly fullNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneNumberInput: Locator;
  private readonly birthdayInput: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.pageTitle = this.page.getByRole("heading", { name: "My Account" });
    this.userNameHeading = this.page.getByRole("heading", { level: 2 });
    this.userEmail = this.page.locator("text=/.*@.*\\..*/"); // Email pattern
    this.successNotification = this.page.locator(
      "text=Signup successful! Please check your email to verify your account."
    );
    this.profileButton = this.page.getByRole("button", { name: "Profile" });
    this.ordersButton = this.page.getByRole("button", { name: "Orders" });
    this.wishlistButton = this.page.getByRole("button", { name: "Wishlist" });
    this.settingsButton = this.page.getByRole("button", { name: "Settings" });
    this.logoutButton = this.page.getByRole("button", { name: "Logout" });
    this.fullNameInput = this.page
      .locator("input")
      .filter({ hasText: "John" })
      .first();
    this.emailInput = this.page.locator('input[value*="@"]');
    this.phoneNumberInput = this.page.getByPlaceholder(
      "Enter your phone number"
    );
    this.birthdayInput = this.page.locator('input[placeholder="dd/mm/yyyy"]');
  }

  /**
   * Navigate to the account page
   */
  async goto(): Promise<void> {
    await this.navigateTo("/account");
  }

  /**
   * Verify account page is loaded after successful signup
   */
  async verifyAccountPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.profileButton).toBeVisible();
    await expect(this.ordersButton).toBeVisible();
    await expect(this.wishlistButton).toBeVisible();
  }

  /**
   * Verify success notification is displayed
   */
  async verifySuccessNotification(): Promise<void> {
    await expect(this.successNotification).toBeVisible();
  }

  /**
   * Verify user information is displayed correctly
   * @param expectedName - Expected user name
   * @param expectedEmail - Expected email address
   */
  async verifyUserInformation(
    expectedName: string,
    expectedEmail: string
  ): Promise<void> {
    // Verify user name in heading
    await expect(this.userNameHeading).toContainText(expectedName);

    // Verify email is displayed
    await expect(this.page.locator(`text=${expectedEmail}`)).toBeVisible();
  }

  /**
   * Verify the user profile section
   * @param expectedName - Expected user name
   * @param expectedEmail - Expected email address
   */
  async verifyUserProfile(
    expectedName: string,
    expectedEmail: string
  ): Promise<void> {
    // Check personal information section
    await expect(
      this.page.getByRole("heading", { name: "Personal Information" })
    ).toBeVisible();

    // Verify form fields contain the correct data
    await expect(this.fullNameInput).toHaveValue(expectedName);
    await expect(this.emailInput).toHaveValue(expectedEmail);
  }

  /**
   * Verify the current URL is the account page
   */
  async verifyAccountUrl(): Promise<void> {
    expect(this.page.url()).toContain("/account");
  }

  /**
   * Take a screenshot for verification
   */
  async captureScreenshot(filename?: string): Promise<void> {
    const screenshotName = filename || `account-page-${Date.now()}.png`;
    await this.page.screenshot({
      path: screenshotName,
      fullPage: true,
    });
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.click(this.logoutButton);
  }
}
