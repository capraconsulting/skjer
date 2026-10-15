import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { setParticipantNotAttending } from "$lib/server/kysley/transactions";
import { sendEmailDeclined } from "$lib/email/event/declined";
import { load } from "./+page.server";

vi.mock("$lib/auth/secret", () => ({ getUnsubscribeSecret: () => "secret" }));

vi.mock("$lib/server/kysley/transactions", () => ({
  setParticipantNotAttending: vi.fn(),
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

const data = {
  document_id: "6f1c2a52-6a0e-4c3a-9f55-0d6c7f1e2b3a",
  event_id: 1,
  email: "gina@example.org",
};

/** A guest following the link in their email; each token used once. */
const follow = (secret = "secret") =>
  load({
    params: { token: jwt.sign({ data, nonce: Math.random() }, secret) },
  } as unknown as Parameters<typeof load>[0]) as Promise<{
    success?: boolean;
    error?: boolean;
  }>;

describe("a guest unregistering by the link in their email", () => {
  beforeEach(() => {
    vi.mocked(sendEmailDeclined).mockClear();
    vi.mocked(setParticipantNotAttending).mockClear();
  });

  test("is told it went through, and emailed, once the signup is marked not attending", async () => {
    vi.mocked(setParticipantNotAttending).mockResolvedValue(1);

    const page = await follow();

    expect(setParticipantNotAttending).toHaveBeenCalledWith({
      event_id: 1,
      email: "gina@example.org",
    });
    expect(page.success).toBe(true);
    expect(sendEmailDeclined).toHaveBeenCalledOnce();
  });

  test("is told it failed, and not emailed, when nothing was changed", async () => {
    vi.mocked(setParticipantNotAttending).mockResolvedValue(0);

    const page = await follow();

    expect(page.error).toBe(true);
    expect(sendEmailDeclined).not.toHaveBeenCalled();
  });

  test("is told it failed, with nothing changed, when the link isn't one we signed", async () => {
    const page = await follow("not the secret");

    expect(page.error).toBe(true);
    expect(setParticipantNotAttending).not.toHaveBeenCalled();
    expect(sendEmailDeclined).not.toHaveBeenCalled();
  });
});
