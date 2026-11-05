import type { PostgresAdapterArgs } from "@payloadcms/db-postgres";

import { PAYLOAD_DATABASE_SCHEMA } from "./config.ts";
import { SUPABASE_ROOT_CERTIFICATE } from "./supabase-ca.ts";

type Environment = { NODE_ENV?: string; VERCEL?: string; VERCEL_ENV?: string };

/** Automatic schema changes are only allowed against disposable local Postgres. */
export function payloadDatabaseOptions(connectionString: string, environment: Environment = process.env): PostgresAdapterArgs {
  let url: URL | undefined;
  try {
    url = new URL(connectionString);
  } catch {
    // Build-time placeholders never opt in to schema changes.
  }

  // Query parameters can override node-postgres connection properties.
  const push = environment.NODE_ENV === "development"
    && !environment.VERCEL && !environment.VERCEL_ENV
    && !!url && ["postgres:", "postgresql:"].includes(url.protocol)
    && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    && !url.search;

  const host = url?.searchParams.get("host") ?? url?.hostname ?? "";
  const isSupabase = host.endsWith(".supabase.co") || host.endsWith(".pooler.supabase.com");
  if (url && isSupabase) {
    // pg gives URI TLS options precedence over pool.ssl, including its CA.
    // Supabase always uses our verified TLS settings instead.
    for (const key of ["ssl", "sslmode", "sslcert", "sslkey", "sslrootcert", "sslnegotiation", "uselibpqcompat"]) {
      url.searchParams.delete(key);
    }
    connectionString = url.toString();
  }

  return {
    pool: {
      connectionString,
      max: 3,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 20_000,
      ...(isSupabase ? { ssl: { ca: SUPABASE_ROOT_CERTIFICATE, rejectUnauthorized: true } } : {}),
    },
    schemaName: PAYLOAD_DATABASE_SCHEMA,
    disableCreateDatabase: true,
    push,
  };
}
