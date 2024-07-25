import groq from "groq";
import type { Event } from "$models/sanity.model";
import type { RequestHandler } from "@sveltejs/kit";
import { client as sanityClient } from "$lib/sanity/client";
import { supabase } from "$lib/server/supabase/client";
import { CRON_SECRET } from "$env/static/private";

export const GET: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response("No access", { status: 401 });
  }

  try {
    const query = groq`*[_type == "event" && dateTime(end) < dateTime(now()) - 7*24*60*60]._id`;
    const events = await sanityClient.fetch<Event[]>(query);

    if (!events.length) {
      return new Response("No events to delete", { status: 204 });
    }

    const result = await supabase.from("event").delete().eq("document_id", events);

    if (result.error) {
      return new Response(result.error.message, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("An unexpected error occurred", { status: 500 });
  }
};
