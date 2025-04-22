# Test Coverage for Utility Functions

This directory contains tests for the utility functions in the `app/src/lib/utils` directory. All utility functions now have 100% test coverage.

## Current Test Coverage

| File | % Statements | % Branches | % Functions | % Lines |
|------|-------------|-----------|------------|---------|
| date.util.ts | 100 | 100 | 100 | 100 |
| device.util.ts | 100 | 100 | 100 | 100 |
| domain.ts | 100 | 100 | 100 | 100 |
| form.util.ts | 100 | 100 | 100 | 100 |
| sanitize.util.ts | 100 | 100 | 100 | 100 |

## Test Files

- `date.util.test.ts`: Tests for date formatting and manipulation functions
- `device.util.test.ts`: Tests for browser and device detection functions
- `domain.test.ts`: Tests for email domain validation
- `form.util.test.ts`: Tests for form-related utility functions
- `sanitize.util.test.ts`: Tests for string sanitization functions

## Running Tests

To run the tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

## Future Test Coverage Improvements

While the utility functions now have 100% coverage, the overall project coverage is still low. Areas that need more tests include:

1. `app/src/lib/server/supabase` - Currently at 12.97% coverage
2. `app/src/routes` - Currently at 0% coverage
3. `app/src/lib/actions/external` and `app/src/lib/actions/internal` - Both at 0% coverage
4. `app/src/lib/email` - Currently at 0% coverage
5. `app/src/components` - Currently at 0% coverage

These areas should be prioritized for future test coverage improvements.
