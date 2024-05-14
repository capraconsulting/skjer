import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export const supabase = createClient<Database>(
  process.env.SANITY_STUDIO_SUPABASE_URL!,
  process.env.SANITY_STUDIO_SUPABASE_KEY!
);
