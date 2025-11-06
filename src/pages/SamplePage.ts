import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";
import { ElementActions } from "../core/actions/ElementActions";
import { WaitActions } from "../core/actions/WaitActions";

export class SamplePage extends BasePage {
  // Locators
  private readonly nameInput: Locator;
  private readonly submitButton: Locator;
  private readonly successMessage: Locator;
  // Actions
  private readonly elementActions: ElementActions;
  private readonly waitActions: WaitActions;

  constructor(page: Page) {
    super(page);
    this.nameInput = this.page.getByRole("textbox", { name: "name" });
    this.submitButton = this.page.getByRole("button", { name: "Submit" });
    this.successMessage = this.page.getByText("Signup successful!");

    // Initialize actions
    this.elementActions = new ElementActions(page);
    this.waitActions = new WaitActions(page);
  }

  async goto() {
    await this.navigateTo("/sampe-page");
    await this.waitForPageToLoad();
  }

  /**
   * Wait for signup page to be fully loaded
   */
  private async waitForPageToLoad(): Promise<void> {
    await this.waitForVisible(this.nameInput);
  }

  async fillSampleForm(name: string): Promise<void> {
    await this.elementActions.fill(this.nameInput, name);
  }

  async submitForm(): Promise<void> {
    await this.elementActions.click(this.submitButton);
  }

  async isSuccessfullySubmitted(): Promise<boolean> {
    return this.successMessage.isVisible();
  }
}
