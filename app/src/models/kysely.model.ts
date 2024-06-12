import type { Database as SupabaseDatabase } from "$models/database.model";
import type { KyselifyDatabase } from "kysely-supabase";

export type KyselyDatabase = KyselifyDatabase<SupabaseDatabase>;
