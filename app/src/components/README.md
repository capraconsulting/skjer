# Components

This directory contains the Svelte components used in the application.

## Directory Structure

- `external/`: Components used for external users (non-logged-in users)
- `internal/`: Components used for internal users (logged-in users)
- `shared/`: Components used by both external and internal users
- `__tests__/`: Tests for the components

## Component Testing

Component tests have been added for several key components:

1. **EventCard**: Tests that the component renders event information correctly and links to the correct event page
2. **EventBadges**: Tests that the component renders the correct badges based on event properties
3. **RegistrationFoodPreference**: Tests that the component renders a form field for food preferences
4. **Deadline**: Tests that the component renders a deadline with formatted date and time
5. **FoodDeadline**: Tests that the component renders a food deadline with formatted date and time, and conditionally shows a message when the deadline has passed
6. **EventLogos**: Tests that the component renders the correct logos based on the event organizers and applies the correct height
7. **EventListItem**: Tests that the component renders the event title, links to the correct event page, and handles the target attribute correctly
8. **Link**: Tests that the component renders a link with the correct attributes based on the provided props
9. **EventInfoBox**: Tests that the component renders event information correctly, including category, date, time, place, food, available spots, and streaming link
10. **EventSummary**: Tests that the component renders event title, category, summary, image, and body correctly
11. **Footer**: Tests that the component renders company logos, certifications, and links correctly
12. **Header**: Tests that the component renders the logo and HeaderActions correctly, with conditional rendering based on the current page and device capabilities
13. **HeaderActions**: Tests that the component renders SignedOutMenu or SignedInDesktopMenu and SignedInMobileMenu based on authentication state
14. **LiveMode**: Tests that the component calls useLiveMode with the Sanity client when mounted
15. **RegistrationAttendingType**: Tests that the component renders radio buttons for selecting how to attend an event
16. **RegistrationCustomOption**: Tests that the component renders different input types based on the inputType prop
17. **SignedInDesktopMenu**: Tests that the component renders user information and buttons for creating events, subscribing to the calendar, and logging out
18. **SignedInMobileMenu**: Tests that the component renders a dropdown menu with buttons for creating events, subscribing to the calendar, and logging out
19. **SignedOutMenu**: Tests that the component renders a login button and dark mode toggle

To run the component tests, you need to install the testing library:

```bash
pnpm add -D @testing-library/svelte
```

Then you can run the tests with:

```bash
pnpm test src/components/__tests__
```

See the [Component Tests README](/__tests__/README.md) for more details on the testing approach.

## Known Issues and Future Improvements

Some of the tests are currently failing due to issues with mocking Svelte components. The main issue is that our mocking approach for Svelte components isn't working correctly with the testing library. The error message "default is not a constructor" suggests that we need to adjust our mocking approach.

For future improvements:

1. Use a more compatible mocking approach for Svelte components, such as using `vi.mock` with a factory function that returns a proper Svelte component constructor.
2. Consider using a more integrated testing approach that doesn't require mocking child components.
3. Add more integration tests that test multiple components working together.
4. Add more edge case tests for complex components.

## Adding New Components

When adding new components, consider the following:

1. Place the component in the appropriate directory based on its usage
2. Keep components small and focused on a single responsibility
3. Use TypeScript for type safety
4. Add tests for the component in the `__tests__` directory

## Component Best Practices

1. Use TypeScript for props and events
2. Document props with JSDoc comments
3. Use Tailwind CSS for styling
4. Keep components small and focused
5. Extract reusable logic to utility functions
6. Use Svelte's built-in reactivity
7. Write tests for components
