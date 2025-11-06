/**
 * Sample Test Suite
 * Demonstrates the new structure with fixtures and services
 */

import { test, expect } from "../fixtures";

test.describe("Sample Tests", () => {
  test.beforeEach(async () => {
    console.log("Starting Sample test");
  });

  test("should Sample successfully with valid credentials", async ({
    samplePage,
  }) => {
    const testUser = {
      name: "testuser",
      email: `testuser_${Date.now()}@example.com`,
    };
    // AAA Pattern(Arrange-Act-Assert)
    // Arrange
    await samplePage.goto();

    await samplePage.fillSampleForm(testUser.name);

    // Act
    await samplePage.submitForm();

    // Assert
    const isSuccessfullySubmitted = await samplePage.isSuccessfullySubmitted();
    expect(isSuccessfullySubmitted).toBeTruthy();
  });
});
