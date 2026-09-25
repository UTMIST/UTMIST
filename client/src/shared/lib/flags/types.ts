// src/shared/lib/flags/types.ts — shared flag & beta-preference contracts.
//
// Client-safe: this module holds only types and pure helpers. It must never
// import the provider SDK, server-only code, or the fixtures/evaluator, so it
// can be re-exported through the universal `@/shared/lib` barrel and imported
// from browser components.
//
// The fixture adapters (`./fixtures`) and the real adapters shipped later by
// #287/#447 (Vercel Flags) and #289 (Supabase) implement the interfaces here.
// Keeping every adapter behind one contract is what lets a fixture be swapped
// for a live source with no change to consuming code.

import type { UserProfile } from "@/shared/lib/auth/types";

/**
 * Targeting cohorts, in ascending order of privilege (per F3.4 / #289).
 *
 * - `public`   — anyone, including signed-out and unknown users.
 * - `member`   — a signed-in UTMIST member.
 * - `exec`     — an executive.
 * - `internal` — internal/admin tooling audiences.
 */
export type Cohort = "public" | "member" | "exec" | "internal";

/**
 * The identity a flag is evaluated against. Built from the current
 * `UserProfile` for a signed-in user, or left anonymous for an unknown /
 * signed-out visitor. Unknown users resolve to the `public` cohort and never
 * qualify for member-only targeting (#286 contract).
 */
export interface EvaluationContext {
  /** Auth user id, when signed in. Absent for unknown / signed-out users. */
  userId?: string;
  /** The cohort this identity belongs to. Defaults to `public` when unknown. */
  cohort: Cohort;
}

/**
 * A single flag's on/off state, evaluated on the server.
 *
 * Flags are boolean throughout — there are no variant or multivalue flags.
 * Per #286, evaluation defaults **off**: a missing flag, missing configuration,
 * or an evaluation failure returns `false`.
 */
export type FlagEvaluator = (ctx?: EvaluationContext) => Promise<boolean>;

/**
 * A resolved, typed set of flags a server component passes to client
 * components as plain boolean props. Consuming tasks introduce the actual flag
 * keys; this is the shape they conform to.
 *
 * @example
 * type EigenFlags = FeatureFlags<"eigenAiRedesign">;
 */
export type FeatureFlags<Name extends string = string> = Readonly<
  Record<Name, boolean>
>;

/**
 * Raw flag source. A fixture (`./fixtures`) or a real provider adapter
 * (Vercel Flags, #287/#447) implements this; the shared evaluator in
 * `./server` wraps it with the default-off / failure-off guarantees so every
 * adapter inherits them identically.
 */
export interface FlagAdapter {
  /**
   * Look up one flag for the given context. May reject or return `undefined`
   * for an unknown flag — the evaluator translates both into `false`.
   */
  evaluate(name: string, ctx: EvaluationContext): Promise<boolean | undefined>;
}

/**
 * Result of a beta-preference **write**.
 *
 * This is the one place the contract is intentionally richer than a boolean:
 * a bare `boolean` cannot distinguish "the preference was set to `false`" from
 * "the change was refused". Modelling refusal explicitly lets #289 enforce
 * "a user cannot edit someone else's preference" (`denied`) and reject
 * unauthenticated writes (`unauthenticated`) without changing this interface.
 */
export type SetPreferenceResult =
  | { ok: true; optedIn: boolean }
  | { ok: false; reason: "denied" | "unauthenticated" };

/**
 * Read/write access to a member's beta opt-in preference.
 *
 * The fixture store (`./fixtures`) and the real Supabase-backed store (#289)
 * implement this identically. Reads are a plain `boolean | null`:
 *
 * - `true`  — opted in.
 * - `false` — opted out.
 * - `null`  — no stored preference / unknown user.
 *
 * Client-facing UI states (loading, request failure, signed-out) are the
 * concern of the opt-in interface (#290), derived from calling these methods
 * plus auth state — they are deliberately not part of this contract.
 */
export interface BetaPreferenceStore {
  /** The member's opt-in preference, or `null` when none is stored. */
  get(userId: string): Promise<boolean | null>;
  /**
   * Set `targetUserId`'s preference on behalf of `actorId`. A member may only
   * edit their own preference; anything else is `denied`.
   */
  set(
    actorId: string | null | undefined,
    targetUserId: string,
    optedIn: boolean,
  ): Promise<SetPreferenceResult>;
}

/**
 * Build an `EvaluationContext` from the current user profile, or an anonymous
 * context when signed out / unknown. Reuses the existing identity types as the
 * starting point (#372). The real cohort resolution (member/exec/internal)
 * lands with #289; until then a signed-in user is treated as `member` and an
 * admin as `internal`, which is enough for the default-off contract.
 */
export function contextFromProfile(
  profile: Pick<UserProfile, "id" | "admin"> | null | undefined,
): EvaluationContext {
  if (!profile?.id) {
    return { cohort: "public" };
  }
  return {
    userId: profile.id,
    cohort: profile.admin ? "internal" : "member",
  };
}
