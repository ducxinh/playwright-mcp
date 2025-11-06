import { test, expect } from "../fixtures";
import { SignupData } from "../types";

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

    // Verify form fields are filled correctly before submission
    expect(await signupPage.getFilledName()).toBe(testUser.name);
    expect(await signupPage.getFilledEmail()).toBe(testUser.email);
    expect(await signupPage.getFilledPassword()).toBe(testUser.password);
    expect(await signupPage.getFilledConfirmPassword()).toBe(
      testUser.confirmPassword
    );

    // Submit the form
    await signupPage.submitForm();

    // Assert: Verify successful signup and account page content
    expect(await accountPage.isOnAccountPage()).toBeTruthy();
    expect(await accountPage.isSuccessNotificationVisible()).toBeTruthy();

    // Verify user information is displayed correctly on account page
    expect(await accountPage.getProfileFullName()).toBe(testUser.name);
    expect(await accountPage.getProfileEmail()).toBe(testUser.email);
    expect(await accountPage.getDisplayedUserName()).toBe(testUser.name);
  });

  test("should display user data correctly in profile section", async ({
    signupPage,
    accountPage,
  }) => {
    // Generate unique test data
    const timestamp = Date.now();
    const testUser: SignupData = {
      name: "Profile Test User",
      email: `profiletest_${timestamp}@example.com`,
      password: "ProfileTest123!",
      confirmPassword: "ProfileTest123!",
    };

    // Complete signup flow
    await signupPage.goto();
    await signupPage.fillSignupForm(testUser);
    await signupPage.submitForm();

    // Verify profile information matches signup data
    expect(await accountPage.getProfileFullName()).toBe(testUser.name);
    expect(await accountPage.getProfileEmail()).toBe(testUser.email);

    // Verify the user name and email are displayed in the account header
    const displayedName = await accountPage.getDisplayedUserName();
    const displayedEmail = await accountPage.getDisplayedUserEmail();

    expect(displayedName).toBe(testUser.name);
    expect(displayedEmail).toBe(testUser.email);
  });
});
