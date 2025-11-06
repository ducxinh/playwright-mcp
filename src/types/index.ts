/**
 * Type Definitions
 * Centralized type definitions for better type safety
 */

export interface UserCredentials {
  username: string
  email: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData extends LoginCredentials {
  confirmPassword?: string
}

export interface UserProfile {
  id?: string
  email: string
  username: string
  fullName?: string
  phone?: string
  address?: Address
}

export interface Address {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country?: string
}

export interface TestData {
  userCredentials: UserCredentials
  password: string
  fullName: string
  phone: string
  address: Address
  baseUrl: string
}

export interface AuthState {
  isAuthenticated: boolean
  user?: UserProfile
  token?: string
}

export type TestStatus = 'passed' | 'failed' | 'skipped'

export interface TestResult {
  testName: string
  timestamp: string
  status: TestStatus
  userCredentials?: UserCredentials
  error?: string
  duration?: number
}

export interface PageLoadState {
  domcontentloaded: boolean
  networkidle: boolean
  load: boolean
}

export type WaitForState = 'visible' | 'hidden' | 'attached' | 'detached'
