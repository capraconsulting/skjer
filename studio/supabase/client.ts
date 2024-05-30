import { createClient } from "@supabase/supabase-js";
import { Database } from "../models/database.model";

export const supabase = createClient<Database>(
  process.env.SANITY_STUDIO_SUPABASE_URL!,
  process.env.SANITY_STUDIO_SUPABASE_KEY!
);
