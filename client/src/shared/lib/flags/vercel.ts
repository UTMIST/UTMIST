// src/shared/lib/flags/vercel.ts — real Vercel Flags adapter (server-only).
//
// Implements the same FlagAdapter contract as the fixtures (`./fixtures`).
// `flags/provider.ts` selects the adapter. Feature code accesses it through
// `@/shared/lib/server`; browser code imports types from `@/shared/lib`.
//
// Provider: Vercel Flags via `@vercel/flags-core`'s `FlagsClient`. Auth uses
// automatic Vercel OIDC unless an explicit FLAGS SDK key is supplied by
// flags/provider.ts. OIDC is resolved inside a request, not at construction.
// Production follows the provider value; browser overrides are ignored there.
//
// The flags/next declaration calls this adapter for provider evaluation. We
// retain the core client because @flags-sdk/vercel returns only the value and
// discards the freshness metrics needed to enforce failure-off (below).

import { createClient } from "@vercel/flags-core";

import { flagCatalog } from "./catalog";
import type { FlagAdapter } from "./types";

/**
 * Build the Vercel-backed adapter, using OIDC when no SDK key is supplied.
 * Do not call initialize() here: evaluate() initializes the SDK in the current
 * request, where the deployment's OIDC identity is available.
 *
 * Failure-off (#286): only a **fresh** `true` enables a flag. Anything else is
 * `false` — an evaluation error (including a missing definition), a
 * non-boolean value, or a **stale** read. The last case matters because once a
 * server instance has cached definitions, `@vercel/flags-core` keeps serving
 * them after the provider stream disconnects, tagged `cacheStatus: "STALE"`,
 * instead of throwing; without this check a warmed instance would keep the
 * flag on through an outage. (`VERCEL_FLAGS_DISABLE_DEFINITION_EMBEDDING=1`
 * separately keeps a build-time snapshot out of the bundle; it does not affect
 * this runtime cache.) A rejection propagates for the `./provider` wrapper to
 * turn into `false`.
 */
export function createVercelFlagAdapter(sdkKey?: string): FlagAdapter {
  const client = createClient(sdkKey);

  // Provider flags are evaluated at environment scope. No per-user entities are
  // sent to Vercel, so this adapter does not consume the interface's context.
  return {
    async evaluate(name: string) {
      if (!Object.hasOwn(flagCatalog, name)) return undefined;

      const result = await client.evaluate<boolean>(name, false);
      if (result.reason === "error") return false;
      if (result.metrics?.cacheStatus === "STALE") return false;
      return result.value === true;
    },
  };
}
