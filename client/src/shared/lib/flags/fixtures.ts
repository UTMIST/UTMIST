// Deterministic, in-memory implementations of FlagAdapter and BetaPreferenceStore.
// Fixed synthetic seeds make examples and tests reproducible without a network
// or database. Preference writes live only for the lifetime of the process.
//
// `./provider` selects the flag fixture only without Vercel context or provider
// credentials. Feature code uses the shared server API, not these fixtures directly.

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
 * Local flag defaults. For credential-free development, change a real flag's
 * `enabled` value and restart the dev server; restore false before committing.
 * `betaFeature` is member-gated so tests can exercise the unknown-user path.
 */
const DEFAULT_FLAGS: Readonly<Record<string, FixtureFlag>> = {
  showDemoBanner: { enabled: true },
  "CMS-Access": { enabled: false },
  "Web-Redesign": { enabled: false },
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

/** Shared default fixture flag adapter (selected in `./provider`). */
export const fixtureFlagAdapter: FlagAdapter = createFixtureFlagAdapter();

/**
 * Default seed of beta preferences, keyed by user id:
 * - `user-opted-in`  → opted in.
 * - `user-opted-out` → opted out.
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
 * A member may only edit their own preference (`actorId === targetUserId`)
 * unless they are an admin. An
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
