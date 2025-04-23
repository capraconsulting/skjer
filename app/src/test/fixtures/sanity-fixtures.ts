import type { Event, Category } from "$models/sanity.model";
import type { EventWithAttending } from "$models/databaseView.model";

/**
 * Factory function to create a test Sanity event
 * @param overrides - Optional properties to override the default values
 * @returns A test Sanity event object
 */
export function createTestSanityEvent(overrides?: Partial<Event>): Event {
  return {
    _id: "test-id",
    _type: "event",
    _createdAt: "2023-01-01T00:00:00Z",
    _updatedAt: "2023-01-01T00:00:00Z",
    _rev: "test-rev",
    title: "Test Event",
    start: "2023-05-15T10:00:00Z",
    end: "2023-05-15T12:00:00Z",
    deadline: "2023-05-14T23:59:59Z",
    place: "Test Place",
    summary: "Test summary",
    category: "Fag",
    organisers: "Alle",
    isRecurring: false,
    interval: 1,
    frequence: "week",
    isDigital: false,
    openForExternals: true,
    visibleForExternals: true,
    foodPreference: false,
    emailTemplate: {
      _type: "emailTemplate",
      registrationSubject: "Registration",
      registrationMessage: [],
      unregistrationSubject: "Unregistration",
      unregistrationMessage: [],
      updateSubject: "Update",
      updateMessage: [],
      cancelSubject: "Cancel",
      cancelMessage: []
    },
    ...overrides
  };
}

/**
 * Factory function to create a test Sanity event with image
 * @param overrides - Optional properties to override the default values
 * @returns A test Sanity event object with image
 */
export function createTestSanityEventWithImage(overrides?: Partial<Event>): Event {
  return createTestSanityEvent({
    image: {
      _type: "image",
      asset: {
        _ref: "image-test-ref",
        _type: "reference"
      }
    },
    ...overrides
  });
}

/**
 * Factory function to create a test event with attending status
 * @param attending - Whether the user is attending the event
 * @param overrides - Optional properties to override the default values
 * @returns A test event with attending status
 */
export function createTestEventWithAttending(
  attending: boolean = false,
  overrides?: Partial<Event>
): EventWithAttending {
  return {
    ...createTestSanityEvent(overrides),
    attending
  };
}
