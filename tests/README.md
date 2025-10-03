# Test Structure Guide

This directory contains all test files for the Talipapa-Web project.

## Directory Structure
```
tests/
├── unit/              # Unit tests for individual functions/components
├── integration/       # Integration tests for component interactions
├── e2e/              # End-to-end tests
├── __mocks__/        # Mock files for testing
├── fixtures/         # Test data and fixtures
└── utils/            # Test utilities and helpers
```

## Test Naming Conventions
- Unit tests: `ComponentName.test.js`
- Integration tests: `FeatureName.integration.test.js`
- E2E tests: `UserFlow.e2e.test.js`

## Running Tests
```bash
npm test                 # Run all tests
npm test -- --watch     # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage
```

## Test Guidelines
1. Write tests for all new components and functions
2. Aim for at least 80% code coverage
3. Use descriptive test names
4. Group related tests using `describe` blocks
5. Use `beforeEach` and `afterEach` for setup and cleanup