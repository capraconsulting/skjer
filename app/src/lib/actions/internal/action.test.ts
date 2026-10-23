import { beforeEach, describe, expect, test, vi } from "vitest";
import { setParticipantNotAttending } from "$lib/server/kysley/transactions";
import { sendEmailDeclined } from "$lib/email/event/declined";
import { submitUnregistrationInternal } from "./action";

vi.mock("$lib/server/kysley/transactions", () => ({
  setParticipantNotAttending: vi.fn(),
  deleteEventParticipant: vi.fn(),
  executeTransaction: vi.fn(),
  insertAndGetEventParticipant: vi.fn(),
  insertEventFoodPreference: vi.fn(),
  insertEventParticipantOptions: vi.fn(),
}));

vi.mock("$lib/server/supabase/queries", () => ({
  getOrCreateEvent: vi.fn(() => Promise.resolve({ data: { event_id: 1 } })),
  getEventParticipant: vi.fn(() =>
    Promise.resolve({
      data: { email: "ola@capraconsulting.no", attending: true, event_id: 1 },
      error: null,
    })
  ),
}));

vi.mock("$lib/server/sanity/queries", () => ({
  getEventContent: vi.fn(() =>
    Promise.resolve({
      title: "Launch",
      summary: "",
      start: "2026-11-15T17:00:00.000Z",
      end: "2026-11-15T20:00:00.000Z",
      place: "Kantina",
      organisers: "Capra",
      emailTemplate: { unregistrationSubject: "", unregistrationMessage: "" },
    })
  ),
}));

vi.mock("$lib/email/event/declined", () => ({
  sendEmailDeclined: vi.fn(() => Promise.resolve({ error: null })),
}));

vi.mock("$lib/email/event/accepted", () => ({ sendEmailAccepted: vi.fn() }));

vi.mock("sveltekit-rate-limiter/server", () => ({
  RateLimiter: class {
    isLimited = () => Promise.resolve(false);
  },
}));

const eventId = "6f1c2a52-6a0e-4c3a-9f55-0d6c7f1e2b3a";

/** A member pressing "Meld meg av" on the event's page. */
const unregister = () =>
  submitUnregistrationInternal({
    request: new Request(`http://localhost/event/${eventId}`, {
      method: "POST",
      body: new FormData(),
    }),
    params: { id: eventId },
    locals: { auth: () => Promise.resolve({ user: { email: "ola@capraconsulting.no" } }) },
  } as unknown as Parameters<typeof submitUnregistrationInternal>[0]);

/** The message the member is shown. */
const shown = (result: unknown) =>
  (result as { form: { message: { text: string; success?: boolean; error?: boolean } } }).form
    .message;

describe("a member unregistering", () => {
  beforeEach(() => {
    vi.mocked(sendEmailDeclined).mockClear();
  });

  test("is told it went through, and emailed, once the signup is marked not attending", async () => {
    vi.mocked(setParticipantNotAttending).mockResolvedValue(1);

    const message = shown(await unregister());

    expect(setParticipantNotAttending).toHaveBeenCalledWith({
      event_id: 1,
      email: "ola@capraconsulting.no",
    });
    expect(message.success).toBe(true);
    expect(sendEmailDeclined).toHaveBeenCalledOnce();
  });

  test("is told it failed, and not emailed, when nothing was changed", async () => {
    vi.mocked(setParticipantNotAttending).mockResolvedValue(0);

    const message = shown(await unregister());

    expect(message.error).toBe(true);
    expect(message.success).toBeUndefined();
    expect(sendEmailDeclined).not.toHaveBeenCalled();
  });

  test("is told it failed, and not emailed, when the database refuses", async () => {
    vi.mocked(setParticipantNotAttending).mockRejectedValue(new Error("permission denied"));

    const message = shown(await unregister());

    expect(message.error).toBe(true);
    expect(sendEmailDeclined).not.toHaveBeenCalled();
  });
});
