# Playwright Signup Form Test

This project demonstrates automated testing of a signup form using Playwright with dynamic data generation to avoid duplicate email issues.

## 🎯 Project Overview

This test automation framework explores the signup form at `https://dummy-demo-njndex.web.app/signup` and provides comprehensive test coverage including:

- ✅ Dynamic form data generation (prevents duplicate email errors)
- ✅ Form filling and submission
- ✅ Screenshot capture at different stages
- ✅ Form validation testing
- ✅ Multiple test scenarios

## 📁 Project Structure

```
src/
├── pages/
│   └── SignupPage.ts          # Page Object Model for signup page
├── tests/
│   ├── signup.spec.ts         # Comprehensive signup tests
│   └── signup-demo.spec.ts    # Simple demo test
├── config/
│   ├── constants.ts           # Application constants
│   └── environment.config.ts  # Environment configuration
└── core/
    └── base/
        └── BasePage.ts        # Base page class
```

## 🚀 Key Features

### Dynamic Data Generation
The tests use timestamp-based unique data generation to avoid duplicate email issues:

```typescript
// Generates unique test data every time
const testData = SignupPage.generateTestData();
// Example: testuser1762353228976@example.com
```

### Page Object Model
Clean, maintainable page objects with reusable methods:

```typescript
// SignupPage class with all form interactions
await signupPage.fillSignupForm(testData);
await signupPage.submitForm();
```

### Screenshot Automation
Automatic screenshot capture at key stages:
- Initial form state
- Form filled with data
- Submission result

## 📸 Generated Screenshots

After running tests, check the `test-results/` folder for:

- `demo-signup-initial.png` - Clean form state
- `demo-signup-filled.png` - Form with test data
- `demo-signup-result.png` - Post-submission result

## 🧪 Test Scenarios

### 1. Main Signup Flow (`signup-demo.spec.ts`)
```bash
npx playwright test signup-demo.spec.ts
```
- Fills form with dynamic data
- Submits form
- Takes screenshots at each step
- Validates successful submission

### 2. Comprehensive Tests (`signup.spec.ts`)
```bash
npx playwright test signup.spec.ts
```

**Test Cases:**
- ✅ Fill, Submit and Screenshot Result
- ✅ Fill Form with Different Email Domains  
- ✅ Verify Form Validation (empty fields, password mismatch)
- ✅ Test Google Signup Button
- ✅ Navigate to Login from Signup

## 🔧 Running Tests

### Prerequisites
```bash
npm install
npx playwright install
```

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test
```bash
npx playwright test signup-demo.spec.ts
```

### Run with UI Mode
```bash
npx playwright test --ui
```

### View Test Report
```bash
npx playwright show-report
```

## 💡 Key Implementation Details

### Dynamic Email Generation
```typescript
static generateTestData(): SignupFormData {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  
  return {
    name: `Test User ${timestamp}`,
    email: `testuser${timestamp}${randomNum}@example.com`,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
  };
}
```

### Screenshot Strategy
```typescript
// Take screenshots at key moments
await page.screenshot({ 
  path: 'test-results/demo-signup-initial.png',
  fullPage: true 
});
```

### Form Validation Detection
```typescript
async getValidationErrors(): Promise<string[]> {
  const errorElements = this.page.locator('[role="alert"], .error-message, .text-red-500');
  // Extract and return all error messages
}
```

## 📊 Test Results Example

```
Generated test data: {
  name: 'Test User 1762353228976',
  email: 'testuser17623532289767709@example.com'
}
📸 Screenshot taken: Initial form state
✅ Form filled with dynamic data  
📸 Screenshot taken: Form filled
🚀 Form submitted
📸 Screenshot taken: Form submission result
📊 Test Results:
  - Current URL: https://dummy-demo-njndex.web.app/account
  - Signup successful: true
✨ Test completed successfully!
```

## 🎨 Form Elements Tested

The signup form includes:
- Name input field
- Email input field  
- Password input field
- Confirm Password field
- Sign up button
- Google sign-in button
- Login navigation link

## 🛡️ Error Handling

The tests handle various scenarios:
- Empty form validation
- Password mismatch validation
- Network timeouts
- Unexpected redirects
- Form submission failures

## 📈 Benefits

1. **No Duplicate Email Issues**: Dynamic data generation ensures unique emails
2. **Visual Evidence**: Screenshots provide visual proof of test execution
3. **Comprehensive Coverage**: Tests multiple form scenarios
4. **Maintainable Code**: Page Object Model for easy maintenance
5. **Detailed Logging**: Console output shows test progress and results

## 🔍 Troubleshooting

### Common Issues:
1. **Test timeouts**: Increase timeout values in configuration
2. **Screenshot failures**: Ensure test-results directory exists
3. **Form changes**: Update locators in SignupPage.ts if form structure changes

### Debug Mode:
```bash
npx playwright test --debug
npx playwright test --headed
```

## 📝 Notes

- Tests run in Chromium by default
- Base URL is configured for the demo site
- Screenshots are saved in full-page format
- Test data includes timestamp for uniqueness
- Form validation errors are captured and logged

---

**Created**: November 2025  
**Framework**: Playwright + TypeScript  
**Target**: https://dummy-demo-njndex.web.app/signup