// src/shared/lib/flags/server.ts — server-side flag evaluation (the swap seam).
//
// This module is server-only and is re-exported through `@/shared/lib/server`.
// Browser code must import only the types from `@/shared/lib`, never this file.
//
// Vercel deployments use automatic OIDC authentication. Local development can
// use credentials from `vercel env pull`, or fixtures when running offline.
// Unconfigured production builds stay off, never falling back to fixtures. #289 still
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

// Request-scoped OIDC tokens need not be present in process.env on Vercel.
// Select the live adapter by deployment context as well as local credentials;
// the SDK resolves authentication and the environment when a request evaluates.
// FLAGS is the SDK's standard optional credential; FLAGS_SECRET is unrelated
// to provider authentication and must never select the live adapter by itself.
function hasVercelContext(): boolean {
  return process.env.VERCEL === "1" || Boolean(
    process.env.VERCEL_ENV || process.env.VERCEL_OIDC_TOKEN || process.env.FLAGS,
  );
}

// Resolve the flag adapter once. The Vercel adapter (and its
// `@vercel/flags-core` SDK) is lazily imported so offline dev/CI never loads
// the SDK. Cache the client, not an initialization promise: authentication and
// initialization must happen inside evaluate(), in the current request.
let adapterPromise: Promise<FlagAdapter> | undefined;
function getFlagAdapter(): Promise<FlagAdapter> {
  if (!adapterPromise) {
    adapterPromise = hasVercelContext()
      ? import("./vercel").then((m) => m.createVercelFlagAdapter())
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
