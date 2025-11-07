import { expect, test } from "vitest";
import { getContentSecurityPolicyForEmbed } from "$lib/auth/cors";

test("expected Content-Security-Policy for /embed", () => {
  expect(
    getContentSecurityPolicyForEmbed([
      "https://www.capraconsulting.no",
      "https://www.liflig.no",
      "https://www.fryde.no",
      "https://capra.sanity.studio",
    ])
  ).toBe(
    "frame-ancestors 'self'" +
      " https://www.capraconsulting.no https://capraconsulting.no" +
      " https://www.liflig.no https://liflig.no" +
      " https://www.fryde.no https://fryde.no" +
      " https://capra.sanity.studio"
  );
});
