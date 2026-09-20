// src/shared/lib/flags/fixtures.ts — deterministic synthetic adapters.
//
// These satisfy the same interfaces (`FlagAdapter`, `BetaPreferenceStore`) as
// the real adapters shipped later by #287/#447 (Vercel Flags) and #289
// (Supabase), so server/client examples and the opt-in UI (#290) can be built
// with no provider. They hold state in memory only — no network, no database —
// and are seeded with fixed data so behaviour is reproducible in tests.
//
// These fixtures must never become the production source: they are wired in
// `./server` as the current binding and are meant to be replaced there, not
// imported directly by feature code.

import type {
  BetaPreferenceStore,
  Cohort,
  EvaluationContext,
  FlagAdapter,
  SetPreferenceResult,
} from "./types";

/** Minimum cohort a fixture flag requires; `public` means available to all. */
interface FixtureFlag {
  enabled: boolean;
  minCohort?: Cohort;
}

/** Cohorts in ascending privilege, for `minCohort` comparisons. */
const COHORT_RANK: Record<Cohort, number> = {
  public: 0,
  member: 1,
  exec: 2,
  internal: 3,
};

/**
 * Default seed of synthetic flags. Names are illustrative — real flag keys are
 * introduced by consuming tasks. `betaFeature` is member-gated so tests can
 * exercise the unknown-user path.
 */
const DEFAULT_FLAGS: Readonly<Record<string, FixtureFlag>> = {
  showDemoBanner: { enabled: true },
  betaFeature: { enabled: true, minCohort: "member" },
  disabledExample: { enabled: false },
};

/**
 * Build a deterministic in-memory `FlagAdapter`. Unknown flag names resolve to
 * `undefined` (the evaluator turns that into the default-off `false`); flags
 * with a `minCohort` above the context's cohort resolve to `false`.
 */
export function createFixtureFlagAdapter(
  seed: Readonly<Record<string, FixtureFlag>> = DEFAULT_FLAGS,
): FlagAdapter {
  const flags = { ...seed };
  return {
    async evaluate(
      name: string,
      ctx: EvaluationContext,
    ): Promise<boolean | undefined> {
      const flag = flags[name];
      if (!flag) return undefined;
      if (flag.minCohort && COHORT_RANK[ctx.cohort] < COHORT_RANK[flag.minCohort]) {
        return false;
      }
      return flag.enabled;
    },
  };
}

/** Shared default fixture flag adapter (bound in `./server`). */
export const fixtureFlagAdapter: FlagAdapter = createFixtureFlagAdapter();

/**
 * Default seed of beta preferences, keyed by user id:
 * - `user-opted-in`  → opted in.
 * - `user-opted-out` → opted out.
 * - `user-admin`     → admin (may edit any preference).
 * Any other id has no stored preference (`get` → `null`).
 */
const DEFAULT_PREFERENCES: Readonly<Record<string, boolean>> = {
  "user-opted-in": true,
  "user-opted-out": false,
};

/** Ids the fixture treats as admins, allowed to edit others' preferences. */
const DEFAULT_ADMIN_IDS: readonly string[] = ["user-admin"];

/**
 * Build a deterministic in-memory `BetaPreferenceStore` with fresh state, so
 * tests do not leak writes between cases.
 *
 * Authorization mirrors the real contract (#289): a member may only edit their
 * own preference (`actorId === targetUserId`) unless they are an admin. An
 * absent actor is `unauthenticated`; any other cross-user write is `denied`.
 */
export function createFixtureBetaStore(
  seed: Readonly<Record<string, boolean>> = DEFAULT_PREFERENCES,
  adminIds: readonly string[] = DEFAULT_ADMIN_IDS,
): BetaPreferenceStore {
  const preferences = new Map<string, boolean>(Object.entries(seed));
  const admins = new Set(adminIds);

  return {
    async get(userId: string): Promise<boolean | null> {
      return preferences.has(userId) ? preferences.get(userId)! : null;
    },

    async set(
      actorId: string | null | undefined,
      targetUserId: string,
      optedIn: boolean,
    ): Promise<SetPreferenceResult> {
      if (!actorId) {
        return { ok: false, reason: "unauthenticated" };
      }
      const editingSelf = actorId === targetUserId;
      if (!editingSelf && !admins.has(actorId)) {
        return { ok: false, reason: "denied" };
      }
      preferences.set(targetUserId, optedIn);
      return { ok: true, optedIn };
    },
  };
}

/** Shared default fixture beta-preference store (bound in `./server`). */
export const fixtureBetaStore: BetaPreferenceStore = createFixtureBetaStore();
