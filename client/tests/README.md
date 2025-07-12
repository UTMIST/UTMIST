# Testing Documentation

This directory contains comprehensive tests for the UTMIST client application, including unit tests and integration tests for the authentication system.

## Test Structure

```
tests/
├── unit/                 # Unit tests for individual functions/components
│   └── validation.test.ts    # Form validation logic tests
├── integration/          # Integration tests for complete user flows
│   └── auth.test.ts         # Authentication flow tests
├── utils/               # Test utilities and helpers
│   └── test-utils.ts       # Common mocks, helpers, and test data
└── README.md           # This documentation
```

## Test Categories

### Unit Tests (`tests/unit/`)
- **Purpose**: Test individual functions and components in isolation
- **Focus**: Input/output validation, edge cases, error handling
- **Examples**: Form validation, utility functions, individual component logic

### Integration Tests (`tests/integration/`)
- **Purpose**: Test complete user workflows and system interactions
- **Focus**: End-to-end user journeys, API interactions, state management
- **Examples**: Login flow, registration process, password reset

### Test Utils (`tests/utils/`)
- **Purpose**: Provide common testing utilities and mocks
- **Includes**: Mock data, Supabase client mocks, helper functions, assertions

## Running Tests

Since the testing framework isn't currently installed, you'll need to set it up first:

### 1. Install Testing Dependencies

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### 2. Create Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/tests/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/not-found.tsx'
  ]
}

module.exports = createJestConfig(config)
```

### 3. Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration"
  }
}
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## Test Data and Mocks

### Mock Users
- `mockUsers.validUser`: Confirmed user with complete profile
- `mockUsers.unconfirmedUser`: User with unconfirmed email
- `mockUsers.adminUser`: Admin user with special permissions

### Mock Form Data
- `mockFormData.validLogin`: Valid login credentials
- `mockFormData.validRegistration`: Valid registration data
- `mockFormData.invalidLogin`: Invalid login data for error testing
- `mockFormData.invalidRegistration`: Invalid registration data

### Mock Supabase Responses
- `mockSupabaseResponses.loginSuccess`: Successful login response
- `mockSupabaseResponses.loginInvalidCredentials`: Failed login response
- `mockSupabaseResponses.registrationSuccess`: Successful registration
- And more...

## Testing Best Practices

### 1. Test Structure
- Use descriptive test names that explain what is being tested
- Group related tests using `describe` blocks
- Use `beforeEach` for setup and `afterEach` for cleanup

### 2. Assertions
- Use specific assertions (`toBe`, `toEqual`, `toBeUndefined`)
- Test both success and failure cases
- Verify mock function calls with correct parameters

### 3. Mocking
- Mock external dependencies (Supabase, Next.js router)
- Use the provided test utilities for consistent mocking
- Don't mock what you're testing

### 4. Test Data
- Use the provided mock data for consistency
- Generate random data for edge cases
- Keep test data realistic but minimal

## Example Test

```typescript
import { validateEmail } from '../../src/utils/validation';
import { expectValidationSuccess, expectValidationError } from '../utils/test-utils';

describe('validateEmail', () => {
  it('should validate correct email formats', () => {
    expectValidationSuccess(validateEmail('test@example.com'));
    expectValidationSuccess(validateEmail('user@mail.utoronto.ca'));
  });

  it('should reject invalid email formats', () => {
    expectValidationError(validateEmail(''), 'Email is required');
    expectValidationError(validateEmail('invalid'), 'Please enter a valid email address');
  });
});
```

## Coverage Goals

- **Unit Tests**: Aim for 90%+ coverage of utility functions
- **Integration Tests**: Cover all major user workflows
- **Edge Cases**: Test error conditions and boundary cases
- **Validation**: Comprehensive coverage of form validation logic

## Debugging Tests

- Use `console.log` sparingly in tests
- Use Jest's `--verbose` flag for detailed output
- Check mock implementations when tests fail unexpectedly
- Verify async operations complete before assertions

## Continuous Integration

When setting up CI/CD:
- Run tests on every pull request
- Require passing tests before merging
- Generate coverage reports
- Consider running tests in multiple environments

## Future Enhancements

- Add E2E tests with Playwright or Cypress
- Add visual regression testing
- Implement performance testing
- Add accessibility testing with jest-axe 