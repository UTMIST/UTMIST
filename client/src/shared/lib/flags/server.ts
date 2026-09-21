// src/shared/lib/flags/server.ts — server-side flag evaluation (the swap seam).
//
// This module is server-only and is re-exported through `@/shared/lib/server`.
// Browser code must import only the types from `@/shared/lib`, never this file.
//
// It currently binds the deterministic fixtures. When the real adapters land,
// the ONLY change here is the two bindings below:
//   - #287/#447 replace `adapter` with the Vercel Flags adapter.
//   - #289 replaces `betaStore` with the Supabase-backed store.
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
const adapter: FlagAdapter = fixtureFlagAdapter;
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
 * here means every adapter — fixture or real — inherits the guarantee.
 */
export async function evaluateFlag(
  name: string,
  ctx: EvaluationContext = ANONYMOUS,
): Promise<boolean> {
  try {
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
