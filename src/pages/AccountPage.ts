import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";
import { ElementActions } from "../core/actions/ElementActions";
import { WaitActions } from "../core/actions/WaitActions";

export class AccountPage extends BasePage {
  private readonly profileNameHeading: Locator;
  private readonly profileEmailText: Locator;
  private readonly fullNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly myProfileHeading: Locator;
  private readonly elementActions: ElementActions;
  private readonly waitActions: WaitActions;

  constructor(page: Page) {
    super(page);
    // Profile section elements - using specific locators based on the account page structure
    this.profileNameHeading = this.page.getByRole("heading", { level: 2 });
    this.profileEmailText = this.profileNameHeading.locator("..").locator("p");

    // Personal Information form elements - using position-based selectors within the form
    this.fullNameInput = this.page
      .getByRole("heading", { name: "Personal Information" })
      .locator("..")
      .locator("input")
      .first();
    this.emailInput = this.page
      .getByRole("heading", { name: "Personal Information" })
      .locator("..")
      .locator("input")
      .nth(1);
    this.myProfileHeading = this.page.getByRole("heading", {
      name: "My Profile",
    });

    this.elementActions = new ElementActions(page);
    this.waitActions = new WaitActions(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/account");
    await this.waitForPageToLoad();
  }

  private async waitForPageToLoad(): Promise<void> {
    await this.waitForVisible(this.myProfileHeading);
  }

  async isOnAccountPage(): Promise<boolean> {
    try {
      await this.waitForVisible(this.myProfileHeading);
      return await this.myProfileHeading.isVisible();
    } catch {
      return false;
    }
  }

  async getProfileFullName(): Promise<string> {
    await this.waitForVisible(this.profileNameHeading);
    return (await this.profileNameHeading.textContent()) || "";
  }

  async getProfileEmail(): Promise<string> {
    await this.waitForVisible(this.profileEmailText);
    return (await this.profileEmailText.textContent()) || "";
  }

  async getPersonalInfoFullName(): Promise<string> {
    await this.waitForVisible(this.fullNameInput);
    return await this.fullNameInput.inputValue();
  }

  async getPersonalInfoEmail(): Promise<string> {
    await this.waitForVisible(this.emailInput);
    return await this.emailInput.inputValue();
  }
}
