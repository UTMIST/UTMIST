/**
 * Test Utilities
 * Common testing utilities, mocks, and helpers
 */

// Mock user data for testing
export const mockUsers = {
  validUser: {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { full_name: 'John Doe' },
    email_confirmed_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z'
  },
  unconfirmedUser: {
    id: 'user-456',
    email: 'unconfirmed@example.com',
    user_metadata: { full_name: 'Jane Smith' },
    email_confirmed_at: null,
    created_at: '2024-01-01T00:00:00Z'
  },
  adminUser: {
    id: 'admin-789',
    email: 'admin@example.com',
    user_metadata: { full_name: 'Admin User', role: 'admin' },
    email_confirmed_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z'
  }
};

// Mock session data
export const mockSessions = {
  validSession: {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    token_type: 'bearer',
    user: mockUsers.validUser
  },
  expiredSession: {
    access_token: 'expired-token',
    refresh_token: 'expired-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() - 3600000, // Expired
    token_type: 'bearer',
    user: mockUsers.validUser
  }
};

// Mock form data
export const mockFormData = {
  validLogin: {
    email: 'test@example.com',
    password: 'password123'
  },
  invalidLogin: {
    email: 'invalid-email',
    password: ''
  },
  validRegistration: {
    email: 'newuser@example.com',
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
    fullName: 'New User'
  },
  invalidRegistration: {
    email: 'invalid-email',
    password: 'weak',
    confirmPassword: 'different',
    fullName: ''
  },
  passwordReset: {
    email: 'reset@example.com'
  }
};

// Supabase response mocks
export const mockSupabaseResponses = {
  loginSuccess: {
    data: {
      user: mockUsers.validUser,
      session: mockSessions.validSession
    },
    error: null
  },
  loginInvalidCredentials: {
    data: { user: null, session: null },
    error: { message: 'Invalid login credentials' }
  },
  loginEmailNotConfirmed: {
    data: { user: null, session: null },
    error: { message: 'Email not confirmed' }
  },
  registrationSuccess: {
    data: {
      user: {
        ...mockUsers.validUser,
        email_confirmed_at: null
      },
      session: null
    },
    error: null
  },
  registrationEmailExists: {
    data: { user: null, session: null },
    error: { message: 'User already registered' }
  },
  passwordResetSuccess: {
    data: {},
    error: null
  },
  userAuthenticated: {
    data: { user: mockUsers.validUser },
    error: null
  },
  userNotAuthenticated: {
    data: { user: null },
    error: { message: 'JWT expired' }
  },
  logoutSuccess: {
    error: null
  }
};

// Helper to create mock Supabase client
export const createMockSupabaseClient = () => ({
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn(),
    resetPasswordForEmail: jest.fn()
  },
  from: jest.fn(() => ({
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    eq: jest.fn(),
    single: jest.fn()
  }))
});

// Helper to create mock auth state change subscription
export const createMockAuthSubscription = (callback?: jest.Mock) => ({
  data: {
    subscription: {
      id: 'mock-subscription-id',
      callback: callback || jest.fn(),
      unsubscribe: jest.fn()
    }
  }
});

// Test data generators
export const generateTestUser = (overrides: Partial<typeof mockUsers.validUser> = {}) => ({
  ...mockUsers.validUser,
  ...overrides,
  id: `user-${Math.random().toString(36).substr(2, 9)}`,
  email: overrides.email || `test-${Math.random().toString(36).substr(2, 9)}@example.com`
});

export const generateTestFormData = (type: 'login' | 'registration', overrides: any = {}) => {
  const baseData = type === 'login' ? mockFormData.validLogin : mockFormData.validRegistration;
  return {
    ...baseData,
    ...overrides
  };
};

// Validation test helpers
export const expectValidationError = (result: string | undefined, expectedMessage: string) => {
  expect(result).toBe(expectedMessage);
};

export const expectValidationSuccess = (result: string | undefined) => {
  expect(result).toBeUndefined();
};

// Auth flow test helpers
export const simulateLoginFlow = async (
  mockClient: ReturnType<typeof createMockSupabaseClient>,
  formData: typeof mockFormData.validLogin,
  expectedResponse: typeof mockSupabaseResponses.loginSuccess
) => {
  mockClient.auth.signInWithPassword.mockResolvedValue(expectedResponse);
  
  const result = await mockClient.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
  });
  
  return { result, mockCall: mockClient.auth.signInWithPassword };
};

export const simulateRegistrationFlow = async (
  mockClient: ReturnType<typeof createMockSupabaseClient>,
  formData: typeof mockFormData.validRegistration,
  expectedResponse: typeof mockSupabaseResponses.registrationSuccess
) => {
  mockClient.auth.signUp.mockResolvedValue(expectedResponse);
  
  const result = await mockClient.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName
      }
    }
  });
  
  return { result, mockCall: mockClient.auth.signUp };
};

// Common test assertions
export const assertSuccessfulAuth = (result: any) => {
  expect(result.error).toBeNull();
  expect(result.data.user).toBeDefined();
  expect(result.data.user.email).toBeDefined();
};

export const assertFailedAuth = (result: any, expectedErrorMessage?: string) => {
  expect(result.error).toBeDefined();
  expect(result.data.user).toBeNull();
  if (expectedErrorMessage) {
    expect(result.error.message).toBe(expectedErrorMessage);
  }
};

export const assertValidSession = (session: any) => {
  expect(session).toBeDefined();
  expect(session.access_token).toBeDefined();
  expect(session.user).toBeDefined();
  expect(session.expires_at).toBeGreaterThan(Date.now());
};

// Environment and cleanup helpers
export const setupTestEnvironment = () => {
  // Set up test environment variables
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
};

export const cleanupTestEnvironment = () => {
  // Clean up any test data or mocks
  jest.clearAllMocks();
};

// Mock implementations for Next.js
export const mockNextRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn()
};

export const mockNextNavigation = {
  useRouter: () => mockNextRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/'
};

// Helper to wait for async operations in tests
export const waitForAsync = (ms: number = 0) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate random test data
export const randomString = (length: number = 10) =>
  Math.random().toString(36).substring(2, length + 2);

export const randomEmail = () =>
  `test-${randomString(8)}@example.com`;

export const randomPassword = () =>
  `Pass${randomString(4)}123!`;

// Type helpers for tests
export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
export type TestUser = typeof mockUsers.validUser;
export type TestSession = typeof mockSessions.validSession; 