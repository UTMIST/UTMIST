// src/shared/lib/flags/vercel.ts — real Vercel Flags adapter (server-only).
//
// This is the live `FlagAdapter` that #287/#447 promised: it implements the
// same interface as the fixtures (`./fixtures`), so `flags/server.ts` swaps it
// in without any consuming code changing. It is server-only and reached only
// through `@/shared/lib/server`; browser code imports types from `@/shared/lib`.
//
// Provider: Vercel Flags via `@vercel/flags-core`'s `FlagsClient`. Auth is an
// automatic Vercel OIDC (or the SDK's standard FLAGS credential). Vercel supplies
// the deployment identity and environment; local dev uses `vercel env pull`.
// FLAGS_SECRET is for Flags Explorer overrides, not SDK authentication.
//
// The client is used directly (not through `flags/next` + `@flags-sdk/vercel`)
// because those wrappers return only the evaluated value and discard the
// evaluation metrics — and the metrics are what reveal a stale read (below).

import { createClient } from "@vercel/flags-core";

import type { FlagAdapter } from "./types";

/**
 * Flags this adapter resolves, by Vercel flag key. An undeclared name resolves
 * to `undefined` so the evaluator in `./server` turns it into the default-off
 * `false`. Other consumers (e.g. #443 `CMS-Access`) add their key here to reuse
 * this single provider integration rather than wiring a second one.
 */
const DECLARED_FLAGS: ReadonlySet<string> = new Set([
  // The EigenAI redesign flag (#444). Kept off in production until launch.
  "Eigen-AI-Redesign",
]);

/**
 * Build the Vercel-backed adapter with the SDK's default authentication.
 * Do not eagerly initialize: request-scoped OIDC is only available when a
 * request evaluates a flag. Production uses its own dashboard configuration.
 *
 * Failure-off (#286): only a **fresh** `true` enables a flag. Anything else is
 * `false` — an evaluation error (including a missing definition), a
 * non-boolean value, or a **stale** read. The last case matters because once a
 * server instance has cached definitions, `@vercel/flags-core` keeps serving
 * them after the provider stream disconnects, tagged `cacheStatus: "STALE"`,
 * instead of throwing; without this check a warmed instance would keep the
 * redesign on through an outage. (`VERCEL_FLAGS_DISABLE_DEFINITION_EMBEDDING=1`
 * separately keeps a build-time snapshot out of the bundle; it does not affect
 * this runtime cache.) A rejection propagates for the `./server` wrapper to
 * turn into `false`.
 */
export function createVercelFlagAdapter(): FlagAdapter {
  const client = createClient(process.env.FLAGS || undefined);

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
