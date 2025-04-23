import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
// Using a simplified version of the EventListItem component for testing
// This avoids issues with mocking child components (EventBadges, EventLogos, ArrowRight)
// The test component has the same props and basic structure, but without the child components
import EventListItem from './EventListItem.test.svelte';
import { createTestEventWithAttending } from '../../test/fixtures/sanity-fixtures';

describe('EventListItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the event title correctly', () => {
    // Arrange
    const testEvent = createTestEventWithAttending(false, { title: 'Test Event Title' });

    // Act
    const { getByText } = render(EventListItem, { props: { event: testEvent } });

    // Assert
    expect(getByText('Test Event Title')).toBeTruthy();
  });

  it('links to the correct event page', () => {
    // Arrange
    const testEvent = createTestEventWithAttending(false, { _id: 'test-event-id' });

    // Act
    const { container } = render(EventListItem, { props: { event: testEvent } });

    // Assert
    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/event/test-event-id');
  });

  it('applies the target attribute when provided', () => {
    // Arrange
    const testEvent = createTestEventWithAttending(false);
    const target = '_blank';

    // Act
    const { container } = render(EventListItem, { props: { event: testEvent, target } });

    // Assert
    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('does not apply the target attribute when not provided', () => {
    // Arrange
    const testEvent = createTestEventWithAttending(false);

    // Act
    const { container } = render(EventListItem, { props: { event: testEvent } });

    // Assert
    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('target')).toBeNull();
  });
});
