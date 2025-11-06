import { test, expect } from "../fixtures";
import { SignupPage } from "../pages/SignupPage";

test.describe("User Signup Flow", () => {
  test("should successfully sign up a new user with valid data", async ({
    signupPage,
  }) => {
    // Arrange - Generate unique test data to avoid duplicate emails
    const testUserData = SignupPage.generateTestUserData();

    // Act - Navigate to signup page
    await signupPage.goto();

    // Act - Fill out the signup form
    await signupPage.fillSignupForm(testUserData);

    // Act - Submit the form
    await signupPage.submitForm();

    // Assert - Verify signup was successful
    const isSignupSuccessful = await signupPage.isSignupSuccessful();
    expect(isSignupSuccessful).toBeTruthy();

    // Assert - Verify user is redirected to account page
    const isOnAccountPage = await signupPage.isOnAccountPage();
    expect(isOnAccountPage).toBeTruthy();

    // Assert - Verify user name is displayed correctly
    const displayedUserName = await signupPage.getDisplayedUserName();
    expect(displayedUserName).toBe(testUserData.name);
  });

  test("should display signup page elements correctly", async ({
    signupPage,
    page,
  }) => {
    // Arrange & Act - Navigate to signup page
    await signupPage.goto();

    // Assert - Verify all required form elements are visible
    await expect(page.getByRole("textbox", { name: "Name *" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email *" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Password *", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Confirm Password *" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
  });

  test("should display Google signup option", async ({ signupPage }) => {
    // Arrange & Act - Navigate to signup page
    await signupPage.goto();

    // Assert - Verify Google sign-in option is available
    const isGoogleSigninAvailable = await signupPage.isGoogleSigninAvailable();
    expect(isGoogleSigninAvailable).toBeTruthy();
  });
});
