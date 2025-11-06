/**
 * Application Constants
 * Centralized constants for better maintainability
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PRODUCTS: '/products',
  CART: '/cart',
  CHECKOUT: '/checkout',
} as const

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  VERY_LONG: 60000,
} as const

export const SELECTORS = {
  ROLE: {
    BUTTON: 'button',
    TEXTBOX: 'textbox',
    LINK: 'link',
    HEADING: 'heading',
    CHECKBOX: 'checkbox',
  },
  DATA_TESTID: {
    PROFILE_SECTION: '[data-testid="profile-section"]',
    USER_INFO: '[data-testid="user-info"]',
    DASHBOARD: '[data-testid="dashboard"]',
    LOGOUT_BUTTON: '[data-testid="logout-button"]',
  },
} as const

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Invalid password',
  PASSWORDS_MISMATCH: 'Passwords do not match',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
} as const

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  SIGNUP_SUCCESS: 'Signup successful',
  LOGOUT_SUCCESS: 'Logout successful',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export const TEST_DATA_DEFAULTS = {
  PASSWORD: 'secret',
  FULL_NAME: 'Test User',
  PHONE: '0905111222',
  CITY: 'Da nang',
  STATE: 'Danang',
  POSTAL_CODE: '55555',
  ADDRESS_LINE_1: 'Test Address',
} as const
