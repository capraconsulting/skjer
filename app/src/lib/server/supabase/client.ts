import { type Database } from "$models/database.model";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseKey } from "./api";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
