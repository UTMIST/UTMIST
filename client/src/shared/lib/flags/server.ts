// src/shared/lib/flags/server.ts — server-side flag evaluation (the swap seam).
//
// This module is server-only and is re-exported through `@/shared/lib/server`.
// Browser code must import only the types from `@/shared/lib`, never this file.
//
// The flag adapter is selected by environment (#447): the real Vercel Flags
// adapter whenever a per-environment SDK key is configured, the deterministic
// fixtures in local dev / CI without one, and a hard "off" adapter in production
// without a key (so the fixtures can never leak into production). #289 still
// replaces `betaStore` with the Supabase-backed store the same way.
// The failure-off wrapper and the exported function signatures stay the same,
// so no consuming code changes. See docs/client/flags.md.

import { fixtureBetaStore, fixtureFlagAdapter } from "./fixtures";
import type {
  BetaPreferenceStore,
  EvaluationContext,
  FlagAdapter,
  SetPreferenceResult,
} from "./types";

// --- Adapter bindings (the swap seam) ---------------------------------------
/** Every flag off — the safe binding for production with no Vercel context. */
const offAdapter: FlagAdapter = { evaluate: async () => undefined };

// Select the Vercel Flags SDK key for the current environment. Auth is an
// explicit per-env key, not OIDC: preview uses `FLAGS_KEY_PREVIEW`, everything
// else (development / local) uses `FLAGS_KEY_DEV`, and production is deliberately
// keyless so the redesign stays off there. Kept SDK-free (only `process.env`) so
// this module never imports `./vercel` eagerly — see the lazy import below.
function selectSdkKey(): string | undefined {
  if (process.env.VERCEL_ENV === "production") return undefined;
  if (process.env.VERCEL_ENV === "preview") return process.env.FLAGS_KEY_PREVIEW;
  return process.env.FLAGS_KEY_DEV;
}

// Resolve the flag adapter once. The Vercel adapter (and its
// `@vercel/flags-core` SDK) is **lazily imported** only when an SDK key is
// present, so dev/CI without one never loads the SDK — that keeps Jest off the
// SDK's ESM-only dependencies with no test-config changes.
let adapterPromise: Promise<FlagAdapter> | undefined;
function getFlagAdapter(): Promise<FlagAdapter> {
  if (!adapterPromise) {
    const sdkKey = selectSdkKey();
    adapterPromise = sdkKey
      ? import("./vercel").then((m) => m.createVercelFlagAdapter(sdkKey))
      : Promise.resolve(
          process.env.NODE_ENV === "production" ? offAdapter : fixtureFlagAdapter,
        );
  }
  return adapterPromise;
}

const betaStore: BetaPreferenceStore = fixtureBetaStore;
// ----------------------------------------------------------------------------

/** Context for an unknown / signed-out visitor: `public` cohort. */
const ANONYMOUS: EvaluationContext = { cohort: "public" };

/**
 * Evaluate one boolean flag for the given context, defaulting **off**.
 *
 * Per the #286 contract, this returns `false` for a missing flag, missing
 * configuration, or any evaluation failure, and treats a missing context as an
 * unknown (`public`) user so member-only flags stay off. Centralising this
 * here means every adapter — fixture or real — inherits the guarantee. A stale
 * provider read (cached definitions served after a disconnect) resolves rather
 * than throws, so the Vercel adapter turns that into `false` itself.
 */
export async function evaluateFlag(
  name: string,
  ctx: EvaluationContext = ANONYMOUS,
): Promise<boolean> {
  try {
    const adapter = await getFlagAdapter();
    return (await adapter.evaluate(name, ctx)) ?? false;
  } catch {
    return false;
  }
}

/**
 * Read a member's beta opt-in preference: `true`/`false`, or `null` when none
 * is stored or the read fails. (`null` is the safe, default-off read.)
 */
export async function getBetaPreference(
  userId: string,
): Promise<boolean | null> {
  try {
    return await betaStore.get(userId);
  } catch {
    return null;
  }
}

/**
 * Set `targetUserId`'s preference on behalf of `actorId`. Refusals surface as
 * a typed `SetPreferenceResult` (`denied` / `unauthenticated`); an unexpected
 * failure is normalised to `denied` so a broken write never silently succeeds.
 */
export async function setBetaPreference(
  actorId: string | null | undefined,
  targetUserId: string,
  optedIn: boolean,
): Promise<SetPreferenceResult> {
  try {
    return await betaStore.set(actorId, targetUserId, optedIn);
  } catch {
    return { ok: false, reason: "denied" };
  }
}
