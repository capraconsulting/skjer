# Testing in Skjer

This directory contains the testing infrastructure for the Skjer application.

## Testing Framework

We use [Vitest](https://vitest.dev/) as our testing framework, which is optimized for Vite-based projects like SvelteKit.

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

- `src/test/setup.ts`: Global test setup and mocks
- `src/test/fixtures/`: Test data factories and fixtures
- `src/lib/**/__tests__/`: Unit tests for specific modules

## Test Fixtures

We use test fixtures to generate consistent test data. The fixtures are located in `src/test/fixtures/` and include:

- `event-fixtures.ts`: Factories for creating test events, participants, and participant options

Example usage:

```typescript
import { createTestEvent, createTestParticipant } from '../../../test/fixtures/event-fixtures';

// Create a test event
const event = createTestEvent({ document_id: 'custom-id' });

// Create a test participant
const participant = createTestParticipant({ email: 'custom@example.com' });
```

## Mocking

We use Vitest's mocking capabilities to mock external dependencies. Common mocks include:

- Environment variables
- Supabase client
- External APIs

Example of mocking the Supabase client:

```typescript
import { vi } from 'vitest';
import { supabase } from '$lib/server/supabase/client';

vi.mock('$lib/server/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    // ... other methods
  },
}));
```

## Best Practices

1. **Use the AAA pattern**: Arrange, Act, Assert
2. **Test edge cases**: Not just the happy path
3. **Keep tests isolated**: Each test should be independent
4. **Use descriptive test names**: Clearly describe what is being tested
5. **Use test fixtures**: For consistent test data
6. **Mock external dependencies**: To isolate the code being tested

## Future Improvements

- Add integration tests for database operations
- Expand e2e tests to cover all critical user journeys
- Implement visual regression testing for UI components
- Add load testing for critical endpoints
