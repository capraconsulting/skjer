import groq from "groq";
import type { Event } from "$models/sanity.model";
import type { RequestHandler } from "@sveltejs/kit";
import { supabase } from "$lib/server/supabase/client";
import { CRON_SECRET } from "$env/static/private";
import { sanityClientPreviewDrafts } from "$lib/server/sanity/client";

export const GET: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response("No access", { status: 401 });
  }

  try {
    const query = groq`*[_type == "event" && dateTime(end) < dateTime(now()) - 30*24*60*60]._id`;
    const events = await sanityClientPreviewDrafts.fetch<Event[]>(query);

    if (!events.length) {
      return new Response("No events to delete", { status: 200 });
    }

    const result = await supabase.from("event").delete().in("document_id", events);

    if (result.error) {
      return new Response(result.error.message, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("An unexpected error occurred", { status: 500 });
  }
};
