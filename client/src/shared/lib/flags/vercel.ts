// src/shared/lib/flags/vercel.ts — real Vercel Flags adapter (server-only).
//
// This is the live `FlagAdapter` that #287/#447 promised: it implements the
// same interface as the fixtures (`./fixtures`), so `flags/provider.ts` selects it
// without any consuming code changing. It is server-only and reached only
// through `@/shared/lib/server`; browser code imports types from `@/shared/lib`.
//
// Provider: Vercel Flags via `@vercel/flags-core`'s `FlagsClient`. Auth uses
// automatic Vercel OIDC unless an explicit FLAGS SDK key is supplied by
// flags/provider.ts. OIDC is resolved inside a request, not at construction.
// The public evaluator keeps production off regardless of authentication.
//
// The flags/next declaration calls this adapter for provider evaluation. We
// retain the core client because @flags-sdk/vercel returns only the value and
// discards the freshness metrics needed to enforce failure-off (below).

import { createClient } from "@vercel/flags-core";

import type { FlagAdapter } from "./types";

/**
 * Flags this adapter resolves, by Vercel flag key. An undeclared name resolves
 * to `undefined` so the evaluator in `./provider` turns it into the default-off
 * `false`. Other consumers (e.g. #443 `CMS-Access`) add their key here to reuse
 * this single provider integration rather than wiring a second one.
 */
const DECLARED_FLAGS: ReadonlySet<string> = new Set([
  // The EigenAI redesign flag (#444). Kept off in production until launch.
  "Eigen-AI-Redesign",
]);

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
 * redesign on through an outage. (`VERCEL_FLAGS_DISABLE_DEFINITION_EMBEDDING=1`
 * separately keeps a build-time snapshot out of the bundle; it does not affect
 * this runtime cache.) A rejection propagates for the `./provider` wrapper to
 * turn into `false`.
 */
export function createVercelFlagAdapter(sdkKey?: string): FlagAdapter {
  const client = createClient(sdkKey);

  // EigenAI is an environment-level on/off, so no per-user targeting context is
  // threaded yet; cohort targeting (#289) is added later by passing entities to
  // `client.evaluate`. The signature omits the `ctx` argument (a shorter method
  // still satisfies the `FlagAdapter` interface) because it is not consumed.
  return {
    async evaluate(name: string) {
      if (!DECLARED_FLAGS.has(name)) return undefined;

      const result = await client.evaluate<boolean>(name, false);
      if (result.reason === "error") return false;
      if (result.metrics?.cacheStatus === "STALE") return false;
      return result.value === true;
    },
  };
}
