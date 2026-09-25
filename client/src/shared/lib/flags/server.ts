// Server-only public flag API. Keep the production guard outside the Flags SDK:
// an authenticated Explorer override bypasses a flag's decide function.
import type { NextRequest } from "next/server";

import { fixtureBetaStore } from "./fixtures";
import { evaluateProviderFlag } from "./provider";
import type {
  BetaPreferenceStore,
  EvaluationContext,
  SetPreferenceResult,
} from "./types";

const betaStore: BetaPreferenceStore = fixtureBetaStore;

export async function evaluateFlag(
  name: string,
  ctx: EvaluationContext = { cohort: "public" },
): Promise<boolean> {
  if (process.env.VERCEL_ENV === "production") return false;

  try {
    // No Explorer secret is required for provider evaluation or keyless local
    // fixtures. Import the framework integration only when Explorer is enabled.
    if (process.env.FLAGS_SECRET) {
      const { flagDefinitions } = await import("./definitions");
      const definition = Object.hasOwn(flagDefinitions, name)
        ? flagDefinitions[name]
        : undefined;
      if (definition) {
        const { cookies } = await import("next/headers");
        const cookie = (await cookies()).get("vercel-flag-overrides")?.value;
        if (cookie) {
          const { decryptOverrides, reportValue } = await import("flags");
          // flags@4.3.1 caches its last decrypted cookie across requests without
          // rechecking expiry. Validate again before entering that cached path.
          if ((await decryptOverrides(cookie)) === undefined) {
            const value = await evaluateProviderFlag(name, ctx);
            reportValue(name, value);
            return value;
          }
        }
        return (await definition.run({ identify: ctx })) === true;
      }
    }
    return await evaluateProviderFlag(name, ctx);
  } catch {
    return false;
  }
}

/** Authenticated discovery for the Vercel Toolbar; never evaluates the provider. */
export async function getFlagsDiscovery(request: NextRequest): Promise<Response> {
  if (process.env.FLAGS_SECRET) {
    try {
      const { discoveryHandler } = await import("./definitions");
      return await discoveryHandler(request);
    } catch {
      // Missing/malformed Explorer credentials must not expose definitions.
    }
  }
  return Response.json(null, {
    status: 401,
    headers: { "Cache-Control": "no-store" },
  });
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
