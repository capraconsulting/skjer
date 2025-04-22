# Test Coverage for Supabase Integration

This directory contains tests for the Supabase integration in the `app/src/lib/server/supabase` directory. The test coverage has been improved but still has room for further enhancement.

## Current Test Coverage

| File | % Statements | % Branches | % Functions | % Lines |
|------|-------------|-----------|------------|---------|
| api.ts | 100 | 100 | 100 | 100 |
| client.ts | 0 | 0 | 0 | 0 |
| queries.ts | 31.6 | 100 | 33.33 | 31.6 |
| **Overall** | 34.59 | 90 | 35.71 | 34.59 |

## Test Files

- `api.test.ts`: Tests for environment variable validation in the API configuration
- `queries.test.ts`: Tests for Supabase database query functions

## Running Tests

To run the tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

## Implemented Tests

### API Tests
- `assertEnvVar`: Tests for validating environment variables

### Queries Tests
- `getOrCreateEvent`: Tests for retrieving or creating an event
- `getEventParticipant`: Tests for retrieving a participant
- `deleteEventParticipant`: Tests for deleting a participant
- `setParticipantNotAttending`: Tests for updating a participant's attendance status

## Future Test Coverage Improvements

The following functions in `queries.ts` still need test coverage:

1. `updateEventParticipant`
2. `saveEventParticipant`
3. `saveEventParticipantOptions`
4. `getInternalParticipantNames`
5. `getNumberOfParticipants`
6. `getIsParticipantAttendingEvent`
7. `getParticipantAttendingEvents`
8. `getAttendingParticipants`

Additionally, `client.ts` has no test coverage and should be tested in the future.

## Testing Approach

The tests use Vitest and mock the Supabase client to test the functions without making actual database calls. This approach allows for testing the logic of the functions without requiring a real database connection.
