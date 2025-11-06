# Copilot instructions for this repository

This repo is a Playwright + TypeScript test project structured around Page Objects and custom fixtures. Follow the patterns below to be productive and consistent.

## Architecture at a glance
- Tests live in `src/tests` (configured in `playwright.config.ts`).
- Page Objects extend `src/core/base/BasePage.ts`, which centralizes navigation, waits, and screenshots, and reads the base URL from `src/config/environment.config.ts`.
- Reusable interactions and waits are in `src/core/actions/ElementActions.ts` and `src/core/actions/WaitActions.ts`.
- Project-wide constants (routes, timeouts, selector conventions) are in `src/config/constants.ts`.
- Types for test data and shared shapes live in `src/types`.
- Custom fixtures are exported from `src/fixtures/index.ts` as `{ test, expect }`; prefer these over importing from `@playwright/test` directly when you need project fixtures.

## Conventions and patterns
- Page Objects use private readonly locators and inject `ElementActions`/`WaitActions` for interactions:
  ```ts
  import { Locator, Page } from '@playwright/test';
  import { BasePage } from '../core/base/BasePage';
  import { ElementActions } from '../core/actions/ElementActions';
  import { WaitActions } from '../core/actions/WaitActions';

  export class SignupPage extends BasePage {
    private readonly nameInput: Locator;
    private readonly submitButton: Locator;
    private readonly elementActions: ElementActions;
    private readonly waitActions: WaitActions;

    constructor(page: Page) {
      super(page);
      this.nameInput = this.page.getByRole('textbox', { name: 'name' });
      this.submitButton = this.page.getByRole('button', { name: 'Submit' });
      this.elementActions = new ElementActions(page);
      this.waitActions = new WaitActions(page);
    }

    async goto() { 
      await this.navigateTo('/signup');
      await this.waitForPageToLoad();
    }

    private async waitForPageToLoad(): Promise<void> {
      await this.waitForVisible(this.nameInput);
    }

    async fillForm(name: string): Promise<void> {
      await this.elementActions.fill(this.nameInput, name);
    }

    async submitForm(): Promise<void> {
      await this.elementActions.click(this.submitButton);
    }

    async isSuccessfullySubmitted(): Promise<boolean> {
    return this.successMessage.isVisible();
    }
  }
  ```
- Use `elementActions.fill()`, `elementActions.click()` instead of direct locator methods.
- Private `waitForPageToLoad()` methods ensure pages are ready before interactions.

## Writing tests
- Use the extended fixtures: `import { test, expect } from '../fixtures'` (relative to `src/tests`).
- Follow AAA Pattern (Arrange-Act-Assert) and use page fixtures for clean tests:
  ```ts
  import { test, expect } from '../fixtures';

  test.describe('Sample Tests', () => {
    test('should submit successfully with valid data', async ({ samplePage }) => {
      const testUser = { name: `testuser_${Date.now()}`, email: 'test@example.com' };
      
      // Arrange
      await samplePage.goto();
      await samplePage.fillSampleForm(testUser.name);
      
      // Act
      await samplePage.submitForm();
      
      // Assert
      const isSuccessful = await samplePage.isSuccessfullySubmitted();
      expect(isSuccessful).toBeTruthy();
    });
  });
  ```
- Use unique timestamped data (`Date.now()`) to avoid conflicts.
- Prefer boolean check methods (`isSuccessfullySubmitted()`) over direct element visibility checks.

### example:
For Signup:
```ts
test.describe("User Signup Flow", () => {
  test("should successfully signup a new user with valid data", async ({
    signupPage,
    accountPage,
  }) => {
    // Generate unique test data to avoid duplicate email issues
    const timestamp = Date.now();
    const testUser: SignupData = {
      name: "Test User",
      email: `testuser_${timestamp}@example.com`,
      password: "TestPassword123!",
      confirmPassword: "TestPassword123!",
    };

    // Arrange: Navigate to signup page
    await signupPage.goto();

    // Act: Fill out the signup form
    await signupPage.fillSignupForm(testUser);

    // Submit the form
    await signupPage.submitForm();

    // Assert: Verify successful signup and account page content
    expect(await accountPage.isOnAccountPage()).toBeTruthy();

    // Verify user information is displayed correctly on account page
    expect(await accountPage.getProfileFullName()).toBe(testUser.name);
    expect(await accountPage.getProfileEmail()).toBe(testUser.email);
  });
```

## Developer workflows
- Install deps: `npm ci`
- Install browsers (first run or CI): `npx playwright install --with-deps`
- Run all tests: `npx playwright test`
- Headed / debug: `npx playwright test --headed` or `npx playwright test --debug`
- Filter by title: `npx playwright test -g "Signup"`
- Open last HTML report: `npx playwright show-report`

Notes:
- `BasePage` uses `env.baseUrl` (from `src/config/environment.config.ts`), while Playwright also sets `use.baseURL`. Prefer `page.goto('/path')` or `BasePage.navigateTo('/path')` to leverage config.
- In page fixtures, extend the base `TestFixtures` type in `src/fixtures/index.ts` to add new page objects.
- No npm scripts are defined; use the `npx playwright ...` commands above.
