import postgres from "postgres";
import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import { SUPABASE_CONNECTION_STRING } from "$env/static/private";
import type { KyselyDatabase } from "$models/kysely.model";

export const kysely = new Kysely<KyselyDatabase>({
  dialect: new PostgresJSDialect({
    postgres: postgres(SUPABASE_CONNECTION_STRING),
  }),
});
