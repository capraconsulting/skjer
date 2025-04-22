import type { Tables } from "$models/database.model";

/**
 * Factory function to create a test event
 * @param overrides - Optional properties to override the default values
 * @returns A test event object
 */
export function createTestEvent(overrides?: Partial<Tables<"event">>): Tables<"event"> {
  return {
    id: 1,
    document_id: "test-document-id",
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Factory function to create a test event participant
 * @param overrides - Optional properties to override the default values
 * @returns A test event participant object
 */
export function createTestParticipant(overrides?: Partial<Tables<"event_participant">>): Tables<"event_participant"> {
  return {
    id: 1,
    event_id: 1,
    full_name: "Test User",
    email: "test@example.com",
    telephone: "12345678",
    firm: "Test Company",
    attending: true,
    attending_digital: false,
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Factory function to create multiple test participants
 * @param count - Number of participants to create
 * @param baseOverrides - Base properties to override for all participants
 * @returns An array of test event participant objects
 */
export function createTestParticipants(
  count: number,
  baseOverrides?: Partial<Tables<"event_participant">>
): Tables<"event_participant">[] {
  return Array.from({ length: count }, (_, index) =>
    createTestParticipant({
      id: index + 1,
      email: `test${index + 1}@example.com`,
      full_name: `Test User ${index + 1}`,
      ...baseOverrides
    })
  );
}

/**
 * Factory function to create a test event participant option
 * @param overrides - Optional properties to override the default values
 * @returns A test event participant option object
 */
export function createTestParticipantOption(
  overrides?: Partial<Tables<"event_participant_option">>
): Tables<"event_participant_option"> {
  return {
    id: 1,
    event_participant_id: 1,
    option_id: "test-option-id",
    option_value: "test-option-value",
    created_at: new Date().toISOString(),
    ...overrides
  };
}
