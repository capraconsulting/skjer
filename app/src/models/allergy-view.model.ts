import type { Database } from "./database.model";

type EventAllergySummaryView = Database["public"]["Views"]["event_allergy_summary"]["Row"];

export interface EventAllergySummary extends Omit<EventAllergySummaryView, "allergy_details"> {
  allergy_details: AllergyDetails[] | null;
}

interface AllergyDetails {
  participant_count: number | null;
  allergies: string[] | null;
}
