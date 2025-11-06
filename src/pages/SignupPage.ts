import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base/BasePage";
import { ElementActions } from "../core/actions/ElementActions";
import { WaitActions } from "../core/actions/WaitActions";
import { SignupData } from "../types";

export class SignupPage extends BasePage {
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly submitButton: Locator;
  private readonly elementActions: ElementActions;
  private readonly waitActions: WaitActions;

  constructor(page: Page) {
    super(page);
    this.nameInput = this.page.getByRole("textbox", { name: "Name *" });
    this.emailInput = this.page.getByRole("textbox", { name: "Email *" });
    this.passwordInput = this.page.getByRole("textbox", {
      name: "Password *",
      exact: true,
    });
    this.confirmPasswordInput = this.page.getByRole("textbox", {
      name: "Confirm Password *",
    });
    this.submitButton = this.page.getByRole("button", { name: "Sign up" });
    this.elementActions = new ElementActions(page);
    this.waitActions = new WaitActions(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/signup");
    await this.waitForPageToLoad();
  }

  private async waitForPageToLoad(): Promise<void> {
    await this.waitForVisible(this.nameInput);
    await this.waitForVisible(this.emailInput);
    await this.waitForVisible(this.passwordInput);
    await this.waitForVisible(this.confirmPasswordInput);
    await this.waitForVisible(this.submitButton);
  }

  async fillSignupForm(signupData: SignupData): Promise<void> {
    await this.elementActions.fill(this.nameInput, signupData.name);
    await this.elementActions.fill(this.emailInput, signupData.email);
    await this.elementActions.fill(this.passwordInput, signupData.password);
    await this.elementActions.fill(
      this.confirmPasswordInput,
      signupData.confirmPassword || signupData.password
    );
  }

  async submitForm(): Promise<void> {
    await this.elementActions.click(this.submitButton);
  }
}
