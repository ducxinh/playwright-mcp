import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";
import { ElementActions } from "../core/actions/ElementActions";
import { WaitActions } from "../core/actions/WaitActions";

export class AccountPage extends BasePage {
  private readonly userNameHeading: Locator;
  private readonly userEmailText: Locator;
  private readonly fullNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly successNotification: Locator;
  private readonly elementActions: ElementActions;
  private readonly waitActions: WaitActions;

  constructor(page: Page) {
    super(page);
    this.userNameHeading = this.page.locator("h2"); // The h2 element containing user name
    this.userEmailText = this.page.locator("p").filter({ hasText: /@/ }); // Paragraph containing email
    this.fullNameInput = this.page.locator("input").nth(0); // First input in profile form (Full Name)
    this.emailInput = this.page.locator("input").nth(1); // Second input in profile form (Email)
    this.phoneInput = this.page.getByPlaceholder("Enter your phone number"); // Phone number input
    this.successNotification = this.page.locator(
      "text=Signup successful! Please check your email to verify your account."
    );
    this.elementActions = new ElementActions(page);
    this.waitActions = new WaitActions(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/account");
    await this.waitForPageToLoad();
  }

  private async waitForPageToLoad(): Promise<void> {
    await this.waitForVisible(this.userNameHeading);
    await this.waitForVisible(this.fullNameInput);
    await this.waitForVisible(this.emailInput);
    await this.waitForVisible(this.phoneInput);
  }

  async isSuccessNotificationVisible(): Promise<boolean> {
    return await this.isVisible(this.successNotification);
  }

  async getDisplayedUserName(): Promise<string> {
    return (await this.userNameHeading.textContent()) || "";
  }

  async getDisplayedUserEmail(): Promise<string> {
    return (await this.userEmailText.textContent()) || "";
  }

  async getProfileFullName(): Promise<string> {
    return await this.fullNameInput.inputValue();
  }

  async getProfileEmail(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async isOnAccountPage(): Promise<boolean> {
    return this.isOnPage("/account");
  }
}
