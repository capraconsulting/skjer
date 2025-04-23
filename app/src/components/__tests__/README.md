# Component Tests

This directory contains tests for Svelte components in the application.

## Setup

To run these tests, you need to install the following dependencies:

```bash
pnpm add -D @testing-library/svelte jsdom
```

The tests require a DOM environment to run properly. This is configured in the package.json file with the `--environment jsdom` flag in the test scripts:

```json
"test": "vitest run --environment jsdom",
"test:watch": "vitest --environment jsdom"
```

This ensures that all tests run with the jsdom environment, which provides the DOM API needed for testing Svelte components.

## Running Tests

You can run the component tests using the following command:

```bash
pnpm test src/components/__tests__
```

## Test Structure

Each test file follows this structure:

1. Import the necessary testing utilities and the component to test
2. Mock any external dependencies used by the component
3. Create test fixtures for the component props
4. Write test cases that:
   - Render the component with specific props
   - Query the rendered output for expected elements
   - Assert that the component behaves as expected

## Components Tested

- **EventCard**: Tests that the component renders event information correctly and links to the correct event page
- **EventBadges**: Tests that the component renders the correct badges based on event properties
- **RegistrationFoodPreference**: Tests that the component renders a form field for food preferences
- **Deadline**: Tests that the component renders a deadline with formatted date and time
- **FoodDeadline**: Tests that the component renders a food deadline with formatted date and time, and conditionally shows a message when the deadline has passed
- **EventLogos**: Tests that the component renders the correct logos based on the event organizers and applies the correct height
- **EventListItem**: Tests that the component renders the event title, links to the correct event page, and handles the target attribute correctly
- **Link**: Tests that the component renders a link with the correct attributes based on the provided props
- **EventInfoBox**: Tests that the component renders event information correctly, including category, date, time, place, food, available spots, and streaming link
- **EventSummary**: Tests that the component renders event title, category, summary, image, and body correctly
- **Footer**: Tests that the component renders company logos, certifications, and links correctly
- **Header**: Tests that the component renders the logo and HeaderActions correctly, with conditional rendering based on the current page and device capabilities
- **HeaderActions**: Tests that the component renders SignedOutMenu or SignedInDesktopMenu and SignedInMobileMenu based on authentication state
- **LiveMode**: Tests that the component calls useLiveMode with the Sanity client when mounted
- **RegistrationAttendingType**: Tests that the component renders radio buttons for selecting how to attend an event
- **RegistrationCustomOption**: Tests that the component renders different input types based on the inputType prop
- **SignedInDesktopMenu**: Tests that the component renders user information and buttons for creating events, subscribing to the calendar, and logging out
- **SignedInMobileMenu**: Tests that the component renders a dropdown menu with buttons for creating events, subscribing to the calendar, and logging out
- **SignedOutMenu**: Tests that the component renders a login button and dark mode toggle

## Skipped Tests

The following components have skipped tests due to challenges with mocking flowbite-svelte components:

- **DarkMode**: This component uses the Button component from flowbite-svelte, which is difficult to mock correctly.
- **EventFilter**: This component uses the ButtonGroup and Button components from flowbite-svelte, which are difficult to mock correctly.

These tests can be revisited in the future when we have a better understanding of how to mock these components.

## Known Issues and Future Improvements

Some of the tests are currently failing due to issues with mocking Svelte components. The main issue is that our mocking approach for Svelte components isn't working correctly with the testing library. The error message "default is not a constructor" suggests that we need to adjust our mocking approach.

For future improvements:

1. Use a more compatible mocking approach for Svelte components, such as using `vi.mock` with a factory function that returns a proper Svelte component constructor.
2. Consider using a more integrated testing approach that doesn't require mocking child components.
3. Add more integration tests that test multiple components working together.
4. Add more edge case tests for complex components.

## Adding New Tests

To add tests for a new component:

1. Create a new test file named `ComponentName.test.ts`
2. Import the component and any necessary fixtures
3. Mock any external dependencies
4. Write test cases that cover the component's functionality
5. Run the tests to verify they pass
