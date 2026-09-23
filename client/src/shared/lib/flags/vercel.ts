// src/shared/lib/flags/vercel.ts — real Vercel Flags adapter (server-only).
//
// This is the live `FlagAdapter` that #287/#447 promised: it implements the
// same interface as the fixtures (`./fixtures`), so `flags/server.ts` swaps it
// in without any consuming code changing. It is server-only and reached only
// through `@/shared/lib/server`; browser code imports types from `@/shared/lib`.
//
// Provider: Vercel Flags via `@vercel/flags-core`'s `FlagsClient`. Auth is an
// explicit **per-environment SDK key**: `flags/server.ts` selects the key for
// the current `VERCEL_ENV` (`FLAGS_KEY_DEV` for development/local,
// `FLAGS_KEY_PREVIEW` for preview; there is no production key — production
// stays off) and passes it to `createVercelFlagAdapter`. `createClient(sdkKey)`
// authenticates from that key alone, so no Vercel OIDC token / `vercel env pull`
// is required.
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
 * Build the Vercel-backed `FlagAdapter` for a given SDK key. The key is selected
 * per environment in `./server` and passed in here, so this module never reads
 * `process.env` and stays a pure function of its argument.
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
export function createVercelFlagAdapter(sdkKey: string): FlagAdapter {
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
