import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
  const event = "Hei";

  // For simplicity, assume event details
  const eventDetails = {
    title: "Sample Event",
    description: "This is a sample event.",
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600 * 1000), // 1 hour later
  };

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
DTSTART:${eventDetails.startTime}
DTEND:${eventDetails.endTime}
END:VEVENT
END:VCALENDAR
`;

  return new Response(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="${event}.ics"`,
    },
  });
};
