// src/shared/lib/flags/vercel.ts — real Vercel Flags adapter (server-only).
//
// This is the live `FlagAdapter` that #287/#447 promised: it implements the
// same interface as the fixtures (`./fixtures`), so `flags/server.ts` swaps it
// in without any consuming code changing. It is server-only and reached only
// through `@/shared/lib/server`; browser code imports types from `@/shared/lib`.
//
// Provider: Vercel Flags via the #286 contract packages (`flags` +
// `@flags-sdk/vercel`). Auth is an explicit **per-environment SDK key**:
// `flags/server.ts` selects the key for the current `VERCEL_ENV`
// (`FLAGS_KEY_DEV` for development/local, `FLAGS_KEY_PREVIEW` for preview; there
// is no production key — production stays off) and passes it to
// `createVercelFlagAdapter`. `createVercelAdapter(sdkKey)` authenticates from
// that key alone, so no Vercel OIDC token / `vercel env pull` is required.

import { createVercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

import type { FlagAdapter } from "./types";

/**
 * Build the Vercel-backed `FlagAdapter` for a given SDK key. The key is selected
 * per environment in `./server` and passed in here, so this module never reads
 * `process.env` and stays a pure function of its argument.
 *
 * Each declared flag keeps `defaultValue: false` — the load-bearing default-off
 * guarantee: `flag()` returns it whenever `decide` throws or returns `undefined`
 * (missing configuration or an evaluation error). Combined with
 * `VERCEL_FLAGS_DISABLE_DEFINITION_EMBEDDING=1`, a runtime provider outage falls
 * back to this `false` rather than to a stale build-time snapshot, so a failure
 * can never silently enable the redesign.
 */
export function createVercelFlagAdapter(sdkKey: string): FlagAdapter {
  const adapter = createVercelAdapter(sdkKey);

  // The EigenAI redesign flag (#444). Kept off in production until launch.
  const eigenAiRedesign = flag<boolean>({
    key: "Eigen-AI-Redesign",
    adapter,
    defaultValue: false,
    description:
      "EigenAI website redesign (#444). Kept off in production until launch.",
  });

  // Declared flags keyed by their Vercel flag key. An unknown name resolves to
  // `undefined` so the evaluator in `./server` turns it into the default-off
  // `false`. Other consumers (e.g. #443 `CMS-Access`) add their key here to
  // reuse this single provider integration rather than wiring a second one.
  const flagsByKey: Readonly<Record<string, () => Promise<boolean>>> = {
    "Eigen-AI-Redesign": eigenAiRedesign,
  };

  // EigenAI is an environment-level on/off, so no per-user targeting context is
  // threaded yet; cohort targeting (#289) is added later via each flag's own
  // `identify`. The signature omits the `ctx` argument (a shorter method still
  // satisfies the `FlagAdapter` interface) precisely because it is not consumed.
  return {
    async evaluate(name: string) {
      const declared = flagsByKey[name];
      if (!declared) return undefined;
      return declared();
    },
  };
}
