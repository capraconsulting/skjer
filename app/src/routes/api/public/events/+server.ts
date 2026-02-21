import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { getExternalFutureEvents } from "$lib/server/sanity/queries";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const events = await getExternalFutureEvents();

    const publicEvents = events.map(
      ({ _id, title, start, end, place, summary, category, organisers, isDigital, openForExternals }) => ({
        id: _id,
        title,
        start,
        end,
        place,
        summary: summary ?? null,
        category: category ?? null,
        organisers,
        isDigital,
        openForExternals,
        url: `${PUBLIC_APP_BASE_URL}/event/${_id}`,
      })
    );

    return json(publicEvents, {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Failed to fetch public events:", error);
    return json({ error: "Failed to fetch events" }, { status: 500 });
  }
};
